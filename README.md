# App Base Laravel

Core riutilizzabile per nuovi progetti web. Stack moderno con auth, ruoli e area admin pronti.

## Tecnologie

| Strato | Tecnologia | Versione |
|---|---|---|
| Linguaggio backend | PHP | 8.5 |
| Framework backend | Laravel | 12.x |
| Database | MySQL | 8 |
| Bridge SPA | Inertia.js | 2.x |
| Frontend | React | 19 |
| Linguaggio frontend | TypeScript | 5.x |
| Routing JS | Ziggy | 2.x |
| Bundler | Vite | 7.x |
| Stile | Tailwind CSS | 4.x (CSS-first) |
| Componenti UI | HeroUI | 2.x |
| Animazioni | Framer Motion | 12.x |
| Auth scaffold | Laravel Breeze | 2.x (React + TS + dark) |
| Ruoli/permessi | spatie/laravel-permission | 7.x |
| Test | PHPUnit | 11.x |

### Caratteristiche pronte
- Login, registrazione, recupero password, verifica email, conferma password
- Dark mode persistente (localStorage + prefers-color-scheme)
- Localizzazione **italiana** (auth, validation, passwords, pagination)
- Due ruoli predefiniti: `admin`, `user` (Spatie). Nuovi utenti ricevono `user` in automatico
- Layout separati: `GuestLayout`, `UserLayout` (Navbar), `AdminLayout` (sidebar + topbar)
- Area `/admin` protetta da middleware `role:admin`
- Auth utente condiviso via Inertia con `roles` e `permissions`

## Installazione locale (Herd + DBngin)

