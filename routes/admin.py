import os
import decimal
from datetime import datetime
from flask import Blueprint, render_template, session, redirect, url_for, flash, request, send_file
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import mysql.connector
from config import get_db
from routes.notifications_utils import notifier_roles, notifier_utilisateurs

admin = Blueprint("admin", __name__, url_prefix="/admin")


@admin.context_processor
def injecter_notifications():
    if session.get("role") != "admin" or "user_id" not in session:
        return {}

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT COUNT(*) AS total FROM notifications WHERE user_id = %s AND lu = FALSE",
        (session["user_id"],)
    )
    total = cursor.fetchone()["total"]
    return {"nb_notifications_non_lues": total}


@admin.route("/notifications")
def notifications():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "admin":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM notifications WHERE user_id = %s ORDER BY id DESC",
        (session["user_id"],)
    )
    liste_notifications = cursor.fetchall()
    return render_template(
        "notifications.html",
        notifications=liste_notifications,
        notification_read_endpoint="admin.lire_notification",
    )


@admin.route("/notifications/<int:notification_id>/lire")
def lire_notification(notification_id):
    if "user_id" not in session or session.get("role") != "admin":
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
        return redirect(url_for("admin.notifications"))

    cursor.execute("UPDATE notifications SET lu = TRUE WHERE id = %s", (notification_id,))
    db.commit()
    return redirect(notif["lien"] or url_for("admin.notifications"))


@admin.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "admin":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS nb FROM etudiants")
    nb_etudiants = cursor.fetchone()["nb"]

    cursor.execute("SELECT COUNT(*) AS nb FROM enseignants")
    nb_enseignants = cursor.fetchone()["nb"]

    cursor.execute("SELECT COUNT(*) AS nb FROM cours")
    nb_cours = cursor.fetchone()["nb"]

    cursor.execute("SELECT COUNT(*) AS nb FROM fichiers_cours")
    nb_telechargements = cursor.fetchone()["nb"]

    cursor.execute("SELECT COUNT(*) AS nb FROM messages_contact")
    nb_messages = cursor.fetchone()["nb"]

    cursor.execute("SELECT COUNT(*) AS nb FROM communiques")
    nb_communiques = cursor.fetchone()["nb"]

    cursor.execute("SELECT COUNT(*) AS nb FROM filieres")
    nb_filieres = cursor.fetchone()["nb"]

    # Visiteurs = connexions distinctes enregistrées dans le journal
    cursor.execute("SELECT COUNT(DISTINCT user_id) AS nb FROM logs WHERE action='connexion'")
    nb_visiteurs = cursor.fetchone()["nb"]

    cursor.execute("""
        SELECT c.titre AS titre, COUNT(f.id) AS nb
        FROM cours c
        LEFT JOIN favoris f ON f.cours_id = c.id
        GROUP BY c.id
        ORDER BY nb DESC
        LIMIT 4
    """)
    cours_populaires = cursor.fetchall()

    cursor.execute("""
        SELECT fl.nom AS nom, COUNT(c.id) AS nb
        FROM filieres fl
        JOIN cours c ON c.filiere_id = fl.id
        GROUP BY fl.id
        ORDER BY nb DESC
    """)
    filieres_actives = cursor.fetchall()
    max_cours = max([f["nb"] for f in filieres_actives], default=1)

    cursor.execute("SELECT * FROM messages_contact ORDER BY id DESC LIMIT 3")
    derniers_messages = cursor.fetchall()

    cursor.close()

    return render_template(
        "admin/dashboard.html",
        nb_etudiants=nb_etudiants,
        nb_enseignants=nb_enseignants,
        nb_cours=nb_cours,
        nb_telechargements=nb_telechargements,
        nb_messages=nb_messages,
        nb_communiques=nb_communiques,
        nb_filieres=nb_filieres,
        nb_visiteurs=nb_visiteurs,
        cours_populaires=cours_populaires,
        filieres_actives=filieres_actives,
        max_cours=max_cours,
        derniers_messages=derniers_messages,
    )


@admin.route("/backup", methods=["POST"])
def backup_database():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SHOW TABLES")
    tables = [row[0] for row in cursor.fetchall()]

    backup_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "database", "backups"))
    os.makedirs(backup_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_has_{timestamp}.sql"
    backup_path = os.path.join(backup_dir, filename)

    def escape_value(value):
        if value is None:
            return "NULL"
        if isinstance(value, bool):
            return "1" if value else "0"
        if isinstance(value, (int, float, decimal.Decimal)):
            return str(value)
        if isinstance(value, bytes):
            return "0x" + value.hex()
        text = str(value)
        text = text.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "\\r")
        return f"'{text}'"

    with open(backup_path, "w", encoding="utf-8") as output:
        output.write(f"-- Backup generated on {datetime.now().isoformat()}\n")
        output.write("SET FOREIGN_KEY_CHECKS=0;\n\n")

        for table in tables:
            cursor.execute(f"SHOW CREATE TABLE `{table}`")
            create_sql = cursor.fetchone()[1]
            output.write(f"DROP TABLE IF EXISTS `{table}`;\n")
            output.write(create_sql + ";\n\n")

            cursor.execute(f"SELECT * FROM `{table}`")
            rows = cursor.fetchall()
            if not rows:
                continue

            columns = [desc[0] for desc in cursor.description]
            col_list = ", ".join([f"`{col}`" for col in columns])

            for row in rows:
                values = ", ".join(escape_value(value) for value in row)
                output.write(f"INSERT INTO `{table}` ({col_list}) VALUES ({values});\n")
            output.write("\n")

        output.write("SET FOREIGN_KEY_CHECKS=1;\n")

    cursor.close()
    flash(f"Sauvegarde créée : {filename}")
    return redirect(url_for("admin.dashboard"))


