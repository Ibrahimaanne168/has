from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import check_password_hash
from config import get_db
from routes.notifications_utils import notifier_roles, notifier_utilisateurs
import os

public = Blueprint("public", __name__)


@public.route("/")
def accueil():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT nom, description
        FROM filieres
        ORDER BY nom
    """)

    filieres = cursor.fetchall()

    return render_template(
        "public/accueil.html",
        filieres=filieres
    )

@public.route("/professeurs")
def professeurs():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # --- Paramètres de recherche ---
    nom = request.args.get("nom", "").strip()
    matiere_id = request.args.get("matiere", "").strip()
    filiere_id = request.args.get("filiere", "").strip()

    # --- Listes pour les filtres (select) ---
    cursor.execute("SELECT id, nom FROM filieres ORDER BY nom")
    filieres = cursor.fetchall()

    cursor.execute("SELECT id, nom FROM matieres ORDER BY nom")
    matieres = cursor.fetchall()

    # --- Construction dynamique de la requête ---
    query = """
        SELECT
            e.id AS enseignant_id,
            e.biographie,
            u.nom AS user_nom,
            u.prenom AS user_prenom,
            u.telephone AS user_telephone,
            u.photo AS user_photo,
            f.id AS filiere_id,
            f.nom AS filiere_nom
        FROM enseignants e
        JOIN users u ON e.user_id = u.id
        LEFT JOIN filieres f ON e.filiere_id = f.id
        WHERE 1=1
    """
    params = []

    if nom:
        query += " AND u.nom LIKE %s"
        params.append(f"%{nom}%")

    if filiere_id:
        query += " AND e.filiere_id = %s"
        params.append(filiere_id)

    if matiere_id:
        query += """
            AND e.id IN (
                SELECT enseignant_id FROM enseignant_matiere
                WHERE matiere_id = %s
            )
        """
        params.append(matiere_id)

    query += " ORDER BY u.nom"

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()

    # --- Récupération des matières enseignées par chaque professeur ---
    professeurs = []

    for row in rows:

        cursor.execute("""
            SELECT m.id, m.nom
            FROM matieres m
            JOIN enseignant_matiere em ON m.id = em.matiere_id
            WHERE em.enseignant_id = %s
            ORDER BY m.nom
        """, (row["enseignant_id"],))

        matieres_enseignees = cursor.fetchall()

        professeurs.append({
            "id": row["enseignant_id"],
            "biographie": row["biographie"],
            "filiere": {
                "id": row["filiere_id"],
                "nom": row["filiere_nom"]
            } if row["filiere_id"] else None,
            "user": {
                "nom": row["user_nom"],
                "prenom": row.get("user_prenom"),
                "telephone": row["user_telephone"],
                "photo": row["user_photo"]
            },
            "matieres": matieres_enseignees
        })

    return render_template(
        "public/professeurs.html",
        professeurs=professeurs,
        filieres=filieres,
        matieres=matieres
    )


@public.route("/contact", methods=["GET", "POST"])
def contact():
 
    db = get_db()
    cursor = db.cursor(dictionary=True)
 
    if request.method == "POST":
 
        nom = request.form.get("nom", "").strip()
        prenom = request.form.get("prenom", "").strip()
        telephone = request.form.get("telephone", "").strip() or None
        type_message = request.form.get("type_message", "").strip()
        sujet = request.form.get("sujet", "").strip()
        destinataire = request.form.get("destinataire", "").strip()
        destinataire_id = request.form.get("destinataire_id", "").strip() or None
        message = request.form.get("message", "").strip()
 
        types_valides = {
            "recommandation": "Recommandation",
            "reclamation": "Réclamation",
            "demande": "Demande",
            "question": "Question"
        }
        destinataires_valides = {
            "administration",
            "direction",
            "responsable_pedagogique",
            "enseignant"
        }
 
        erreurs = []
 
        if not nom or not prenom or not sujet or not message:
            erreurs.append("Merci de remplir tous les champs obligatoires.")
 
        if type_message not in types_valides:
            erreurs.append("Merci de sélectionner un type de message valide.")
 
        if destinataire not in destinataires_valides:
            erreurs.append("Merci de sélectionner un destinataire valide.")
 
        if destinataire == "enseignant" and not destinataire_id:
            erreurs.append("Merci de sélectionner l'enseignant concerné.")
 
        if erreurs:
            for erreur in erreurs:
                flash(erreur)
        else:
            sujet_complet = f"[{types_valides[type_message]}] {sujet}"
 
            cursor.execute("""
                INSERT INTO messages_contact
                    (nom, prenom, telephone, sujet, destinataire_type, destinataire_id, message)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                nom, prenom, telephone, sujet_complet,
                destinataire, destinataire_id if destinataire == "enseignant" else None,
                message
            ))
 
            db.commit()

            if destinataire == "enseignant" and destinataire_id:
                notifier_utilisateurs(db, [int(destinataire_id)], "message", f"Nouveau message : {sujet_complet}", url_for("professeur.messages"))
            else:
                notifier_roles(db, ["admin"], "message", f"Nouveau message : {sujet_complet}", url_for("admin.messages"))
            db.commit()
 
            flash("Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.")
            return redirect(url_for("public.contact"))
 
    cursor.execute("""
        SELECT u.id AS user_id, u.nom, u.prenom
        FROM enseignants e
        JOIN users u ON e.user_id = u.id
        ORDER BY u.nom
    """)
    enseignants = cursor.fetchall()
 
    return render_template(
        "public/contact.html",
        enseignants=enseignants
    )

