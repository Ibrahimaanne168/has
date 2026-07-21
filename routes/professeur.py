import os
from datetime import datetime
from flask import Blueprint, render_template, session, redirect, url_for, flash, request, send_file
from werkzeug.utils import secure_filename
from config import get_db
from routes.notifications_utils import notifier_roles, notifier_utilisateurs

professeur = Blueprint("professeur", __name__, url_prefix="/professeur")

UPLOAD_FOLDER_COURS = "static/uploads/cours"
UPLOAD_FOLDER_PHOTOS = "static/uploads/photos"
EXTENSIONS_PDF_AUTORISEES = {"pdf"}
EXTENSIONS_IMAGE_AUTORISEES = {"jpg", "jpeg", "png", "webp"}


def extension_autorisee(nom_fichier, extensions):
    return "." in nom_fichier and nom_fichier.rsplit(".", 1)[1].lower() in extensions


def get_enseignant_id(db):
    """Retourne l'id de la ligne `enseignants` liée à l'utilisateur connecté."""
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id FROM enseignants WHERE user_id = %s", (session["user_id"],))
    row = cursor.fetchone()
    return row["id"] if row else None


def classes_de_la_matiere(db, matiere_id):
    """Toutes les classes rattachées à une matière (table matiere_classe)."""
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT cl.id, cl.nom, cl.niveau, cl.filiere_id
        FROM classes cl
        JOIN matiere_classe mc ON mc.classe_id = cl.id
        WHERE mc.matiere_id = %s
        ORDER BY cl.id
    """, (matiere_id,))
    return cursor.fetchall()


def synchroniser_cours_classe(db, cours_id, classes):
    """Remplace les liaisons cours_classe d'un cours par la liste de classes donnée."""
    cursor = db.cursor(dictionary=True)
    cursor.execute("DELETE FROM cours_classe WHERE cours_id = %s", (cours_id,))
    for classe in classes:
        cursor.execute(
            "INSERT INTO cours_classe (cours_id, classe_id) VALUES (%s, %s)",
            (cours_id, classe["id"])
        )


