def notifier_utilisateurs(db, user_ids, type_notif, contenu, lien=None):
    """Crée une notification pour chaque utilisateur donné."""
    if not user_ids:
        return

    unique_ids = list(dict.fromkeys(user_ids))
    cursor = db.cursor(dictionary=True)
    values_sql = ", ".join(["(%s, %s, %s, %s)"] * len(unique_ids))
    params = [
        item
        for user_id in unique_ids
        for item in (user_id, type_notif, contenu, lien)
    ]
    cursor.execute(
        f"INSERT INTO notifications (user_id, type, contenu, lien) VALUES {values_sql}",
        params,
    )


def notifier_roles(db, roles, type_notif, contenu, lien=None):
    """Crée une notification pour tous les utilisateurs d'un ou plusieurs rôles."""
    if not roles:
        return

    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT u.id AS user_id
        FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE r.nom IN ({placeholders})
        """.format(placeholders=",".join(["%s"] * len(roles))),
        tuple(roles),
    )
    user_ids = [row["user_id"] for row in cursor.fetchall()]
    notifier_utilisateurs(db, user_ids, type_notif, contenu, lien)
