
# 👨‍💻 Projet Supabase : Système d'authentification et de gestion de profil utilisateur

Ce projet est un système complet de gestion d'utilisateurs, intégrant un flux d'authentification et un profil utilisateur, construit avec HTML, CSS et JavaScript, et en utilisant la base de données Backend-as-a-Service (BaaS) **Supabase**.

Le but principal de ce projet est de démontrer la mise en œuvre des fonctionnalités suivantes de Supabase :

- **Authentification par email et mot de passe** : Permet aux utilisateurs de s'inscrire et de se connecter de manière sécurisée.
- **Gestion des sessions utilisateur** : Protège les pages nécessitant une authentification et assure une expérience utilisateur fluide.
- **Opérations CRUD (Create, Read, Update, Delete)** sur la base de données : Permet aux utilisateurs de créer, lire, modifier et supprimer leurs données de profil.

## 🚀 Fonctionnalités

- **Inscription** : Un formulaire simple pour créer un nouveau compte utilisateur.
- **Connexion** : Les utilisateurs peuvent se connecter avec leur email et leur mot de passe.
- **Création de profil** : Les nouveaux utilisateurs sont dirigés vers une page pour créer leur profil (nom d'utilisateur et bio).
- **Affichage de profil** : Une fois connectés, les utilisateurs voient leur profil personnalisé.
- **Modification de profil** : Les utilisateurs peuvent mettre à jour leur nom d'utilisateur et leur bio.
- **Suppression de profil** : Possibilité de supprimer définitivement le profil de la base de données.
- **Déconnexion** : Un bouton permet de se déconnecter et de revenir à la page de connexion.

## 🛠️ Technologies Utilisées

- **Frontend** :
  - **HTML5** : Structure des pages web.
  - **CSS3** : Mise en forme et style de l'interface utilisateur.
  - **JavaScript (ES6+)** : Logique de l'application et interactions avec le backend.
  - **Supabase** : Fournit les services de base de données, d'authentification et de stockage en temps réel.
    - **Supabase Auth** : Gère l'authentification des utilisateurs.
    - **Supabase Realtime Database** : Stocke et gère les données de profil.

- **Déploiement** :
  - **Vercel** : Plateforme de déploiement continue pour l'application frontend.

## 📁 Structure du Projet

.
├── css/                  \# Fichiers de style (CSS)
│   ├── style.css
│   └── profile.css
├── index.html            \# Page de connexion
├── signup.html           \# Page d'inscription
├── profile.html          \# Page de création de profil
├── accueil.html          \# Page du profil utilisateur (protégée)
└── script.js             \# Fichier de script principal


## 🌐 Liens Utiles

- **Dépôt GitHub** : [https://github.com/ferd203/projet-supbase.git](https://github.com/ferd203/projet-supbase.git)
- **Lien de Déploiement** : https://projet-supbase-tb2y.vercel.app/index.html

## 🚀 Comment Démarrer le Projet

1.  **Cloner le dépôt :**
    ```sh
    git clone [https://github.com/ferd203/projet-supbase.git](https://github.com/ferd203/projet-supbase.git)
    cd projet-supbase
    ```

2.  **Configuration Supabase :**
    - Créez un projet Supabase.
    - Récupérez la clé `anon` et l'URL du projet depuis les "Project Settings".
    - Créez une table `profiles` avec les colonnes `id` (UUID), `username` (Text), et `bio` (Text).
    - Assurez-vous que les règles de politique (Row-Level Security) sont configurées pour permettre l'accès.

3.  **Mise à jour des API Keys :**
    - Remplacez `apikey` et `apikey_url` dans le fichier `script.js` par vos propres clés.

4.  **Lancer l'application :**
    - Ouvrez `index.html` dans votre navigateur ou déployez le projet sur une plateforme comme Vercel pour le tester.
````