def notifier_etudiants_classes(db, classes, contenu, lien):
    """Crée une notification de type 'cours' pour chaque étudiant des classes données."""
    if not classes:
        return

    classe_ids = [c["id"] for c in classes]
    placeholders = ",".join(["%s"] * len(classe_ids))

    cursor = db.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT u.id AS user_id
        FROM etudiants e
        JOIN users u ON e.user_id = u.id
        WHERE e.classe_id IN ({placeholders})
    """, tuple(classe_ids))
    etudiants = cursor.fetchall()

    user_ids = [etu["user_id"] for etu in etudiants]
    notifier_utilisateurs(db, user_ids, "cours", contenu, lien)
    notifier_roles(db, ["admin"], "cours", contenu, lien)


@professeur.context_processor
def injecter_notifications():
    """Rend le nombre de notifications non lues disponible dans tous les templates enseignant."""
    if session.get("role") != "enseignant" or "user_id" not in session:
        return {}

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT COUNT(*) AS total FROM notifications WHERE user_id = %s AND lu = FALSE",
        (session["user_id"],)
    )
    total = cursor.fetchone()["total"]
    return {"nb_notifications_non_lues": total}


# ---------------------------------------------------------------
# Tableau de bord
# ---------------------------------------------------------------
@professeur.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    enseignant_id = get_enseignant_id(db)

    cursor.execute("SELECT COUNT(*) AS total FROM cours WHERE enseignant_id = %s", (enseignant_id,))
    nb_cours = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS total FROM messages_contact
        WHERE destinataire_type = 'enseignant' AND destinataire_id = %s AND lu = FALSE
    """, (session["user_id"],))
    nb_messages_non_lus = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM communiques WHERE archive = FALSE")
    nb_communiques = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT c.id, c.titre, m.nom AS matiere_nom
        FROM cours c
        JOIN matieres m ON c.matiere_id = m.id
        WHERE c.enseignant_id = %s
        ORDER BY c.id DESC
        LIMIT 5
    """, (enseignant_id,))
    derniers_cours = cursor.fetchall()

    cursor.execute("""
        SELECT id, nom, prenom, sujet, lu
        FROM messages_contact
        WHERE destinataire_type = 'enseignant' AND destinataire_id = %s
        ORDER BY id DESC
        LIMIT 5
    """, (session["user_id"],))
    derniers_messages = cursor.fetchall()

    return render_template(
        "professeur/dashboard.html",
        nb_cours=nb_cours,
        nb_messages_non_lus=nb_messages_non_lus,
        nb_communiques=nb_communiques,
        derniers_cours=derniers_cours,
        derniers_messages=derniers_messages
    )


# ---------------------------------------------------------------
# Cours : liste + dépôt
# Le formulaire ne demande QUE la matière : le cours est
# automatiquement rattaché à toutes les classes associées à cette
# matière (table matiere_classe), via la table de liaison cours_classe.
# ---------------------------------------------------------------
@professeur.route("/cours", methods=["GET", "POST"])
def cours():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    enseignant_id = get_enseignant_id(db)

    if request.method == "POST":
        titre = request.form.get("titre", "").strip()
        description = request.form.get("description", "").strip()
        matiere_id = request.form.get("matiere_id", "").strip()
        lien_externe = request.form.get("lien_externe", "").strip() or None
        fichier = request.files.get("fichier")

        erreurs = []

        if not titre or not matiere_id:
            erreurs.append("Merci de remplir le titre et la matière.")

        if not fichier or fichier.filename == "":
            erreurs.append("Merci de sélectionner un fichier PDF.")
        elif not extension_autorisee(fichier.filename, EXTENSIONS_PDF_AUTORISEES):
            erreurs.append("Seuls les fichiers PDF sont acceptés.")

        classes_concernees = []
        if not erreurs:
            # On revérifie côté serveur que l'enseignant enseigne bien cette matière.
            cursor.execute(
                "SELECT 1 FROM enseignant_matiere WHERE enseignant_id = %s AND matiere_id = %s",
                (enseignant_id, matiere_id)
            )
            if not cursor.fetchone():
                erreurs.append("Vous n'êtes pas rattaché à cette matière.")
            else:
                classes_concernees = classes_de_la_matiere(db, matiere_id)
                if not classes_concernees:
                    erreurs.append("Cette matière n'est associée à aucune classe pour le moment. Contactez l'administration.")

        if erreurs:
            for erreur in erreurs:
                flash(erreur)
        else:
            classe_principale = classes_concernees[0]

            cursor.execute("""
                INSERT INTO cours (titre, description, matiere_id, enseignant_id, filiere_id, classe_id, niveau, lien_externe)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                titre, description, matiere_id, enseignant_id,
                classe_principale["filiere_id"], classe_principale["id"],
                classe_principale["niveau"], lien_externe
            ))
            db.commit()
            cours_id = cursor.lastrowid

            synchroniser_cours_classe(db, cours_id, classes_concernees)
            db.commit()

            notifier_etudiants_classes(
                db, classes_concernees,
                f"Nouveau cours déposé : {titre}",
                url_for("etudiant.dashboard")
            )
            db.commit()

            os.makedirs(UPLOAD_FOLDER_COURS, exist_ok=True)
            nom_original = secure_filename(fichier.filename)
            nom_stocke = f"{cours_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{nom_original}"
            fichier.save(os.path.join(UPLOAD_FOLDER_COURS, nom_stocke))

            cursor.execute("""
                INSERT INTO fichiers_cours (cours_id, type_fichier, nom_original, chemin_fichier)
                VALUES (%s, 'pdf', %s, %s)
            """, (cours_id, nom_original, nom_stocke))
            db.commit()

            flash(f"Le cours a bien été déposé pour {len(classes_concernees)} classe(s).")
            return redirect(url_for("professeur.cours"))

    recherche = request.args.get("q", "").strip()

    cursor.execute("""
        SELECT m.id, m.nom
        FROM matieres m
        JOIN enseignant_matiere em ON m.id = em.matiere_id
        WHERE em.enseignant_id = %s
        ORDER BY m.nom
    """, (enseignant_id,))
    matieres = cursor.fetchall()

    query = """
        SELECT
            c.id, c.titre, c.description, c.lien_externe,
            m.nom AS matiere_nom,
            (SELECT fc.id FROM fichiers_cours fc WHERE fc.cours_id = c.id AND fc.type_fichier = 'pdf' ORDER BY fc.id DESC LIMIT 1) AS fichier_id,
            (SELECT fc.nom_original FROM fichiers_cours fc WHERE fc.cours_id = c.id AND fc.type_fichier = 'pdf' ORDER BY fc.id DESC LIMIT 1) AS fichier_nom,
            (SELECT GROUP_CONCAT(cl2.nom ORDER BY cl2.nom SEPARATOR ', ')
                FROM cours_classe cc
                JOIN classes cl2 ON cc.classe_id = cl2.id
                WHERE cc.cours_id = c.id) AS classes_concernees
        FROM cours c
        JOIN matieres m ON c.matiere_id = m.id
        WHERE c.enseignant_id = %s
    """
    params = [enseignant_id]

    if recherche:
        query += " AND (c.titre LIKE %s OR m.nom LIKE %s)"
        params.extend([f"%{recherche}%", f"%{recherche}%"])

    query += " ORDER BY c.id DESC"

    cursor.execute(query, tuple(params))
    liste_cours = cursor.fetchall()

    return render_template(
        "professeur/cours.html",
        cours=liste_cours,
        matieres=matieres,
        recherche=recherche
    )


