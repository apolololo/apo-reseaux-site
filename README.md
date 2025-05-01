# Portfolio WhiteNight

Ce projet est un portfolio personnel développé avec React, Express et TypeScript. Il est conçu pour fonctionner sur plusieurs plateformes, notamment Replit, lovable.dev et bolt.new.

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :

```bash
npm install
# ou
yarn
```

3. Copiez le fichier `.env.example` vers `.env` et ajustez les variables selon votre environnement.

## Développement

### Sur Replit

Le projet est configuré pour fonctionner directement sur Replit sans configuration supplémentaire.

```bash
npm run dev
```

### Sur lovable.dev

Pour développer sur lovable.dev, utilisez les commandes spécifiques :

```bash
npm run lovable:dev
```

### Sur bolt.new

Pour développer sur bolt.new, utilisez les commandes spécifiques :

```bash
npm run bolt:dev
```

## Construction et déploiement

### Construction standard

```bash
npm run build
npm run start
```

### Pour lovable.dev

```bash
npm run lovable:build
npm run lovable:start
```

### Pour bolt.new

```bash
npm run bolt:build
npm run bolt:start
```

## Structure du projet

- `client/` : Code source du frontend React
- `server/` : Code source du backend Express
- `shared/` : Code partagé entre le frontend et le backend
- `dist/` : Fichiers générés lors de la construction

## Fonctionnalités

- Interface utilisateur interactive avec animations
- Curseur personnalisé
- Grille sociale pour les liens vers les réseaux sociaux
- Mini-jeu Tic-Tac-Toe intégré

## Licence

MIT