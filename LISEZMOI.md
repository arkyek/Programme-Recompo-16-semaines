# Recompo 16 : installation sur iPhone

Une web app installable (PWA). Elle s'installe depuis Safari, fonctionne **hors ligne** et garde **toutes les données sur le téléphone**. Pas d'App Store, pas d'abonnement, pas de base de données.

Toutes les fonctionnalités, avec des exemples : voir [README.md](README.md).

## 1. Mettre l'app en ligne une fois (gratuit, 5 min, depuis un PC)

L'iPhone doit télécharger l'app une première fois depuis une adresse web. Avec **GitHub Pages** :

1. Crée un compte gratuit sur github.com.
2. Clique sur **New repository**. Nom : `recompo`, visibilité **Public** (obligatoire pour Pages gratuit ; le dépôt ne contient que le code, aucune donnée personnelle). Clique sur **Create repository**.
3. Clique sur **uploading an existing file**, glisse **tout le contenu** de ce dossier (fichiers et sous-dossiers `src`, `styles`, `assets`, mais pas le dossier lui-même), puis **Commit changes**.
4. Va dans **Settings → Pages**. Dans « Source », choisis **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
5. Après 1 à 2 minutes, l'app est en ligne à l'adresse `https://TON-PSEUDO.github.io/recompo/`.

Autre option : glisser le dossier sur app.netlify.com/drop (compte gratuit nécessaire pour que le site reste en ligne).

## 2. Installer sur l'iPhone

1. Ouvre l'adresse dans **Safari** (pas Chrome).
2. Touche **Partager** (carré avec une flèche), puis **Sur l'écran d'accueil**, puis **Ajouter**.
3. Ouvre l'app **depuis l'icône**, une fois avec du réseau. Ensuite elle marche partout, même en mode avion.

Important : utilise toujours l'icône. Les données de l'app installée et celles de Safari sont séparées.

## 3. Premier réglage

Onglet **Réglages** : choisis le lundi de la semaine 1 et l'horaire des séances (soir ou midi).

## 4. Sauvegarde

Les données restent sur le téléphone. Une app installée sur l'écran d'accueil n'est pas vidée automatiquement par iOS. Elles disparaissent seulement si tu supprimes l'app ou effaces les données du site.

Une fois par semaine : **Réglages → Exporter la sauvegarde**, puis enregistre le fichier dans Fichiers ou iCloud Drive. **Importer** permet de tout restaurer, par exemple sur un nouveau téléphone.

## 5. Mettre à jour l'app plus tard

Remplace les fichiers modifiés dans le dépôt GitHub. Dans `sw.js`, change aussi `VERSION` (par exemple `recompo-v3`), et mets à jour la liste des fichiers si tu en as ajouté ou supprimé (`npm run check` le vérifie). À la prochaine ouverture avec du réseau, l'iPhone télécharge la nouvelle version. Les données sont conservées.

## Développer sur l'ordinateur

L'app utilise des modules JavaScript natifs (`import` / `export`), sans étape de compilation. Ils ne fonctionnent pas en ouvrant `index.html` directement (`file://`) : il faut un petit serveur local.

```bash
npm start
```

Puis ouvrir http://localhost:8000. En local, le service worker est désactivé pour que chaque rechargement prenne les fichiers modifiés (ajouter `?sw` à l'adresse pour tester le mode hors ligne).

Avant chaque mise en ligne :

```bash
npm run check
```

Ce script vérifie la syntaxe des modules, les imports et la liste de cache de `sw.js`.

## Organisation du code

```
index.html              coquille de l'app (en-tête, zone de vue, barre d'onglets)
sw.js                   service worker (cache hors ligne)
manifest.webmanifest    installation PWA
assets/icons/           icônes
styles/                 CSS découpé : base/, layout/, components/, views/
src/
  main.js               point d'entrée : branche les vues et démarre l'app
  core/                 utilitaires purs (DOM, dates, formats, icônes)
  config/               paramètres du programme (séances, cibles, conseils)
  data/                 catalogue des exercices
  content/              texte du guide
  state/                données utilisateur (localStorage, sauvegarde)
  domain/               règles métier : planning, prescription, progression, statistiques
  services/             API du navigateur : audio, écran allumé, fichiers, PWA
  ui/                   routeur, en-tête/feuilles/notifications, minuteur, composants
  views/                un dossier ou fichier par onglet
```

Les dépendances vont dans un seul sens : `views → ui / domain → state / config / data → core`. Le domaine ne produit jamais de HTML, et le routeur ne connaît pas les vues (elles sont enregistrées dans `main.js`).

## Pourquoi ce choix plutôt qu'Expo Go ou Xcode

- **Expo Go** : l'app dépend d'un ordinateur qui la sert ou d'un service de publication. Ce n'est pas adapté à un usage autonome hors ligne.
- **Xcode** (compte Apple gratuit) : il faut un Mac, et l'app installée expire au bout de 7 jours. Le compte développeur coûte 99 $/an.
- **Supabase** : utile seulement pour synchroniser plusieurs appareils. Le stockage local avec export suffit pour un seul iPhone.
