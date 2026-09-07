# Guide Professionnel de Déploiement CI/CD via FTP : MAALAL CARS sur Hébergement Mutualisé

> **Cible** : cPanel / CloudLinux / LiteSpeed / Phusion Passenger (ex: Hostinger, o2switch, PlanetHoster, OVHcloud, Namecheap, Infomaniak).  
> **Pipeline Automatisé** : GitHub Actions via FTP / FTPS (`.github/workflows/deploy.yml`)  
> **Stack** : Next.js 16 (App Router) + TypeScript + Prisma ORM + SQLite / MySQL / PostgreSQL.

---

## Sommaire

1. [Architecture CI/CD GitHub Actions via FTP](#1-architecture-cicd-github-actions-via-ftp)
2. [Secrets GitHub à Configurer (Paramètres FTP)](#2-secrets-github-à-configurer-paramètres-ftp)
3. [Configuration Initiale sur cPanel (*Setup Node.js App*)](#3-configuration-initiale-sur-cpanel-setup-nodejs-app)
4. [Garantir l'Intégrité de la Base de Données & Zéro Perte](#4-garantir-lintégrité-de-la-base-de-données--zéro-perte)
   - [Option A : SQLite Durci (Hors Arborescence FTP + Mode WAL)](#option-a--sqlite-durci-hors-arborescence-ftp--mode-wal)
   - [Option B : MySQL / MariaDB Natif cPanel](#option-b--mysql--mariadb-natif-cpanel)
   - [Option C : PostgreSQL Managé Distant (Neon / Supabase)](#option-c--postgresql-managé-distant-neon--supabase)
5. [Comment Fonctionne le Redémarrage Zéro-Coupure via FTP (Phusion Passenger)](#5-comment-fonctionne-le-redémarrage-zéro-coupure-via-ftp-phusion-passenger)
6. [Gestion des Migrations de Base de Données sans SSH](#6-gestion-des-migrations-de-base-de-données-sans-ssh)
7. [Stockage Persistant des Uploads (Photos & Cartes Grises)](#7-stockage-persistant-des-uploads-photos--cartes-grises)
8. [Prévention des Pannes & Optimisation Mémoire (Zéro Crash)](#8-prévention-des-pannes--optimisation-mémoire-zéro-crash)

---

## 1. Architecture CI/CD GitHub Actions via FTP

Le déploiement par FTP via GitHub Actions permet de contourner les deux contraintes majeures des hébergements mutualisés :
1. **L'absence d'accès SSH** sur certaines formules mutualisées économiques.
2. **Le plafond strict de mémoire vive (LVE CloudLinux)** qui fait crasher la compilation `npm run build` si elle est tentée sur le serveur.

### Schéma du Flux Automatisé :
```mermaid
flowchart TD
    A[Développeur: git push origin main] --> B[GitHub Actions Runner (Ubuntu 7 Go RAM)]
    B --> C[Job 1: Quality Gates (TypeCheck + Lint + Vitest 80 Tests)]
    C --> D[Job 2: Compilation Standalone Next.js 16]
    D --> E[Assemblage Bundle (.next/standalone + static + public + prisma + app.js + tmp/restart.txt)]
    E --> F[Déploiement Incrémental par FTP / FTPS vers cPanel]
    F --> G[Phusion Passenger détecte tmp/restart.txt -> Rechargement Automatique]
    G --> H[Application en Ligne à Jour sans Interruption]
```

---

## 2. Secrets GitHub à Configurer (Paramètres FTP)

Sur votre compte GitHub, ouvrez votre dépôt et allez dans :  
👉 **Settings > Secrets and variables > Actions > New repository secret**

Ajoutez les 4 secrets FTP suivants :

| Nom du Secret | Description | Exemple |
| :--- | :--- | :--- |
| `FTP_SERVER` | Hôte FTP ou IP fourni par votre hébergeur | `ftp.votredomaine.com` ou `185.123.45.67` |
| `FTP_USERNAME` | Nom d'utilisateur FTP du compte cPanel | `cpaneluser` ou `cpaneluser@votredomaine.com` |
| `FTP_PASSWORD` | Mot de passe du compte FTP | `VotreMotDePasseFort123!` |
| `FTP_SERVER_DIR` | Répertoire cible de l'application sur le serveur | `/maalalcars_app/` (ou `/public_html/` selon configuration) |

*(Optionnels) :*
- `FTP_PORT` : `21` (par défaut).
- `FTP_PROTOCOL` : `ftp` ou `ftps` (si votre hébergeur supporte le FTP sécurisé TLS).
- `PROD_DATABASE_URL` : Si vous utilisez MySQL ou PostgreSQL distant, vous pouvez renseigner la chaîne pour que GitHub Actions applique automatiquement le schéma Prisma avant l'envoi FTP !

---

## 3. Configuration Initiale sur cPanel (*Setup Node.js App*)

Cette étape est à réaliser **une seule fois** :

1. Connectez-vous à votre cPanel.
2. Allez dans **Logiciels (Software)** > **Setup Node.js App** (ou *Gestionnaire Node.js*).
3. Cliquez sur **Create Application** :
   - **Node.js version** : Sélectionnez **20.x** (LTS).
   - **Application mode** : `Production`.
   - **Application root** : `maalalcars_app`
   - **Application URL** : `votredomaine.com` (ou `app.votredomaine.com`).
   - **Application startup file** : `server.js` (ou `app.js`).
4. Cliquez sur **Create**.
5. Dans le répertoire `/home/username/maalalcars_app/`, créez le fichier secret `.env.production` (via le Gestionnaire de Fichiers cPanel) :
   ```env
   NODE_ENV=production
   PORT=3000

   # Base de données SQLite persistante (en dehors du dossier FTP !)
   DATABASE_URL="file:/home/username/maalalcars_data/production.db"

   # Sécurité (chaînes aléatoires fortes de 64 caractères)
   JWT_SECRET="CLE_SECRETE_TRES_LONGUE_ET_SECURISEE_MINIMUM_64_CARACTERES"
   SESSION_SECRET="CLE_DE_SESSION_TRES_LONGUE_ET_SECURISEE"

   # Paramètres Métier
   NEXT_PUBLIC_APP_URL="https://votredomaine.com"
   NEXT_PUBLIC_CURRENCY="DH"
   TZ="Africa/Casablanca"

   # Garde-fou mémoire anti-crash CloudLinux LVE
   NODE_OPTIONS="--max-old-space-size=512"
   ```

---

## 4. Garantir l'Intégrité de la Base de Données & Zéro Perte

Le risque numéro 1 lors d'un transfert FTP est d'écraser la base de données de production avec celle du développeur.  
Pour éliminer ce risque à 100% :

### 1. La règle d'exclusion stricte dans GitHub Actions
Dans `.github/workflows/deploy.yml`, l'action FTP intègre une clause d'exclusion absolue :
```yaml
exclude: |
  **/.env*
  **/data/**
  **/storage/**
  **/*.db*
  **/*.db-journal*
```
Aucun fichier de base de données ni fichier d'environnement ne sera jamais écrasé ou supprimé par le transfert FTP.

### 2. Emplacement Physique de SQLite (Option A)
Ne placez **JAMAIS** votre fichier SQLite dans le dossier synchronisé par FTP.  
- ❌ `/home/username/maalalcars_app/prisma/dev.db`
- ✅ `/home/username/maalalcars_data/production.db` (Dans un dossier父 parent `maalalcars_data` inaccessible depuis le FTP de l'application).

### 3. Concurrence Maximale avec le Mode WAL (Write-Ahead Logging)
Pour que plusieurs utilisateurs puissent créer des réservations, imprimer des factures et saisir des véhicules simultanément sans blocage :
Exécutez cette commande une seule fois dans la console cPanel (ou via phpLiteAdmin) :
```sql
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA busy_timeout=5000;
```

---

## 5. Comment Fonctionne le Redémarrage Zéro-Coupure via FTP (Phusion Passenger)

Sur un serveur traditionnel, il faut faire `pm2 restart` ou `systemctl restart`.  
Sur un hébergement mutualisé géré par **Phusion Passenger**, comment forcer le redémarrage **uniquement via FTP** ?

1. Dans l'étape d'assemblage, GitHub Actions génère un fichier d'horodatage :
   ```bash
   date +%s > .next/standalone/tmp/restart.txt
   ```
2. Lorsque le client FTP envoie ce fichier `tmp/restart.txt` sur le serveur :
   - Phusion Passenger surveille en permanence la date de modification de ce fichier.
   - Dès qu'il voit que la date a changé, il recharge immédiatement tous les processus Node.js !
   - **Zero Downtime** : L'ancien processus continue de servir les requêtes ouvertes pendant que le nouveau démarre en arrière-plan.

---

## 6. Gestion des Migrations de Base de Données sans SSH

Si vous ajoutez un nouveau champ dans `prisma/schema.prisma` et que vous n'avez pas de terminal SSH :

- **Méthode 1 (Automatique si MySQL / Postgres distant)** :  
  Si vous utilisez une base MySQL ou PostgreSQL et que vous ajoutez le secret `PROD_DATABASE_URL` dans GitHub, le workflow exécute `npx prisma db push` directement depuis le runner GitHub avant l'envoi FTP !
- **Méthode 2 (Bouton "Run JS Script" dans cPanel)** :  
  Le workflow déploie un script dédié `scripts/migrate.js`.  
  Dans cPanel > **Setup Node.js App**, dans le champ **Run JS Script**, tapez simplement `scripts/migrate.js` et cliquez sur **Run** pour mettre à jour la structure de la base en 2 secondes.

---

## 7. Stockage Persistant des Uploads (Photos & Cartes Grises)

Pour que les photos de véhicules et les cartes grises ne soient jamais écrasées par un déploiement :
1. Créez un répertoire externe : `/home/username/maalalcars_storage/`.
2. Dans le Gestionnaire de Fichiers cPanel, créez un lien symbolique vers le dossier public :
   ```text
   /home/username/maalalcars_app/public/storage -> /home/username/maalalcars_storage
   ```
3. L'action FTP ignore formellement `**/storage/**`.

---

## 8. Prévention des Pannes & Optimisation Mémoire (Zéro Crash)

### 1. Prévention de la Mise en Veille (Anti Cold-Start Cron)
Phusion Passenger endort les applications inactives après 5 minutes. Pour éviter les 3 secondes de latence au premier chargement :
- Dans cPanel > **Tâches Cron**, ajoutez une tâche toutes les 5 minutes :
  ```bash
  */5 * * * * curl -s -o /dev/null "https://votredomaine.com/api/features"
  ```

### 2. Verrouillage Mémoire V8 (`NODE_OPTIONS="--max-old-space-size=512"`)
Les mutualisés tuent automatiquement les processus qui dépassent 1 Go de RAM. En plafonnant la mémoire V8 à 512 Mo dans `.env.production`, Node.js nettoie sa mémoire en continu et ne dépasse jamais les limites de l'hébergeur.