# ---------------------------------------------------------------
# Cours : modification
# ---------------------------------------------------------------
@professeur.route("/cours/<int:cours_id>/modifier", methods=["GET", "POST"])
def modifier_cours(cours_id):
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    enseignant_id = get_enseignant_id(db)

    cursor.execute(
        "SELECT * FROM cours WHERE id = %s AND enseignant_id = %s",
        (cours_id, enseignant_id)
    )
    cours_actuel = cursor.fetchone()

    if not cours_actuel:
        flash("Ce cours est introuvable ou ne vous appartient pas.")
        return redirect(url_for("professeur.cours"))

    if request.method == "POST":
        titre = request.form.get("titre", "").strip()
        description = request.form.get("description", "").strip()
        matiere_id = request.form.get("matiere_id", "").strip()
        lien_externe = request.form.get("lien_externe", "").strip() or None
        fichier = request.files.get("fichier")

        if not titre or not matiere_id:
            flash("Merci de remplir le titre et la matière.")
            return redirect(url_for("professeur.modifier_cours", cours_id=cours_id))

        cursor.execute(
            "SELECT 1 FROM enseignant_matiere WHERE enseignant_id = %s AND matiere_id = %s",
            (enseignant_id, matiere_id)
        )
        if not cursor.fetchone():
            flash("Vous n'êtes pas rattaché à cette matière.")
            return redirect(url_for("professeur.modifier_cours", cours_id=cours_id))

        classes_concernees = classes_de_la_matiere(db, matiere_id)
        if not classes_concernees:
            flash("Cette matière n'est associée à aucune classe pour le moment.")
            return redirect(url_for("professeur.modifier_cours", cours_id=cours_id))

        classe_principale = classes_concernees[0]

        if fichier and fichier.filename != "":
            if not extension_autorisee(fichier.filename, EXTENSIONS_PDF_AUTORISEES):
                flash("Seuls les fichiers PDF sont acceptés.")
                return redirect(url_for("professeur.modifier_cours", cours_id=cours_id))

            cursor.execute(
                "SELECT id, chemin_fichier FROM fichiers_cours WHERE cours_id = %s AND type_fichier = 'pdf'",
                (cours_id,)
            )
            anciens_fichiers = cursor.fetchall()

            for ancien in anciens_fichiers:
                ancien_chemin = os.path.join(UPLOAD_FOLDER_COURS, ancien["chemin_fichier"])
                if os.path.exists(ancien_chemin):
                    os.remove(ancien_chemin)
                cursor.execute("DELETE FROM fichiers_cours WHERE id = %s", (ancien["id"],))

            os.makedirs(UPLOAD_FOLDER_COURS, exist_ok=True)
            nom_original = secure_filename(fichier.filename)
            nom_stocke = f"{cours_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{nom_original}"
            fichier.save(os.path.join(UPLOAD_FOLDER_COURS, nom_stocke))

            cursor.execute("""
                INSERT INTO fichiers_cours (cours_id, type_fichier, nom_original, chemin_fichier)
                VALUES (%s, 'pdf', %s, %s)
            """, (cours_id, nom_original, nom_stocke))

        cursor.execute("""
            UPDATE cours
            SET titre = %s, description = %s, matiere_id = %s,
                filiere_id = %s, classe_id = %s, niveau = %s, lien_externe = %s
            WHERE id = %s AND enseignant_id = %s
        """, (
            titre, description, matiere_id, classe_principale["filiere_id"],
            classe_principale["id"], classe_principale["niveau"], lien_externe,
            cours_id, enseignant_id
        ))

        synchroniser_cours_classe(db, cours_id, classes_concernees)
        db.commit()

        notifier_etudiants_classes(
            db, classes_concernees,
            f"Cours mis à jour : {titre}",
            url_for("etudiant.dashboard")
        )
        db.commit()

        flash(f"Le cours a bien été mis à jour pour {len(classes_concernees)} classe(s).")
        return redirect(url_for("professeur.cours"))

    cursor.execute("""
        SELECT m.id, m.nom
        FROM matieres m
        JOIN enseignant_matiere em ON m.id = em.matiere_id
        WHERE em.enseignant_id = %s
        ORDER BY m.nom
    """, (enseignant_id,))
    matieres = cursor.fetchall()

    cursor.execute(
        "SELECT nom_original FROM fichiers_cours WHERE cours_id = %s AND type_fichier = 'pdf' ORDER BY id DESC LIMIT 1",
        (cours_id,)
    )
    fichier_actuel = cursor.fetchone()

    cursor.execute("""
        SELECT cl.nom
        FROM cours_classe cc
        JOIN classes cl ON cc.classe_id = cl.id
        WHERE cc.cours_id = %s
        ORDER BY cl.nom
    """, (cours_id,))
    classes_actuelles = cursor.fetchall()

    return render_template(
        "professeur/modifier_cours.html",
        cours=cours_actuel,
        matieres=matieres,
        fichier_actuel=fichier_actuel,
        classes_actuelles=classes_actuelles
    )


