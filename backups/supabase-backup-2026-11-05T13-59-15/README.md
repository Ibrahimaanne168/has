# Guide de Sauvegarde et Restauration Supabase — HAS

**Date de la sauvegarde** : 05/11/2026 13:59:15
**Source** : https://dcjfjhwdfnyiwfagfcwx.supabase.co

## 📊 Résumé des éléments sauvegardés
* **Comptes utilisateurs (Auth)** : 201
* **Fichiers Storage** : 23
* **Tables exportées** :
  - **etudiants** : 0 ligne(s)
  - **matieres** : 20 ligne(s)
  - **cours** : 4 ligne(s)
  - **chat_messages** : 8 ligne(s)
  - **classes** : 6 ligne(s)
  - **edt_filiere** : 0 ligne(s)
  - **cours_classe** : 0 ligne(s)
  - **favoris** : 0 ligne(s)
  - **enseignants** : 8 ligne(s)
  - **enseignant_matiere** : 25 ligne(s)
  - **verification_codes** : 424 ligne(s)
  - **fichiers_cours** : 3 ligne(s)
  - **emplois_du_temps** : 1 ligne(s)
  - **messages_contact** : 0 ligne(s)
  - **logs** : 75 ligne(s)
  - **communiques** : 2 ligne(s)
  - **matiere_classe** : 44 ligne(s)
  - **enseignant_filiere** : 19 ligne(s)
  - **users** : 12 ligne(s)
  - **edt_classe** : 0 ligne(s)
  - **roles** : 3 ligne(s)
  - **notifications** : 0 ligne(s)
  - **filieres** : 3 ligne(s)

## 📁 Structure des fichiers de la sauvegarde
* `auth/users.json` : Export complet de tous les comptes utilisateurs Supabase Auth (identifiants, métadonnées, rôles).
* `tables-json/` : Chaque table au format JSON standard.
* `tables-sql/` : Chaque table convertie en requêtes SQL `INSERT INTO ...` prête à exécuter dans votre nouveau projet Supabase !
* `storage/` : Tous les fichiers téléversés dans vos buckets Supabase.

## 🔄 Comment basculer vers votre NOUVEAU projet Supabase :
1. Créez votre nouveau projet sur [supabase.com](https://supabase.com).
2. Dans le SQL Editor du nouveau projet, exécutez vos schémas dans `database/profiles.sql`, `database/verification_codes.sql`, etc.
3. Exécutez ensuite les fichiers SQL générés dans `tables-sql/` pour réinjecter immédiatement toutes vos données.
4. Mettez à jour vos 3 variables dans le fichier `.env.local` avec les nouvelles clés de votre nouveau projet :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<votre-nouveau-projet>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
5. Redémarrez votre application : tout est réinitialisé et opérationnel sans aucune perte !
