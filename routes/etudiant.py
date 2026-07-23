import os
from flask import (
    Blueprint, render_template, session, redirect, url_for,
    flash, request, send_file
)
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from config import get_db
from routes.notifications_utils import notifier_roles, notifier_utilisateurs

etudiant = Blueprint("etudiant", __name__, url_prefix="/etudiant")


@etudiant.context_processor
def injecter_notifications():
    if session.get("role") != "etudiant" or "user_id" not in session:
        return {}

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT COUNT(*) AS total FROM notifications WHERE user_id = %s AND lu = FALSE",
        (session["user_id"],)
    )
    total = cursor.fetchone()["total"]
    return {"nb_notifications_non_lues": total}


@etudiant.route("/notifications")
def notifications():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM notifications WHERE user_id = %s ORDER BY id DESC",
        (session["user_id"],)
    )
    liste_notifications = cursor.fetchall()
    return render_template(
        "notifications.html",
        profil=profil,
        notifications=liste_notifications,
        notification_read_endpoint="etudiant.lire_notification",
    )


@etudiant.route("/notifications/<int:notification_id>/lire")
def lire_notification(notification_id):
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT lien FROM notifications WHERE id = %s AND user_id = %s",
        (notification_id, session["user_id"])
    )
    notif = cursor.fetchone()

    if not notif:
        flash("Notification introuvable.")
        return redirect(url_for("etudiant.notifications"))

    cursor.execute("UPDATE notifications SET lu = TRUE WHERE id = %s", (notification_id,))
    db.commit()
    return redirect(notif["lien"] or url_for("etudiant.notifications"))


# ============================================================
# Garde d'accès + profil courant
# ============================================================
# Contrairement à _admin_required() (qui ne renvoie qu'une redirection
# éventuelle), cette fonction renvoie aussi la fiche étudiant courante
# (jointe à users/filieres/classes) car presque toutes les pages
# étudiant en ont besoin pour filtrer leurs données.

def _etudiant_required():
    if "user_id" not in session:
        return None, redirect(url_for("public.login"))
    if session.get("role") != "etudiant":
        flash("Accès non autorisé.")
        return None, redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT e.id, e.user_id, e.filiere_id, e.classe_id, e.matricule,
               u.nom, u.prenom, u.login, u.telephone, u.photo,
               f.nom AS filiere_nom, c.nom AS classe_nom
        FROM etudiants e
        JOIN users u ON u.id = e.user_id
        JOIN filieres f ON f.id = e.filiere_id
        JOIN classes c ON c.id = e.classe_id
        WHERE e.user_id = %s
    """, (session["user_id"],))
    profil = cursor.fetchone()
    cursor.close()

    if not profil:
        flash("Profil étudiant introuvable.")
        return None, redirect(url_for("public.login"))

    return profil, None


# ============================================================
# DASHBOARD
# ============================================================

@etudiant.route("/dashboard")
def dashboard():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(DISTINCT c.id) AS nb
        FROM cours c
        LEFT JOIN cours_classe cc ON cc.cours_id = c.id
        WHERE c.classe_id = %s OR cc.classe_id = %s
    """, (profil["classe_id"], profil["classe_id"]))
    nb_cours = cursor.fetchone()["nb"]

    cursor.execute("""
        SELECT COUNT(*) AS nb FROM communiques WHERE archive = 0
    """)
    nb_communiques = cursor.fetchone()["nb"]

    cursor.execute("""
        SELECT COUNT(DISTINCT e.id) AS nb
        FROM emplois_du_temps e
        LEFT JOIN edt_classe ec ON ec.edt_id = e.id
        WHERE (e.classe_id = %s OR ec.classe_id = %s) AND e.actif = 1
    """, (profil["classe_id"], profil["classe_id"]))
    nb_edt_actifs = cursor.fetchone()["nb"]

    cursor.execute("""
        SELECT COUNT(*) AS nb FROM messages_contact
        WHERE nom = %s AND prenom = %s AND reponse IS NULL
    """, (profil["nom"], profil["prenom"]))
    nb_messages_attente = cursor.fetchone()["nb"]

    cursor.execute("""
        SELECT c.id, c.titre, c.date_publication
        FROM communiques c
        WHERE c.archive = 0
        ORDER BY c.mis_en_avant DESC, c.date_publication DESC
        LIMIT 3
    """)
    derniers_communiques = cursor.fetchall()

    cursor.close()

    return render_template(
        "etudiant/dashboard.html",
        profil=profil,
        nb_cours=nb_cours,
        nb_communiques=nb_communiques,
        nb_edt_actifs=nb_edt_actifs,
        nb_messages_attente=nb_messages_attente,
        derniers_communiques=derniers_communiques,
    )