# ---------------------------------------------------------------
# Cours : suppression
# ---------------------------------------------------------------
@professeur.route("/cours/<int:cours_id>/supprimer", methods=["POST"])
def supprimer_cours(cours_id):
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    enseignant_id = get_enseignant_id(db)

    cursor.execute(
        "SELECT id FROM cours WHERE id = %s AND enseignant_id = %s",
        (cours_id, enseignant_id)
    )
    if not cursor.fetchone():
        flash("Ce cours est introuvable ou ne vous appartient pas.")
        return redirect(url_for("professeur.cours"))

    cursor.execute("SELECT id, chemin_fichier FROM fichiers_cours WHERE cours_id = %s", (cours_id,))
    fichiers = cursor.fetchall()

    for f in fichiers:
        chemin = os.path.join(UPLOAD_FOLDER_COURS, f["chemin_fichier"])
        if os.path.exists(chemin):
            os.remove(chemin)

    cursor.execute("DELETE FROM fichiers_cours WHERE cours_id = %s", (cours_id,))
    cursor.execute("DELETE FROM favoris WHERE cours_id = %s", (cours_id,))
    cursor.execute("DELETE FROM cours_classe WHERE cours_id = %s", (cours_id,))
    cursor.execute("DELETE FROM cours WHERE id = %s AND enseignant_id = %s", (cours_id, enseignant_id))
    db.commit()

    flash("Le cours a bien été supprimé.")
    return redirect(url_for("professeur.cours"))


# ---------------------------------------------------------------
# Téléchargement / consultation d'un fichier de cours
# ---------------------------------------------------------------
@professeur.route("/cours/fichier/<int:fichier_id>")
def telecharger_fichier(fichier_id):
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    enseignant_id = get_enseignant_id(db)

    cursor.execute("""
        SELECT fc.chemin_fichier, fc.nom_original
        FROM fichiers_cours fc
        JOIN cours c ON fc.cours_id = c.id
        WHERE fc.id = %s AND c.enseignant_id = %s
    """, (fichier_id, enseignant_id))
    fichier = cursor.fetchone()

    if not fichier:
        flash("Fichier introuvable.")
        return redirect(url_for("professeur.cours"))

    chemin = os.path.join(UPLOAD_FOLDER_COURS, fichier["chemin_fichier"])
    return send_file(chemin, as_attachment=False, download_name=fichier["nom_original"])