# ============================================================
# FILIÈRES / CLASSES / MATIÈRES
# ============================================================

def _admin_required():
    if "user_id" not in session:
        return redirect(url_for("public.login"))
    if session.get("role") != "admin":
        flash("Accès non autorisé.")
        return redirect(url_for("public.login"))
    return None


@admin.route("/filieres")
def filieres():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT f.*,
               (SELECT COUNT(*) FROM classes WHERE filiere_id = f.id) AS nb_classes,
               (SELECT COUNT(DISTINCT mc.matiere_id)
                FROM matiere_classe mc
                JOIN classes cl ON cl.id = mc.classe_id
                WHERE cl.filiere_id = f.id) AS nb_matieres
        FROM filieres f ORDER BY f.nom
    """)
    filieres_liste = cursor.fetchall()

    cursor.execute("""
        SELECT c.*, f.nom AS filiere_nom
        FROM classes c JOIN filieres f ON f.id = c.filiere_id
        ORDER BY f.nom, c.nom
    """)
    classes_liste = cursor.fetchall()

    cursor.execute("""
        SELECT m.id, m.nom,
               GROUP_CONCAT(CONCAT(f.nom, ' / ', cl.nom) ORDER BY f.nom, cl.nom SEPARATOR ', ') AS classes_noms
        FROM matieres m
        LEFT JOIN matiere_classe mc ON mc.matiere_id = m.id
        LEFT JOIN classes cl ON cl.id = mc.classe_id
        LEFT JOIN filieres f ON f.id = cl.filiere_id
        GROUP BY m.id
        ORDER BY m.nom
    """)
    matieres_liste = cursor.fetchall()

    # Édition en cours (pré-remplissage du formulaire) ?
    edit_filiere, edit_classe, edit_matiere = None, None, None
    edit_matiere_classes = []

    edit_filiere_id = request.args.get("edit_filiere", type=int)
    if edit_filiere_id:
        cursor.execute("SELECT * FROM filieres WHERE id=%s", (edit_filiere_id,))
        edit_filiere = cursor.fetchone()

    edit_classe_id = request.args.get("edit_classe", type=int)
    if edit_classe_id:
        cursor.execute("SELECT * FROM classes WHERE id=%s", (edit_classe_id,))
        edit_classe = cursor.fetchone()

    edit_matiere_id = request.args.get("edit_matiere", type=int)
    if edit_matiere_id:
        cursor.execute("SELECT * FROM matieres WHERE id=%s", (edit_matiere_id,))
        edit_matiere = cursor.fetchone()
        if edit_matiere:
            cursor.execute("SELECT classe_id FROM matiere_classe WHERE matiere_id=%s", (edit_matiere_id,))
            edit_matiere_classes = [r["classe_id"] for r in cursor.fetchall()]

    cursor.close()

    return render_template(
        "admin/filieres.html",
        filieres=filieres_liste,
        classes=classes_liste,
        matieres=matieres_liste,
        edit_filiere=edit_filiere,
        edit_classe=edit_classe,
        edit_matiere=edit_matiere,
        edit_matiere_classes=edit_matiere_classes,
    )


# ---------------- Filières ----------------

@admin.route("/filieres/ajouter", methods=["POST"])
def ajouter_filiere():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO filieres (nom, description) VALUES (%s, %s)",
        (request.form["nom"], request.form.get("description"))
    )
    db.commit()
    cursor.close()
    flash("Filière ajoutée.")
    return redirect(url_for("admin.filieres"))


@admin.route("/filieres/<int:filiere_id>/modifier", methods=["POST"])
def modifier_filiere(filiere_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE filieres SET nom=%s, description=%s WHERE id=%s",
        (request.form["nom"], request.form.get("description"), filiere_id)
    )
    db.commit()
    cursor.close()
    flash("Filière modifiée.")
    return redirect(url_for("admin.filieres"))


@admin.route("/filieres/<int:filiere_id>/supprimer", methods=["POST"])
def supprimer_filiere(filiere_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM filieres WHERE id=%s", (filiere_id,))
    db.commit()
    cursor.close()
    flash("Filière supprimée.")
    return redirect(url_for("admin.filieres"))


# ---------------- Classes ----------------

@admin.route("/classes/ajouter", methods=["POST"])
def ajouter_classe():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO classes (filiere_id, nom, niveau) VALUES (%s, %s, %s)",
        (request.form["filiere_id"], request.form["nom"], request.form.get("niveau"))
    )
    db.commit()
    cursor.close()
    flash("Classe ajoutée.")
    return redirect(url_for("admin.filieres"))


@admin.route("/classes/<int:classe_id>/modifier", methods=["POST"])
def modifier_classe(classe_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE classes SET filiere_id=%s, nom=%s, niveau=%s WHERE id=%s",
        (request.form["filiere_id"], request.form["nom"], request.form.get("niveau"), classe_id)
    )
    db.commit()
    cursor.close()
    flash("Classe modifiée.")
    return redirect(url_for("admin.filieres"))


@admin.route("/classes/<int:classe_id>/supprimer", methods=["POST"])
def supprimer_classe(classe_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM classes WHERE id=%s", (classe_id,))
    db.commit()
    cursor.close()
    flash("Classe supprimée.")
    return redirect(url_for("admin.filieres"))


# ---------------- Matières ----------------

@admin.route("/matieres/ajouter", methods=["POST"])
def ajouter_matiere():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO matieres (nom) VALUES (%s)",
        (request.form["nom"],)
    )
    matiere_id = cursor.lastrowid

    classe_ids = request.form.getlist("classe_ids")
    for classe_id in classe_ids:
        cursor.execute(
            "INSERT INTO matiere_classe (matiere_id, classe_id) VALUES (%s, %s)",
            (matiere_id, classe_id)
        )

    db.commit()
    cursor.close()
    flash("Matière ajoutée.")
    return redirect(url_for("admin.filieres"))


@admin.route("/matieres/<int:matiere_id>/modifier", methods=["POST"])
def modifier_matiere(matiere_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE matieres SET nom=%s WHERE id=%s",
        (request.form["nom"], matiere_id)
    )

    cursor.execute("DELETE FROM matiere_classe WHERE matiere_id=%s", (matiere_id,))
    classe_ids = request.form.getlist("classe_ids")
    for classe_id in classe_ids:
        cursor.execute(
            "INSERT INTO matiere_classe (matiere_id, classe_id) VALUES (%s, %s)",
            (matiere_id, classe_id)
        )

    db.commit()
    cursor.close()
    flash("Matière modifiée.")
    return redirect(url_for("admin.filieres"))


@admin.route("/matieres/<int:matiere_id>/supprimer", methods=["POST"])
def supprimer_matiere(matiere_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM matiere_classe WHERE matiere_id=%s", (matiere_id,))
    cursor.execute("DELETE FROM matieres WHERE id=%s", (matiere_id,))
    db.commit()
    cursor.close()
    flash("Matière supprimée.")
    return redirect(url_for("admin.filieres"))


# ============================================================
# ÉTUDIANTS
# ============================================================

@admin.route("/etudiants")
def etudiants():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT e.id, e.matricule, e.filiere_id, e.classe_id,
               u.id AS user_id, u.nom, u.prenom, u.login, u.telephone,
               f.nom AS filiere_nom, c.nom AS classe_nom
        FROM etudiants e
        JOIN users u ON u.id = e.user_id
        JOIN filieres f ON f.id = e.filiere_id
        JOIN classes c ON c.id = e.classe_id
        ORDER BY u.nom, u.prenom
    """)
    etudiants_liste = cursor.fetchall()

    cursor.execute("SELECT * FROM filieres ORDER BY nom")
    filieres = cursor.fetchall()

    cursor.execute("SELECT * FROM classes ORDER BY nom")
    classes = cursor.fetchall()

    edit_etudiant = None
    edit_id = request.args.get("edit", type=int)
    if edit_id:
        cursor.execute("""
            SELECT e.*, u.nom, u.prenom, u.login, u.telephone
            FROM etudiants e JOIN users u ON u.id = e.user_id
            WHERE e.id=%s
        """, (edit_id,))
        edit_etudiant = cursor.fetchone()

    cursor.close()

    return render_template(
        "admin/etudiants.html",
        etudiants=etudiants_liste,
        filieres=filieres,
        classes=classes,
        edit_etudiant=edit_etudiant,
    )