# ============================================================
# COURS
# ============================================================

@etudiant.route("/cours")
def cours():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    recherche = request.args.get("q", "").strip()
    matiere_filtre = request.args.get("matiere", type=int)

    sql = """
        SELECT DISTINCT c.id, c.titre, c.description, c.niveau, c.lien_externe,
               m.nom AS matiere_nom, u.nom AS enseignant_nom, u.prenom AS enseignant_prenom,
               EXISTS(
                   SELECT 1 FROM favoris fav
                   WHERE fav.etudiant_id = %s AND fav.cours_id = c.id
               ) AS est_favori
        FROM cours c
        JOIN matieres m ON m.id = c.matiere_id
        JOIN enseignants e ON e.id = c.enseignant_id
        JOIN users u ON u.id = e.user_id
        LEFT JOIN cours_classe cc ON cc.cours_id = c.id
        WHERE (c.classe_id = %s OR cc.classe_id = %s)
    """
    params = [profil["id"], profil["classe_id"], profil["classe_id"]]

    if matiere_filtre:
        sql += " AND c.matiere_id = %s"
        params.append(matiere_filtre)
    if recherche:
        sql += " AND (c.titre LIKE %s OR m.nom LIKE %s)"
        like = f"%{recherche}%"
        params.extend([like, like])
    sql += " ORDER BY c.id DESC"

    cursor.execute(sql, params)
    cours_liste = cursor.fetchall()

    # Fichiers déposés pour chaque cours affiché
    for c in cours_liste:
        cursor.execute(
            "SELECT id, type_fichier, nom_original FROM fichiers_cours WHERE cours_id = %s",
            (c["id"],)
        )
        c["fichiers"] = cursor.fetchall()

    # Matières disponibles pour la classe de l'étudiant (filtre)
    cursor.execute("""
        SELECT DISTINCT m.id, m.nom
        FROM matieres m
        JOIN matiere_classe mc ON mc.matiere_id = m.id
        WHERE mc.classe_id = %s
        ORDER BY m.nom
    """, (profil["classe_id"],))
    matieres = cursor.fetchall()

    cursor.close()

    return render_template(
        "etudiant/cours.html",
        profil=profil,
        cours=cours_liste,
        matieres=matieres,
        recherche=recherche,
        matiere_filtre=matiere_filtre,
    )


@etudiant.route("/cours/favoris/<int:cours_id>", methods=["POST"])
def basculer_favori(cours_id):
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id FROM favoris WHERE etudiant_id=%s AND cours_id=%s",
        (profil["id"], cours_id)
    )
    existant = cursor.fetchone()

    if existant:
        cursor.execute("DELETE FROM favoris WHERE id=%s", (existant["id"],))
    else:
        cursor.execute(
            "INSERT INTO favoris (etudiant_id, cours_id) VALUES (%s, %s)",
            (profil["id"], cours_id)
        )
    db.commit()
    cursor.close()

    return redirect(request.referrer or url_for("etudiant.cours"))


@etudiant.route("/cours/fichier/<int:fichier_id>/telecharger")
def telecharger_fichier(fichier_id):
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT fc.*, c.classe_id, c.titre AS cours_titre
        FROM fichiers_cours fc
        JOIN cours c ON c.id = fc.cours_id
        LEFT JOIN cours_classe cc ON cc.cours_id = c.id
        WHERE fc.id = %s AND (c.classe_id = %s OR cc.classe_id = %s)
        LIMIT 1
    """, (fichier_id, profil["classe_id"], profil["classe_id"]))
    fichier = cursor.fetchone()

    if not fichier:
        cursor.close()
        flash("Fichier introuvable.")
        return redirect(url_for("etudiant.cours"))

    cursor.execute(
        "INSERT INTO logs (user_id, action, description) VALUES (%s, %s, %s)",
        (session["user_id"], "telechargement_cours", f"Téléchargement de « {fichier['nom_original']} » ({fichier['cours_titre']})")
    )
    db.commit()
    cursor.close()

    # Les fichiers sont stockés dans static/uploads/cours
    chemin = os.path.join("static", "uploads", "cours", fichier["chemin_fichier"])

    if not os.path.exists(chemin):
        flash("Le fichier n’existe plus sur le serveur.")
        return redirect(url_for("etudiant.cours"))

    return send_file(
        chemin,
        as_attachment=True,
        download_name=fichier["nom_original"]
    )


# ============================================================
# EMPLOI DU TEMPS
# ============================================================

@etudiant.route("/edt")
def edt():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT DISTINCT e.*
        FROM emplois_du_temps e
        LEFT JOIN edt_classe ec ON ec.edt_id = e.id
        WHERE (e.classe_id = %s OR ec.classe_id = %s) AND e.actif = 1
        ORDER BY e.date_publication DESC
    """, (profil["classe_id"], profil["classe_id"]))
    edt_actifs = cursor.fetchall()

    cursor.execute("""
        SELECT DISTINCT e.*
        FROM emplois_du_temps e
        LEFT JOIN edt_classe ec ON ec.edt_id = e.id
        WHERE (e.classe_id = %s OR ec.classe_id = %s) AND e.actif = 0
        ORDER BY e.date_publication DESC
        LIMIT 10
    """, (profil["classe_id"], profil["classe_id"]))
    edt_historique = cursor.fetchall()

    cursor.close()

    return render_template(
        "etudiant/edt.html",
        profil=profil,
        edt_actifs=edt_actifs,
        edt_historique=edt_historique,
    )