Requisiti: macOS con [Laravel Herd](https://herd.laravel.com/), [DBngin](https://dbngin.com/) (o MySQL 8 locale), Node 20+, npm 11+.

```bash
git clone <repo-url> mio-progetto
cd mio-progetto

# Backend
composer install
cp .env.example .env
php artisan key:generate

# Configura .env: DB_HOST/PORT/DATABASE/USERNAME/PASSWORD,
# APP_URL (es. http://mio-progetto.test)

# Database
mysql -u root -h 127.0.0.1 -P 3306 -e "CREATE DATABASE base_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate --seed

# Frontend
npm install
npm run dev          # Vite dev server con HMR
# oppure
npm run build        # build produzione
```

Apri `http://<nome-cartella>.test` (Herd associa automaticamente il dominio).

### Credenziali default (seeder)
- **Admin** — `admin@example.com` / `password`
- **User** — `user@example.com` / `password`

> Cambia le password subito o rimuovi il seeder prima del primo deploy.

### Comandi utili

```bash
php artisan migrate:fresh --seed      # ricrea schema + seed
php artisan route:list                # elenco rotte
php artisan tinker                    # REPL
npm run dev                           # Vite + HMR
npm run build                         # build produzione
php artisan test                      # PHPUnit
```

## Struttura chiave

```
app/
  Http/Controllers/Admin/             # controller area admin
  Http/Middleware/HandleInertiaRequests.php   # condivide auth.user con roles/permissions
  Models/User.php                     # usa HasRoles trait
bootstrap/app.php                     # alias middleware Spatie (role, permission)
database/seeders/
  RoleSeeder.php                      # crea ruoli admin/user
  DatabaseSeeder.php                  # crea utenti default
lang/it/                              # traduzioni italiane
resources/
  css/app.css                         # Tailwind v4 + plugin HeroUI
  js/
    Components/                       # ApplicationLogo, ThemeToggle
    Layouts/                          # GuestLayout, UserLayout, AdminLayout
    Pages/Admin/                      # dashboard admin
    Pages/Auth/                       # Login, Register, ecc.
    Pages/Profile/                    # gestione profilo
    Providers/ThemeProvider.tsx       # gestione tema chiaro/scuro
    types/                            # tipi condivisi (PageProps, User)
hero.ts                               # wrapper plugin HeroUI per Tailwind v4
routes/web.php                        # gruppo /admin con role:admin
```

## Aggiungere ruoli o permessi

```php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

Permission::firstOrCreate(['name' => 'manage articoli']);

$role = Role::findByName('user');
$role->givePermissionTo('manage articoli');

$user->givePermissionTo('manage articoli');
$user->assignRole('editor');
```

In Inertia/React i ruoli e permessi dell'utente sono in `auth.user.roles` e `auth.user.permissions` (array di stringhe).

Protezione route Laravel:
```php
Route::get('/articoli', ...)->middleware('permission:manage articoli');
Route::get('/admin/...', ...)->middleware('role:admin');
```

## Deploy in produzione (Linux + Ploi)

Riferimento: server Linux (Ubuntu/Debian) gestito con [Ploi](https://ploi.io/).

### 1. Server Ploi
- Crea il sito su Ploi e collega il repository GitHub.
- **PHP 8.5** sul sito (Ploi permette di selezionare la versione per sito).
- Crea un database MySQL 8 dal pannello Ploi e annota credenziali.
- Aggiungi `Node.js` LTS (20+) tra le installazioni del server (Server → Settings).

### 2. Variabili `.env` produzione
Da Ploi (Site → Environment) imposta minimo:
```
APP_NAME="Nome App"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://miosito.it
APP_LOCALE=it
APP_FALLBACK_LOCALE=it

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=no-reply@miosito.it
MAIL_FROM_NAME="${APP_NAME}"
```

Genera la chiave: `php artisan key:generate` (una sola volta).

### 3. Deploy script Ploi
Sostituisci/aggiungi nel "Deploy script" del sito su Ploi:

```bash
cd /home/ploi/miosito.it

git pull origin main

composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Frontend assets
npm ci
npm run build

php artisan migrate --force
php artisan storage:link || true

# Caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Spatie Permission
php artisan permission:cache-reset

# Reload PHP-FPM (Ploi)
echo "" | sudo -S service php8.5-fpm reload
```

### 4. SSL e dominio
- Da Ploi: Site → Domains, aggiungi dominio principale e abilita Let's Encrypt.
- Imposta `APP_URL` con `https://`.

### 5. Permessi cartelle
```bash
sudo chown -R ploi:ploi storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 6. Queue (se usata)
Ploi → Site → Daemons:
- Comando: `php artisan queue:work --tries=3 --backoff=10`
- Working dir: directory del sito
- Processi: 1–2

### 7. Cron Laravel
Ploi → Site → Cron:
- `* * * * * php /home/ploi/miosito.it/artisan schedule:run >> /dev/null 2>&1`

### 8. Primo seed in produzione
**Solo la prima volta** (poi rimuovi le credenziali default):
```bash
php artisan db:seed --class=RoleSeeder --force
# Crea l'admin manualmente:
php artisan tinker
> $u = App\Models\User::create(['name'=>'Admin','email'=>'tu@miosito.it','password'=>bcrypt('...'),'email_verified_at'=>now()]);
> $u->assignRole('admin');
```

### Checklist pre-go-live
- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] Chiave applicazione generata
- [ ] Database in produzione migrato
- [ ] `RoleSeeder` eseguito
- [ ] Admin reale creato, utenti seed di esempio rimossi
- [ ] `npm run build` eseguito (cartella `public/build/` presente)
- [ ] `storage/` e `bootstrap/cache/` scrivibili
- [ ] Mail SMTP configurata e testata (`php artisan tinker` → invia mail di test)
- [ ] HTTPS attivo
- [ ] Backup DB schedulato (Ploi → Server → Backups)

## Risorse

- Laravel: https://laravel.com/docs
- Inertia.js: https://inertiajs.com
- HeroUI: https://heroui.com
- Tailwind v4: https://tailwindcss.com/docs/v4-beta
- Spatie Permission: https://spatie.be/docs/laravel-permission
- Ploi: https://ploi.io/documentation