# ---------------------------------------------------------------
# Messages reçus
# ---------------------------------------------------------------
@professeur.route("/messages")
def messages():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, nom, prenom, sujet, lu, (reponse IS NOT NULL) AS a_reponse
        FROM messages_contact
        WHERE destinataire_type = 'enseignant' AND destinataire_id = %s
        ORDER BY lu ASC, id DESC
    """, (session["user_id"],))
    liste_messages = cursor.fetchall()

    return render_template("professeur/messages.html", messages=liste_messages)


@professeur.route("/messages/<int:message_id>", methods=["GET", "POST"])
def message_detail(message_id):
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM messages_contact
        WHERE id = %s AND destinataire_type = 'enseignant' AND destinataire_id = %s
    """, (message_id, session["user_id"]))
    msg = cursor.fetchone()

    if not msg:
        flash("Ce message est introuvable ou ne vous est pas destiné.")
        return redirect(url_for("professeur.messages"))

    if request.method == "POST":
        reponse = request.form.get("reponse", "").strip()

        if not reponse:
            flash("Merci de rédiger une réponse avant d'envoyer.")
        else:
            cursor.execute(
                "UPDATE messages_contact SET reponse = %s, lu = TRUE WHERE id = %s",
                (reponse, message_id)
            )
            db.commit()
            flash("Votre réponse a bien été envoyée.")
            return redirect(url_for("professeur.messages"))
    elif not msg["lu"]:
        cursor.execute("UPDATE messages_contact SET lu = TRUE WHERE id = %s", (message_id,))
        db.commit()
        msg["lu"] = True

    return render_template("professeur/message_detail.html", msg=msg)


# ---------------------------------------------------------------
# Notifications (alimentées entre autres par les nouveaux messages)
# ---------------------------------------------------------------
@professeur.route("/notifications")
def notifications():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, type, contenu, lien, lu
        FROM notifications
        WHERE user_id = %s
        ORDER BY lu ASC, id DESC
    """, (session["user_id"],))
    liste_notifications = cursor.fetchall()

    return render_template("professeur/notifications.html", notifications=liste_notifications)


@professeur.route("/notifications/<int:notification_id>/lire")
def lire_notification(notification_id):
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT lien FROM notifications WHERE id = %s AND user_id = %s",
        (notification_id, session["user_id"])
    )
    notif = cursor.fetchone()

    if not notif:
        flash("Notification introuvable.")
        return redirect(url_for("professeur.notifications"))

    cursor.execute("UPDATE notifications SET lu = TRUE WHERE id = %s", (notification_id,))
    db.commit()

    return redirect(notif["lien"] or url_for("professeur.notifications"))


# ---------------------------------------------------------------
# Profil : consultation (lecture seule)
# ---------------------------------------------------------------
@professeur.route("/profil")
def profil():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT u.*, e.biographie
        FROM users u
        JOIN enseignants e ON e.user_id = u.id
        WHERE u.id = %s
    """, (session["user_id"],))
    prof = cursor.fetchone()

    cursor.execute("""
        SELECT f.nom
        FROM filieres f
        JOIN enseignant_filiere ef ON f.id = ef.filiere_id
        JOIN enseignants e ON e.id = ef.enseignant_id
        WHERE e.user_id = %s
        ORDER BY f.nom
    """, (session["user_id"],))
    filieres_prof = cursor.fetchall()

    cursor.execute("""
        SELECT m.nom
        FROM matieres m
        JOIN enseignant_matiere em ON m.id = em.matiere_id
        JOIN enseignants e ON e.id = em.enseignant_id
        WHERE e.user_id = %s
        ORDER BY m.nom
    """, (session["user_id"],))
    matieres_prof = cursor.fetchall()

    return render_template(
        "professeur/profil.html",
        prof=prof,
        filieres_prof=filieres_prof,
        matieres_prof=matieres_prof
    )