@admin.route("/etudiants/ajouter", methods=["POST"])
def ajouter_etudiant():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM roles WHERE nom='etudiant'")
    role_id = cursor.fetchone()[0]

    hash_mdp = generate_password_hash(request.form["password"])

    cursor.execute("""
        INSERT INTO users (role_id, login, password_hash, nom, prenom, telephone)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        role_id, request.form["login"], hash_mdp,
        request.form["nom"], request.form["prenom"], request.form.get("telephone")
    ))
    db.commit()
    user_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO etudiants (user_id, filiere_id, classe_id, matricule)
        VALUES (%s, %s, %s, %s)
    """, (user_id, request.form["filiere_id"], request.form["classe_id"], request.form.get("matricule")))
    db.commit()
    notifier_roles(db, ["admin"], "info", f"Nouvel étudiant ajouté : {request.form['prenom']} {request.form['nom']}", url_for("admin.etudiants"))
    db.commit()
    cursor.close()

    flash("Étudiant ajouté.")
    return redirect(url_for("admin.etudiants"))


@admin.route("/etudiants/<int:etudiant_id>/modifier", methods=["POST"])
def modifier_etudiant(etudiant_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT user_id FROM etudiants WHERE id=%s", (etudiant_id,))
    row = cursor.fetchone()
    user_id = row["user_id"]

    if request.form.get("password"):
        hash_mdp = generate_password_hash(request.form["password"])
        cursor.execute("""
            UPDATE users SET nom=%s, prenom=%s, login=%s, telephone=%s, password_hash=%s
            WHERE id=%s
        """, (
            request.form["nom"], request.form["prenom"],
            request.form["login"], request.form.get("telephone"), hash_mdp, user_id
        ))
    else:
        cursor.execute("""
            UPDATE users SET nom=%s, prenom=%s, login=%s, telephone=%s
            WHERE id=%s
        """, (
            request.form["nom"], request.form["prenom"],
            request.form["login"], request.form.get("telephone"), user_id
        ))

    cursor.execute("""
        UPDATE etudiants SET filiere_id=%s, classe_id=%s, matricule=%s
        WHERE id=%s
    """, (request.form["filiere_id"], request.form["classe_id"], request.form.get("matricule"), etudiant_id))

    db.commit()
    cursor.close()

    flash("Étudiant modifié.")
    return redirect(url_for("admin.etudiants"))


@admin.route("/etudiants/<int:etudiant_id>/supprimer", methods=["POST"])
def supprimer_etudiant(etudiant_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT user_id FROM etudiants WHERE id=%s", (etudiant_id,))
    row = cursor.fetchone()

    try:
        cursor.execute("DELETE FROM favoris WHERE etudiant_id=%s", (etudiant_id,))
        cursor.execute("DELETE FROM etudiants WHERE id=%s", (etudiant_id,))
        if row:
            cursor.execute("DELETE FROM users WHERE id=%s", (row["user_id"],))
        db.commit()
        flash("Étudiant supprimé.")
    except mysql.connector.Error:
        db.rollback()
        flash("Impossible de supprimer cet étudiant (données liées existantes).")

    cursor.close()
    return redirect(url_for("admin.etudiants"))


# ============================================================
# ENSEIGNANTS
# ============================================================

@admin.route("/enseignants")
def enseignants():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT e.id, e.filiere_id, e.biographie,
               u.id AS user_id, u.nom, u.prenom, u.login, u.telephone,
               GROUP_CONCAT(DISTINCT f.nom ORDER BY f.nom SEPARATOR ', ') AS filieres_noms
        FROM enseignants e
        JOIN users u ON u.id = e.user_id
        LEFT JOIN enseignant_filiere ef ON ef.enseignant_id = e.id
        LEFT JOIN filieres f ON f.id = ef.filiere_id
        GROUP BY e.id
        ORDER BY u.nom, u.prenom
    """)
    enseignants_liste = cursor.fetchall()

    for ens in enseignants_liste:
        cursor.execute("""
            SELECT m.nom FROM matieres m
            JOIN enseignant_matiere em ON em.matiere_id = m.id
            WHERE em.enseignant_id = %s
        """, (ens["id"],))
        ens["matieres_noms"] = ", ".join(r["nom"] for r in cursor.fetchall())

    cursor.execute("SELECT * FROM filieres ORDER BY nom")
    filieres = cursor.fetchall()

    cursor.execute("SELECT * FROM matieres ORDER BY nom")
    matieres = cursor.fetchall()

    edit_enseignant = None
    matieres_selectionnees = []
    filieres_selectionnees = []
    edit_id = request.args.get("edit", type=int)
    if edit_id:
        cursor.execute("""
            SELECT e.*, u.nom, u.prenom, u.login, u.telephone
            FROM enseignants e JOIN users u ON u.id = e.user_id
            WHERE e.id=%s
        """, (edit_id,))
        edit_enseignant = cursor.fetchone()

        cursor.execute("SELECT matiere_id FROM enseignant_matiere WHERE enseignant_id=%s", (edit_id,))
        matieres_selectionnees = [r["matiere_id"] for r in cursor.fetchall()]

        cursor.execute("SELECT filiere_id FROM enseignant_filiere WHERE enseignant_id=%s", (edit_id,))
        filieres_selectionnees = [r["filiere_id"] for r in cursor.fetchall()]

    cursor.close()

    return render_template(
        "admin/enseignants.html",
        enseignants=enseignants_liste,
        filieres=filieres,
        matieres=matieres,
        edit_enseignant=edit_enseignant,
        matieres_selectionnees=matieres_selectionnees,
        filieres_selectionnees=filieres_selectionnees,
    )


@admin.route("/enseignants/ajouter", methods=["POST"])
def ajouter_enseignant():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM roles WHERE nom='enseignant'")
    role_id = cursor.fetchone()[0]

    hash_mdp = generate_password_hash(request.form["password"])

    # Handle optional photo upload
    photo_path = None
    photo = request.files.get("photo")
    if photo and photo.filename:
        from werkzeug.utils import secure_filename
        os.makedirs(os.path.join("static", "uploads", "profs"), exist_ok=True)
        filename = secure_filename(photo.filename)
        save_path = os.path.join("static", "uploads", "profs", filename)
        photo.save(save_path)
        photo_path = f"uploads/profs/{filename}"

    cursor.execute("""
        INSERT INTO users (role_id, login, password_hash, nom, prenom, telephone)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        role_id, request.form["login"], hash_mdp,
        request.form["nom"], request.form["prenom"], request.form.get("telephone")
    ))
    db.commit()
    user_id = cursor.lastrowid

    # If photo uploaded, update user record
    if photo_path:
        cursor.execute("UPDATE users SET photo=%s WHERE id=%s", (photo_path, user_id))
        db.commit()

    filieres_selected = request.form.getlist("filieres")
    filiere_principale = filieres_selected[0] if filieres_selected else None

    cursor.execute("""
        INSERT INTO enseignants (user_id, filiere_id, biographie)
        VALUES (%s, %s, %s)
    """, (user_id, filiere_principale, request.form.get("biographie")))
    db.commit()
    enseignant_id = cursor.lastrowid

    for filiere_id in filieres_selected:
        cursor.execute(
            "INSERT INTO enseignant_filiere (enseignant_id, filiere_id) VALUES (%s, %s)",
            (enseignant_id, filiere_id)
        )

    for matiere_id in request.form.getlist("matieres"):
        cursor.execute(
            "INSERT INTO enseignant_matiere (enseignant_id, matiere_id) VALUES (%s, %s)",
            (enseignant_id, matiere_id)
        )
    db.commit()
    notifier_roles(db, ["admin"], "info", f"Nouvel enseignant ajouté : {request.form['prenom']} {request.form['nom']}", url_for("admin.enseignants"))
    db.commit()
    cursor.close()

    flash("Enseignant ajouté.")
    return redirect(url_for("admin.enseignants"))