# ============================================================
# COMMUNIQUÉS
# ============================================================

@etudiant.route("/communiques")
def communiques():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT c.*, u.nom AS auteur_nom, u.prenom AS auteur_prenom
        FROM communiques c
        JOIN users u ON u.id = c.auteur_id
        WHERE c.archive = 0
        ORDER BY c.mis_en_avant DESC, c.date_publication DESC, c.id DESC
    """)
    communiques_liste = cursor.fetchall()

    cursor.close()

    return render_template(
        "etudiant/communiques.html",
        profil=profil,
        communiques=communiques_liste,
    )


# ============================================================
# MESSAGES
# ============================================================

@etudiant.route("/messages")
def messages():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM messages_contact
        WHERE nom = %s AND prenom = %s
        ORDER BY id DESC
    """, (profil["nom"], profil["prenom"]))
    messages_envoyes = cursor.fetchall()

    # Tous les enseignants de l'établissement, peu importe leur filière
    # (un étudiant doit pouvoir contacter n'importe quel professeur, pas
    # seulement ceux rattachés à sa propre filière).
    cursor.execute("""
        SELECT e.id, u.nom, u.prenom, f.nom AS filiere_nom
        FROM enseignants e
        JOIN users u ON u.id = e.user_id
        LEFT JOIN filieres f ON f.id = e.filiere_id
        ORDER BY u.nom, u.prenom
    """)
    enseignants = cursor.fetchall()

    cursor.close()

    return render_template(
        "etudiant/messages.html",
        profil=profil,
        messages=messages_envoyes,
        enseignants=enseignants,
    )

# ============================================================
# PROFIL
# ============================================================

@etudiant.route("/profil")
def profil():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    return render_template("etudiant/profil.html", profil=profil)


@etudiant.route("/profil/modifier", methods=["GET", "POST"])
def modifier_profil():
    profil, garde = _etudiant_required()
    if garde:
        return garde

    if request.method == "GET":
        return render_template("etudiant/profil_modifier.html", profil=profil)

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Changement de mot de passe (optionnel)
    if request.form.get("nouveau_mot_de_passe"):
        cursor.execute("SELECT password_hash FROM users WHERE id=%s", (profil["user_id"],))
        row = cursor.fetchone()
        if not check_password_hash(row["password_hash"], request.form.get("mot_de_passe_actuel", "")):
            cursor.close()
            flash("Mot de passe actuel incorrect, profil non modifié.")
            return redirect(url_for("etudiant.profil"))

        hash_mdp = generate_password_hash(request.form["nouveau_mot_de_passe"])
        cursor.execute("""
            UPDATE users SET nom=%s, prenom=%s, telephone=%s, password_hash=%s
            WHERE id=%s
        """, (
            request.form["nom"], request.form["prenom"],
            request.form.get("telephone"), hash_mdp, profil["user_id"]
        ))
    else:
        cursor.execute("""
            UPDATE users SET nom=%s, prenom=%s, telephone=%s
            WHERE id=%s
        """, (
            request.form["nom"], request.form["prenom"],
            request.form.get("telephone"), profil["user_id"]
        ))

    db.commit()
    cursor.close()

    flash("Profil mis à jour.")
    return redirect(url_for("etudiant.profil"))