@public.route("/presentation")
def presentation():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM filieres")
    nb_filieres = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM enseignants")
    nb_enseignants = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM matieres")
    nb_matieres = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM users")
    nb_etudiants = cursor.fetchone()["total"]  # À adapter si tu as une table etudiants

    return render_template(
        "public/presentation.html",
        nb_filieres=nb_filieres,
        nb_enseignants=nb_enseignants,
        nb_matieres=nb_matieres,
        nb_etudiants=nb_etudiants
    )

@public.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        login = request.form["login"]
        password = request.form["password"]

        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT users.*, roles.nom AS role
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE login=%s
        """,(login,))

        user = cursor.fetchone()

        if user and check_password_hash(user["password_hash"], password):

            session["user_id"] = user["id"]
            session["nom"] = user["nom"]
            session["prenom"] = user["prenom"]
            session["role"] = user["role"]

            # keep session persistent for a reasonable time
            session.permanent = True

            photo = user.get("photo")
            if photo:
                photo = photo.lstrip("/")
                if photo.startswith("static/"):
                    photo = photo[len("static/"):]
                session["photo"] = photo
            else:
                session["photo"] = None

            if user["role"] == "admin":
                return redirect(url_for("admin.dashboard"))
            elif user["role"] == "enseignant":
                return redirect(url_for("professeur.dashboard"))
            else:
                return redirect(url_for("etudiant.dashboard"))

        flash("Login ou mot de passe incorrect.")

    return render_template("login.html")


@public.route("/mot_de_passe_oublie")
def mot_de_passe_oublie():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.telephone FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE r.nom = 'admin' AND u.telephone IS NOT NULL
        LIMIT 1
    """)
    admin = cursor.fetchone()
    cursor.close()
 
    numero_whatsapp = None
    if admin and admin["telephone"]:
        chiffres = "".join(c for c in admin["telephone"] if c.isdigit())
        chiffres = chiffres.lstrip("0")
        if not chiffres.startswith("221"):
            chiffres = "221" + chiffres
        numero_whatsapp = chiffres
 
    return render_template("mot_de_passe_oublie.html", numero_whatsapp=numero_whatsapp)

@public.route('/logout')
def logout():
    session.clear()
    flash("Vous avez été déconnecté avec succès.")
    return redirect(url_for('public.accueil')) 
