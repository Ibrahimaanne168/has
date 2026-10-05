## Agents

Tu es désormais un agent IA multi-rôle qui comprend les rôles suivants :

  * `etudiant` : peut accéder à ses cours, infos personnelles, salons privés
  * `enseignant` : peut gérer ses matières, cours, classes, et évaluer les étudiants
  * `admin` : accès complet, gestion des utilisateurs, création de filières / classes
  * `visiteur` : accès limité à la page publique

Comprends que :

  * Les cours sont liés aux `matières` qui sont elles-mêmes liées aux `filières`
  * Les `classes` sont définies par `filiere_id + niveau + specialite` (ex: "MPI-L1-SML")
  * Les `matieres` définissent les classes qu'elles concernent

Tu dois toujours vérifier les droits de l'utilisateur connecté et ajuster les actions possibles.


## Méthodologie

Pour toute nouvelle fonctionnalité ou modification :

1. Vérifie les types Supabase correspondants
2. Vérifie si la logique existe déjà dans le code
3. Si nécessaire, propose les modifications de types et code dans un seul bloc
4. Explique clairement ton raisonnement et comment connecter les éléments ensemble
5. Sois prêt à itérer et affiner après retours


## Supabase

**Tables existantes** :

  * `utilisateurs` (`id`, `email`, `nom`, `prenom`, `telephone`, `date_naissance`, `role`, `matricule`, `filiere_id`, `classe_id`, `photo`, `specialite`, `bio`)
  * `filiere` (`id`, `nom`, `niveau`, `specialite`, `description`)
  * `salles` (`id`, `nom`, `type`, `filiere_id`)
  * `cours` (`id`, `matiere_id`, `salle_id`, `heure_debut`, `heure_fin`, `jour`)
  * `matieres` (`id`, `nom`, `abreviation`, `nbre_heures`, `description`, `enseignant_id`, `filiere_id`, `type`, `code`, `niveau`)
  * `notes` (`id`, `etudiant_id`, `matiere_id`, `note`, `type`, `date`, `professeur_id`, `module_id`)
  * `messages` (`id`, `utilisateur_id`, `message`, `timestamp`, `salon_id`)

**Relations importantes** :

  * `utilisateurs` → `role` -> `administrateurs`, `enseignants`, `etudiants` (une seule table)
  * `matieres` → `filiere_id` → `filiere`
  * `matieres` → `enseignant_id` → `utilisateurs` (enseignant)
  * `matieres` → `niveau`, `specialite` (filtrage par classe)
  * `cours` → `salle_id` → `salles`
  * `cours` → `matiere_id` → `matieres`
  * `notes` → `etudiant_id` → `utilisateurs` (étudiant)
  * `notes` → `matiere_id` → `matieres`

**Règles spéciales** :

  * Une `matiere` peut être associée à plusieurs `niveaux` + `specialite`
  * Une `matiere` a un `code` (ex: MAT001)
  * Les `cours` sont définis par `jour + heure_debut + heure_fin + matiere_id`
  * Les `messages` ont `salon_id` (ex: "general", "salle-a1", "m-l1-mpi-sml")


## Flux typiques

**1. Enseignant crée une matière**

  * Demande `nom`, `abreviation`, `nbre_heures`, `type`
  * Propose un `code` (ex: MAT001, MAT002...)
  * Propose `filiere_id`
  * Propose `niveau`, `specialite` (peut être null pour matières générales)
  * Enregistre dans `matieres`

**2. Étudiant voit ses matières**

  * Utilise `filiere_id`, `classe_id` (niveau + spécialité) et `niveau` de l'utilisateur
  * Filtre `matieres` par ces critères
  * Affiche les matières avec leurs cours

**3. Enseignant crée un cours**

  * Demande `jour`, `heure_debut`, `heure_fin`, `salle_id`, `matiere_id`
  * Vérifie conflit avec autres cours de même matière
  * Enregistre dans `cours`

**4. Étudiant voit son emploi du temps**

  * Combine `cours` + `salles` + `matieres`
  * Regroupe par jour
  * Indique `salle`, `matiere`, `heure`

**5. Enseignant note un étudiant**

  * Demande `etudiant_id`, `matiere_id`, `note`, `type`
  * Calcule `moyenne` si besoin
  * Enregistre dans `notes`


## Points de vigilance

  * Ne mélange jamais `matiere_id` et `module_id`
  * `filiere_id` est toujours requis pour les matières
  * `niveau` + `specialite` peuvent être `null` pour matières transversales
  * Vérifie les rôles avant d'accorder des accès
  * Les cours sont définis par `jour + heure + matiere_id + salle_id`
  * Les messages utilisent des `salon_id` structurés pour chaques contextes
  * Tu peux et dois créer de nouvelles tables si nécessaire, mais explique clairement et connecte-les logiquement aux tables existantes.
  * Toutes les matières d'une filière doivent avoir `filiere_id` pointant vers la filière.
  * Les matières peuvent être partagées entre filières en cochant `type = 'partagee'`. Dans ce cas `filiere_id` peut être null.
  * Un cours peut être assigné à une matière partagée, il suffit de mettre la matière concernée dans `matiere_id`.

@GEMINI.md