@admin.route("/enseignants/<int:enseignant_id>/modifier", methods=["POST"])
def modifier_enseignant(enseignant_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT user_id FROM enseignants WHERE id=%s", (enseignant_id,))
    row = cursor.fetchone()
    user_id = row["user_id"]

    if request.form.get("password"):
        hash_mdp = generate_password_hash(request.form["password"])
        cursor.execute("""
            UPDATE users SET nom=%s, prenom=%s, login=%s, telephone=%s, password_hash=%s
            WHERE id=%s
        """, (
            request.form["nom"], request.form["prenom"],
            request.form["login"], request.form.get("telephone"), hash_mdp, user_id
        ))
    else:
        cursor.execute("""
            UPDATE users SET nom=%s, prenom=%s, login=%s, telephone=%s
            WHERE id=%s
        """, (
            request.form["nom"], request.form["prenom"],
            request.form["login"], request.form.get("telephone"), user_id
        ))

    # Handle optional photo upload
    photo = request.files.get("photo")
    if photo and photo.filename:
        from werkzeug.utils import secure_filename
        os.makedirs(os.path.join("static", "uploads", "profs"), exist_ok=True)
        filename = secure_filename(photo.filename)
        save_path = os.path.join("static", "uploads", "profs", filename)
        photo.save(save_path)
        photo_path = f"uploads/profs/{filename}"
        cursor.execute("UPDATE users SET photo=%s WHERE id=%s", (photo_path, user_id))

    filieres_selected = request.form.getlist("filieres")
    filiere_principale = filieres_selected[0] if filieres_selected else None

    cursor.execute("""
        UPDATE enseignants SET filiere_id=%s, biographie=%s WHERE id=%s
    """, (filiere_principale, request.form.get("biographie"), enseignant_id))

    cursor.execute("DELETE FROM enseignant_filiere WHERE enseignant_id=%s", (enseignant_id,))
    for filiere_id in filieres_selected:
        cursor.execute(
            "INSERT INTO enseignant_filiere (enseignant_id, filiere_id) VALUES (%s, %s)",
            (enseignant_id, filiere_id)
        )

    cursor.execute("DELETE FROM enseignant_matiere WHERE enseignant_id=%s", (enseignant_id,))
    for matiere_id in request.form.getlist("matieres"):
        cursor.execute(
            "INSERT INTO enseignant_matiere (enseignant_id, matiere_id) VALUES (%s, %s)",
            (enseignant_id, matiere_id)
        )

    db.commit()
    cursor.close()

    flash("Enseignant modifié.")
    return redirect(url_for("admin.enseignants"))


@admin.route("/enseignants/<int:enseignant_id>/supprimer", methods=["POST"])
def supprimer_enseignant(enseignant_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT user_id FROM enseignants WHERE id=%s", (enseignant_id,))
    row = cursor.fetchone()

    try:
        cursor.execute("DELETE FROM enseignant_matiere WHERE enseignant_id=%s", (enseignant_id,))
        cursor.execute("DELETE FROM enseignants WHERE id=%s", (enseignant_id,))
        if row:
            cursor.execute("DELETE FROM users WHERE id=%s", (row["user_id"],))
        db.commit()
        flash("Enseignant supprimé.")
    except mysql.connector.Error:
        db.rollback()
        flash("Impossible de supprimer cet enseignant : il a des cours liés. Supprimez d'abord ses cours.")

    cursor.close()
    return redirect(url_for("admin.enseignants"))


# ============================================================
# COURS (contrôle total admin)
# ============================================================

@admin.route("/cours")
def cours():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT c.*, GROUP_CONCAT(DISTINCT cl.nom ORDER BY cl.nom SEPARATOR ', ') AS classes_noms,
               m.nom AS matiere_nom, u.nom AS ens_nom, u.prenom AS ens_prenom
        FROM cours c
        LEFT JOIN cours_classe cc ON cc.cours_id = c.id
        LEFT JOIN classes cl ON cl.id = cc.classe_id
        JOIN matieres m ON m.id = c.matiere_id
        JOIN enseignants e ON e.id = c.enseignant_id
        JOIN users u ON u.id = e.user_id
        GROUP BY c.id
        ORDER BY c.id DESC
    """)
    cours_liste = cursor.fetchall()

    cursor.execute("SELECT * FROM classes ORDER BY nom")
    classes = cursor.fetchall()
    cursor.execute("SELECT * FROM matieres ORDER BY nom")
    matieres = cursor.fetchall()
    cursor.execute("""
        SELECT e.id, u.nom, u.prenom FROM enseignants e
        JOIN users u ON u.id = e.user_id ORDER BY u.nom
    """)
    enseignants = cursor.fetchall()

    edit_cours = None
    classes_selectionnees = []
    edit_id = request.args.get("edit", type=int)
    if edit_id:
        cursor.execute("SELECT * FROM cours WHERE id=%s", (edit_id,))
        edit_cours = cursor.fetchone()
        cursor.execute("SELECT classe_id FROM cours_classe WHERE cours_id=%s", (edit_id,))
        classes_selectionnees = [r["classe_id"] for r in cursor.fetchall()]

    cursor.close()

    return render_template(
        "admin/cours.html",
        cours=cours_liste,
        classes=classes,
        matieres=matieres,
        enseignants=enseignants,
        edit_cours=edit_cours,
        classes_selectionnees=classes_selectionnees,
    )


@admin.route("/cours/ajouter", methods=["POST"])
def ajouter_cours():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    classes_selected = request.form.getlist("classes")
    classe_principale = classes_selected[0] if classes_selected else None
    filiere_principale = None
    if classe_principale:
        cursor.execute("SELECT filiere_id FROM classes WHERE id=%s", (classe_principale,))
        row = cursor.fetchone()
        filiere_principale = row[0] if row else None

    cursor.execute("""
        INSERT INTO cours (titre, description, matiere_id, enseignant_id, filiere_id, classe_id, niveau, lien_externe)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        request.form["titre"], request.form.get("description"),
        request.form["matiere_id"], request.form["enseignant_id"],
        filiere_principale, classe_principale,
        request.form.get("niveau"), request.form.get("lien_externe") or None
    ))
    db.commit()
    cours_id = cursor.lastrowid

    for classe_id in classes_selected:
        cursor.execute(
            "INSERT INTO cours_classe (cours_id, classe_id) VALUES (%s, %s)",
            (cours_id, classe_id)
        )
    db.commit()
    notifier_roles(db, ["admin", "enseignant", "etudiant"], "cours", f"Nouveau cours ajouté : {request.form['titre']}", url_for("etudiant.cours"))
    db.commit()
    cursor.close()
    flash("Cours ajouté.")
    return redirect(url_for("admin.cours"))


