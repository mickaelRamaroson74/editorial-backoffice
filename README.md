# Plateforme Éditoriale

## Description

Une application moderne de gestion d'articles et de dashboard analytique. Elle permet de gérer un flux éditorial, d'organiser les contenus par catégories et réseaux, et d'envoyer des notifications par email.

## Prérequis

- Node.js version 18+
- npm (embarqué avec Node.js)
- SQLite (géré via Prisma, aucune installation requise)

## Installation

```bash
# À la racine du projet, installer toutes les dépendances
npm run install:all
```

## Configuration (Environnement)

Le projet utilise des variables d'environnement pour configurer les URL et les ports.

### Backend (`backend-node/`)

1. Copiez le fichier d'exemple : `cp .env.example .env`
2. Variables disponibles :
   - `PORT` : Port du serveur (défaut: 3000)
   - `DATABASE_URL` : URL de la base SQLite
   - `NODE_ENV` : Mode d'exécution (development/production)

### Frontend (`frontend-react/`)

1. Copiez le fichier d'exemple : `cp .env.example .env`
2. Variables disponibles :
   - `VITE_API_URL` : URL complète de l'API backend (ex: `http://localhost:3000/api`)

## Lancement

```bash
# Pour lancer simultanément le backend et le frontend depuis la racine
npm run dev

# Backend : http://localhost:3000
# Frontend : http://localhost:8081
```

## Choix techniques

- **Frontend (React + Vite)** : Choisi pour sa rapidité de développement et ses performances.
- **State Management (Zustand + TanStack Query)** :
  - Zustand gère l'état global léger (filtres, UI).
  - TanStack Query gère la mise en cache serveur et la synchronisation des données API.
- **Backend (Node.js + Express + Prisma)** :
  - Prisma permet une interaction type-safe avec la base de données SQLite.
  - Architecture par contrôleurs pour une séparation claire des responsabilités.
- **Optimisation Dashboard** : Implémentation d'un endpoint consolidé `/api/dashboard/stats` pour réduire les appels réseau (un seul fetch au lieu de quatre).

## Fonctionnalités implémentées

- Gestion CRUD des articles (complet)
- Filtrage avancé (recherche, statut, catégories, réseaux) (complet)
- Dashboard avec graphiques Recharts (complet)
- Hub de notifications par email (complet)
- Import de données JSON (complet)
- Endpoint consolidé pour le Dashboard (complet)

## Ce qui aurait été fait avec plus de temps

1. **Authentification** : Ajout d'un système de login (JWT) pour sécuriser l'accès.
2. **Dashboard dynamique** : Filtres de dates pour les statistiques.
3. **Upload d'images** : Integration d'un service de stockage (S3 ou local) pour les articles.
4. **CI/CD** : Pipeline automatisé pour les tests et le déploiement.

## Tests

Les tests unitaires sont disponibles pour le backend :

```bash
# Lancer les tests depuis la racine
npm run test:backend
```

## Difficultés rencontrées

- **Incompatibilité SQLite/Prisma** : L'option `mode: 'insensitive'` n'est pas supportée par SQLite dans Prisma. Résolu en supprimant cette option (SQLite étant souvent insensible à la casse par défaut ou géré différemment).
- **Synchronisation Zustand/Query** : S'assurer que les données du Dashboard (consolidées) mettent bien à jour les autres slices du store pour la cohérence UI. Résolu via une action `setDashboardData` personnalisée.