# ---------------------------------------------------------------
# Profil : modification
# ---------------------------------------------------------------
@professeur.route("/profil/modifier", methods=["GET", "POST"])
def modifier_profil():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    if request.method == "POST":
        nom = request.form.get("nom", "").strip()
        prenom = request.form.get("prenom", "").strip()
        telephone = request.form.get("telephone", "").strip() or None
        biographie = request.form.get("biographie", "").strip() or None
        photo = request.files.get("photo")

        if not nom or not prenom:
            flash("Merci de remplir les champs obligatoires.")
            return redirect(url_for("professeur.modifier_profil"))

        chemin_photo = None
        if photo and photo.filename != "":
            if extension_autorisee(photo.filename, EXTENSIONS_IMAGE_AUTORISEES):
                os.makedirs(UPLOAD_FOLDER_PHOTOS, exist_ok=True)
                nom_fichier = secure_filename(f"user_{session['user_id']}_{photo.filename}")
                photo.save(os.path.join(UPLOAD_FOLDER_PHOTOS, nom_fichier))
                chemin_photo = f"uploads/photos/{nom_fichier}"
            else:
                flash("Format de photo non supporté (jpg, jpeg, png, webp).")
                return redirect(url_for("professeur.modifier_profil"))

        if chemin_photo:
            cursor.execute("""
                UPDATE users SET nom=%s, prenom=%s, telephone=%s, photo=%s
                WHERE id=%s
            """, (nom, prenom, telephone, chemin_photo, session["user_id"]))
            session["photo"] = chemin_photo
        else:
            cursor.execute("""
                UPDATE users SET nom=%s, prenom=%s, telephone=%s
                WHERE id=%s
            """, (nom, prenom, telephone, session["user_id"]))

        cursor.execute(
            "UPDATE enseignants SET biographie=%s WHERE user_id=%s",
            (biographie, session["user_id"])
        )

        db.commit()

        session["nom"] = nom
        session["prenom"] = prenom

        flash("Votre profil a bien été mis à jour.")
        return redirect(url_for("professeur.profil"))

    cursor.execute("""
        SELECT u.*, e.biographie
        FROM users u
        JOIN enseignants e ON e.user_id = u.id
        WHERE u.id = %s
    """, (session["user_id"],))
    prof = cursor.fetchone()

    return render_template("professeur/profil_modifier.html", prof=prof)


# ---------------------------------------------------------------
# Emploi du temps (vue enseignant)
# ---------------------------------------------------------------
@professeur.route("/edt")
def edt():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    enseignant_id = get_enseignant_id(db)

    # Récupère les filières rattachées à l'enseignant et leurs classes
    cursor.execute("SELECT filiere_id FROM enseignant_filiere WHERE enseignant_id = %s", (enseignant_id,))
    filieres_rows = cursor.fetchall()
    filiere_ids = [r['filiere_id'] for r in filieres_rows] if filieres_rows else []

    edt_actifs = []
    edt_historique = []

    if filiere_ids:
        # Récupérer les classes des filières
        placeholders = ",".join(["%s"] * len(filiere_ids))
        cursor.execute(f"SELECT id FROM classes WHERE filiere_id IN ({placeholders})", tuple(filiere_ids))
        classe_rows = cursor.fetchall()
        classe_ids = [r['id'] for r in classe_rows] if classe_rows else []

        if classe_ids:
            cph = ",".join(["%s"] * len(classe_ids))
            params = tuple(classe_ids + classe_ids)

            query_actifs = f"""
                                SELECT DISTINCT e.*
                                FROM emplois_du_temps e
                                LEFT JOIN edt_classe ec ON ec.edt_id = e.id
                                WHERE (e.classe_id IN ({cph}) OR ec.classe_id IN ({cph}))
                                    AND e.actif = 1
                                ORDER BY e.date_publication DESC
                        """
            cursor.execute(query_actifs, params)
            edt_actifs = cursor.fetchall()

            query_hist = f"""
                                SELECT DISTINCT e.*
                                FROM emplois_du_temps e
                                LEFT JOIN edt_classe ec ON ec.edt_id = e.id
                                WHERE (e.classe_id IN ({cph}) OR ec.classe_id IN ({cph}))
                                    AND e.actif = 0
                                ORDER BY e.date_publication DESC
                                LIMIT 10
                        """
            cursor.execute(query_hist, params)
            edt_historique = cursor.fetchall()

    cursor.close()

    return render_template(
        "professeur/edt.html",
        edt_actifs=edt_actifs,
        edt_historique=edt_historique,
    )


# ---------------------------------------------------------------
# Communiqués (lecture seule)
# ---------------------------------------------------------------
@professeur.route("/communiques")
def communiques():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "enseignant":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT c.*, u.nom AS auteur_nom, u.prenom AS auteur_prenom
        FROM communiques c
        JOIN users u ON u.id = c.auteur_id
        WHERE c.archive = 0
        ORDER BY c.mis_en_avant DESC, c.date_publication DESC, c.id DESC
    """)
    liste_communiques = cursor.fetchall()

    return render_template("professeur/communiques.html", communiques=liste_communiques)