@admin.route("/cours/<int:cours_id>/modifier", methods=["POST"])
def modifier_cours(cours_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    classes_selected = request.form.getlist("classes")
    classe_principale = classes_selected[0] if classes_selected else None
    filiere_principale = None
    if classe_principale:
        cursor.execute("SELECT filiere_id FROM classes WHERE id=%s", (classe_principale,))
        row = cursor.fetchone()
        filiere_principale = row[0] if row else None

    cursor.execute("""
        UPDATE cours SET titre=%s, description=%s, matiere_id=%s, enseignant_id=%s,
                          filiere_id=%s, classe_id=%s, niveau=%s, lien_externe=%s
        WHERE id=%s
    """, (
        request.form["titre"], request.form.get("description"),
        request.form["matiere_id"], request.form["enseignant_id"],
        filiere_principale, classe_principale,
        request.form.get("niveau"), request.form.get("lien_externe") or None,
        cours_id
    ))

    cursor.execute("DELETE FROM cours_classe WHERE cours_id=%s", (cours_id,))
    for classe_id in classes_selected:
        cursor.execute(
            "INSERT INTO cours_classe (cours_id, classe_id) VALUES (%s, %s)",
            (cours_id, classe_id)
        )

    db.commit()
    cursor.close()
    flash("Cours modifié.")
    return redirect(url_for("admin.cours"))


@admin.route("/cours/<int:cours_id>/supprimer", methods=["POST"])
def supprimer_cours(cours_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM fichiers_cours WHERE cours_id=%s", (cours_id,))
    cursor.execute("DELETE FROM favoris WHERE cours_id=%s", (cours_id,))
    cursor.execute("DELETE FROM cours WHERE id=%s", (cours_id,))
    db.commit()
    cursor.close()
    flash("Cours supprimé.")
    return redirect(url_for("admin.cours"))


# ============================================================
# EMPLOIS DU TEMPS
# ============================================================

@admin.route("/edt")
def edt():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT ed.*, GROUP_CONCAT(DISTINCT cl2.nom ORDER BY cl2.nom SEPARATOR ', ') AS classes
        FROM emplois_du_temps ed
        LEFT JOIN edt_classe ec ON ec.edt_id = ed.id
        LEFT JOIN classes cl2 ON cl2.id = ec.classe_id
        GROUP BY ed.id
        ORDER BY ed.id DESC
    """)
    edt_liste = cursor.fetchall()

    cursor.execute("SELECT * FROM classes ORDER BY nom")
    classes = cursor.fetchall()

    # filieres removed for EDT management (use classes instead)
    filieres = []

    edit_edt = None
    edit_id = request.args.get("edit", type=int)
    edit_classes = []
    if edit_id:
        cursor.execute("SELECT * FROM emplois_du_temps WHERE id=%s", (edit_id,))
        edit_edt = cursor.fetchone()
        cursor.execute("SELECT classe_id FROM edt_classe WHERE edt_id=%s", (edit_id,))
        edit_classes = [r["classe_id"] for r in cursor.fetchall()]

    cursor.close()

    return render_template(
        "admin/edt.html",
        edt=edt_liste,
        classes=classes,
        filieres=filieres,
        edit_edt=edit_edt,
        edit_classes=edit_classes,
    )


@admin.route("/edt/ajouter", methods=["POST"])
def ajouter_edt():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()

    chemin_pdf, chemin_image = None, None
    dossier = os.path.join("static", "uploads", "edt")
    os.makedirs(dossier, exist_ok=True)

    fichier_pdf = request.files.get("fichier_pdf")
    if fichier_pdf and fichier_pdf.filename:
        nom = secure_filename(fichier_pdf.filename)
        fichier_pdf.save(os.path.join(dossier, nom))
        chemin_pdf = f"uploads/edt/{nom}"

    fichier_image = request.files.get("fichier_image")
    if fichier_image and fichier_image.filename:
        nom = secure_filename(fichier_image.filename)
        fichier_image.save(os.path.join(dossier, nom))
        chemin_image = f"uploads/edt/{nom}"

    # Use the first selected class as primary (jobs may concern multiple classes via edt_classe)
    classes_selected = request.form.getlist("classes")
    primary_classe = classes_selected[0] if classes_selected else None

    cursor.execute("""
        INSERT INTO emplois_du_temps (classe_id, titre, fichier_pdf, fichier_image, date_publication, actif)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        primary_classe, request.form.get("titre"), chemin_pdf, chemin_image,
        request.form.get("date_publication") or None,
        bool(request.form.get("actif"))
    ))
    db.commit()
    edt_id = cursor.lastrowid
    # associate selected classes to the edt
    for classe_id in classes_selected:
        cursor.execute(
            "INSERT INTO edt_classe (edt_id, classe_id) VALUES (%s, %s)",
            (edt_id, classe_id)
        )
    db.commit()
    notifier_roles(db, ["admin", "enseignant", "etudiant"], "emploi_du_temps", f"Nouvel emploi du temps : {request.form.get('titre') or 'Nouveau planning'}", url_for("etudiant.edt"))
    db.commit()
    cursor.close()
    flash("Emploi du temps ajouté.")
    return redirect(url_for("admin.edt"))


@admin.route("/edt/<int:edt_id>/modifier", methods=["POST"])
def modifier_edt(edt_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM emplois_du_temps WHERE id=%s", (edt_id,))
    actuel = cursor.fetchone()

    chemin_pdf = actuel["fichier_pdf"]
    chemin_image = actuel["fichier_image"]
    dossier = os.path.join("static", "uploads", "edt")
    os.makedirs(dossier, exist_ok=True)

    fichier_pdf = request.files.get("fichier_pdf")
    if fichier_pdf and fichier_pdf.filename:
        nom = secure_filename(fichier_pdf.filename)
        fichier_pdf.save(os.path.join(dossier, nom))
        chemin_pdf = f"uploads/edt/{nom}"

    fichier_image = request.files.get("fichier_image")
    if fichier_image and fichier_image.filename:
        nom = secure_filename(fichier_image.filename)
        fichier_image.save(os.path.join(dossier, nom))
        chemin_image = f"uploads/edt/{nom}"

    classes_selected = request.form.getlist("classes")
    primary_classe = classes_selected[0] if classes_selected else None

    cursor.execute("""
        UPDATE emplois_du_temps
        SET classe_id=%s, titre=%s, fichier_pdf=%s, fichier_image=%s, date_publication=%s, actif=%s
        WHERE id=%s
    """, (
        primary_classe, request.form.get("titre"), chemin_pdf, chemin_image,
        request.form.get("date_publication") or None,
        bool(request.form.get("actif")), edt_id
    ))

    # replace class associations
    cursor.execute("DELETE FROM edt_classe WHERE edt_id=%s", (edt_id,))
    for classe_id in classes_selected:
        cursor.execute(
            "INSERT INTO edt_classe (edt_id, classe_id) VALUES (%s, %s)",
            (edt_id, classe_id)
        )

    db.commit()
    cursor.close()
    flash("Emploi du temps modifié.")
    return redirect(url_for("admin.edt"))


@admin.route("/edt/<int:edt_id>/supprimer", methods=["POST"])
def supprimer_edt(edt_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM edt_classe WHERE edt_id=%s", (edt_id,))
    cursor.execute("DELETE FROM emplois_du_temps WHERE id=%s", (edt_id,))
    db.commit()
    cursor.close()
    flash("Emploi du temps supprimé.")
    return redirect(url_for("admin.edt"))


# ============================================================
# COMMUNIQUÉS
# ============================================================

@admin.route("/communiques")
def communiques():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM communiques ORDER BY id DESC")
    communiques_liste = cursor.fetchall()

    edit_communique = None
    edit_id = request.args.get("edit", type=int)
    if edit_id:
        cursor.execute("SELECT * FROM communiques WHERE id=%s", (edit_id,))
        edit_communique = cursor.fetchone()

    cursor.close()

    return render_template("admin/communiques.html", communiques=communiques_liste, edit_communique=edit_communique)


@admin.route("/communiques/ajouter", methods=["POST"])
def ajouter_communique():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()

    dossier = os.path.join("static", "uploads", "communiques")
    os.makedirs(dossier, exist_ok=True)

    chemin_image, chemin_pdf = None, None

    image = request.files.get("image")
    if image and image.filename:
        nom = secure_filename(image.filename)
        image.save(os.path.join(dossier, nom))
        chemin_image = f"uploads/communiques/{nom}"

    fichier_pdf = request.files.get("fichier_pdf")
    if fichier_pdf and fichier_pdf.filename:
        nom = secure_filename(fichier_pdf.filename)
        fichier_pdf.save(os.path.join(dossier, nom))
        chemin_pdf = f"uploads/communiques/{nom}"

    cursor.execute("""
        INSERT INTO communiques (titre, contenu, image, fichier_pdf, auteur_id, mis_en_avant, archive, date_publication)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        request.form["titre"], request.form["contenu"], chemin_image, chemin_pdf,
        session["user_id"], bool(request.form.get("mis_en_avant")),
        bool(request.form.get("archive")), request.form.get("date_publication") or None
    ))
    db.commit()
    notifier_roles(db, ["admin", "enseignant", "etudiant"], "communique", f"Nouveau communiqué : {request.form['titre']}", url_for("etudiant.communiques"))
    db.commit()
    cursor.close()
    flash("Communiqué publié.")
    return redirect(url_for("admin.communiques"))


@admin.route("/communiques/<int:communique_id>/modifier", methods=["POST"])
def modifier_communique(communique_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM communiques WHERE id=%s", (communique_id,))
    actuel = cursor.fetchone()

    dossier = os.path.join("static", "uploads", "communiques")
    os.makedirs(dossier, exist_ok=True)

    chemin_image = actuel["image"]
    chemin_pdf = actuel["fichier_pdf"]

    image = request.files.get("image")
    if image and image.filename:
        nom = secure_filename(image.filename)
        image.save(os.path.join(dossier, nom))
        chemin_image = f"uploads/communiques/{nom}"

    fichier_pdf = request.files.get("fichier_pdf")
    if fichier_pdf and fichier_pdf.filename:
        nom = secure_filename(fichier_pdf.filename)
        fichier_pdf.save(os.path.join(dossier, nom))
        chemin_pdf = f"uploads/communiques/{nom}"

    cursor.execute("""
        UPDATE communiques
        SET titre=%s, contenu=%s, image=%s, fichier_pdf=%s, mis_en_avant=%s, archive=%s, date_publication=%s
        WHERE id=%s
    """, (
        request.form["titre"], request.form["contenu"], chemin_image, chemin_pdf,
        bool(request.form.get("mis_en_avant")), bool(request.form.get("archive")),
        request.form.get("date_publication") or None, communique_id
    ))
    db.commit()
    cursor.close()
    flash("Communiqué modifié.")
    return redirect(url_for("admin.communiques"))


@admin.route("/communiques/<int:communique_id>/supprimer", methods=["POST"])
def supprimer_communique(communique_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM communiques WHERE id=%s", (communique_id,))
    db.commit()
    cursor.close()
    flash("Communiqué supprimé.")
    return redirect(url_for("admin.communiques"))


# ============================================================
# MESSAGES
# ============================================================

@admin.route("/messages")
def messages():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM messages_contact ORDER BY id DESC")
    messages_liste = cursor.fetchall()
    cursor.close()

    return render_template("admin/messages.html", messages=messages_liste)


@admin.route("/messages/<int:message_id>/repondre", methods=["POST"])
def repondre_message(message_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE messages_contact SET reponse=%s, lu=TRUE WHERE id=%s
    """, (request.form["reponse"], message_id))
    db.commit()
    cursor.close()
    flash("Réponse envoyée.")
    return redirect(url_for("admin.messages"))


@admin.route("/messages/<int:message_id>/supprimer", methods=["POST"])
def supprimer_message(message_id):
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM messages_contact WHERE id=%s", (message_id,))
    db.commit()
    cursor.close()
    flash("Message supprimé.")
    return redirect(url_for("admin.messages"))


# ============================================================
# PROFIL ADMIN
# ============================================================

@admin.route("/profil")
def profil():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id=%s", (session["user_id"],))
    user = cursor.fetchone()
    cursor.close()

    edit_mode = request.args.get("edit") == "1"

    return render_template("admin/profil.html", user=user, edit_mode=edit_mode)


@admin.route("/profil/modifier", methods=["POST"])
def modifier_profil():
    garde = _admin_required()
    if garde:
        return garde

    db = get_db()
    cursor = db.cursor()

    chemin_photo = None
    photo = request.files.get("photo")
    if photo and photo.filename:
        dossier = os.path.join("static", "uploads", "profils")
        os.makedirs(dossier, exist_ok=True)
        nom = secure_filename(photo.filename)
        photo.save(os.path.join(dossier, nom))
        chemin_photo = f"uploads/profils/{nom}"

    if request.form.get("password"):
        hash_mdp = generate_password_hash(request.form["password"])
        if chemin_photo:
            cursor.execute("""
                UPDATE users SET nom=%s, prenom=%s, telephone=%s, password_hash=%s, photo=%s
                WHERE id=%s
            """, (request.form["nom"], request.form["prenom"],
                  request.form.get("telephone"), hash_mdp, chemin_photo, session["user_id"]))
        else:
            cursor.execute("""
                UPDATE users SET nom=%s, prenom=%s, telephone=%s, password_hash=%s
                WHERE id=%s
            """, (request.form["nom"], request.form["prenom"],
                  request.form.get("telephone"), hash_mdp, session["user_id"]))
    else:
        if chemin_photo:
            cursor.execute("""
                UPDATE users SET nom=%s, prenom=%s, telephone=%s, photo=%s
                WHERE id=%s
            """, (request.form["nom"], request.form["prenom"],
                  request.form.get("telephone"), chemin_photo, session["user_id"]))
        else:
            cursor.execute("""
                UPDATE users SET nom=%s, prenom=%s, telephone=%s
                WHERE id=%s
            """, (request.form["nom"], request.form["prenom"],
                  request.form.get("telephone"), session["user_id"]))

    db.commit()
    cursor.close()

    session["nom"] = request.form["nom"]
    session["prenom"] = request.form["prenom"]
    if chemin_photo:
        session["photo"] = chemin_photo

    flash("Profil mis à jour.")
    return redirect(url_for("admin.profil"))