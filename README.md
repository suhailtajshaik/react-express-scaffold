# React Express Scaffold

A production-ready full-stack JavaScript application with a three-tier architecture: React (client), Express (server), and PostgreSQL (database), fully containerized with Docker.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Client     │     │    Server     │     │   Database    │
│  React/Vite   │────▶│   Express     │────▶│  PostgreSQL   │
│  Nginx (prod) │     │  Node.js 20   │     │    16-alpine  │
│    :80/:3000  │     │    :3001      │     │    :5432      │
└──────────────┘     └──────────────┘     └──────────────┘
```

- **Client**: React 18 + Vite 5 SPA served by Nginx in production
- **Server**: Express 4 REST API with PostgreSQL connection pooling
- **Database**: PostgreSQL 16 with migrations and seed data

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)
- [Node.js](https://nodejs.org/) (v20+ for local development without Docker)

## Quick Start

### Development

```bash
# Clone the repository
git clone <repo-url>
cd react-express-scaffold

# Copy environment file
cp .env.example .env

# Start all services with hot reload
npm run dev
```

Services will be available at:
- Client: http://localhost:3000
- Server API: http://localhost:3001
- Database: localhost:5432

### Production

```bash
# Build and start production containers
npm run prod

# Or run detached
npm run prod:detached
```

Production client is served at http://localhost:80

## Project Structure

```
project-root/
├── client/                     # React frontend
│   ├── src/                    # Application source code
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Client utilities
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Vite convention files ONLY
│   │   ├── favicon.ico         # Browser favicon
│   │   ├── robots.txt          # SEO configuration
│   │   └── manifest.json       # PWA manifest
│   ├── static/                 # Custom static files
│   │   ├── templates/email/    # Email HTML templates
│   │   └── assets/             # Images, documents
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── Dockerfile              # Multi-stage Docker build
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/database.js  # PostgreSQL connection pool
│   │   ├── routes/api.js       # API route definitions
│   │   ├── middleware/         # Express middleware
│   │   ├── utils/             # Server utilities
│   │   └── index.js           # Express app entry point
│   ├── esbuild.config.js      # Server build configuration
│   ├── Dockerfile             # Multi-stage Docker build
│   └── package.json
│
├── database/                   # Database scripts
│   ├── init.sql               # Initialization script
│   ├── migrations/            # Schema migration files
│   └── seeds/                 # Sample data
│
├── nginx/nginx.conf           # Nginx configuration
├── docker-compose.yml         # Production orchestration
├── docker-compose.dev.yml     # Development orchestration
└── .env.example               # Environment template
```

## Static Files

This project separates static files into two categories:

| Directory | Purpose | Access |
|-----------|---------|--------|
| `client/public/` | Vite convention files (favicon, robots.txt, manifest) | Root URL path (`/favicon.ico`) |
| `client/static/` | Custom templates, images, documents | `/static/` URL path |

In Docker builds, `client/static/` is copied to both the Nginx image and the server image, allowing the server to load email templates and serve static assets.

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | Database | Database name (default: `myapp`) |
| `POSTGRES_USER` | Database | Database user (default: `myuser`) |
| `POSTGRES_PASSWORD` | Database | Database password |
| `NODE_ENV` | Server | Environment mode |
| `PORT` | Server | Server port (default: `3001`) |
| `DATABASE_URL` | Server | PostgreSQL connection string |
| `STATIC_PATH` | Server | Path to static files |
| `CORS_ORIGIN` | Server | Allowed CORS origin |
| `VITE_API_URL` | Client | API base URL for development |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development with hot reload |
| `npm run dev:detached` | Start development in background |
| `npm run prod` | Build and start production |
| `npm run prod:detached` | Build and start production in background |
| `npm run down` | Stop all containers |
| `npm run down:volumes` | Stop containers and remove volumes |
| `npm run logs` | Follow container logs |
| `npm run build` | Build client and server locally |
| `npm run clean` | Remove build artifacts |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check with database status |
| GET | `/api/items` | List all items |
| GET | `/api/items/:id` | Get item by ID |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |
| GET | `/api/templates/welcome` | Preview welcome email template |

## Database Migrations

Migration files are located in `database/migrations/` and are numbered sequentially:

```
database/migrations/
└── 001_initial_schema.sql
```

To add a new migration:
1. Create a new file: `database/migrations/002_your_migration.sql`
2. Add the SQL statements
3. Update `database/init.sql` to include the new migration
4. For existing databases, run the migration manually or restart with `npm run down:volumes && npm run dev`

**Warning**: `npm run down:volumes` will delete all database data.

## Deployment

### Docker-based Deployment

1. Set production environment variables in `.env`
2. Run `npm run prod:detached`
3. Configure your reverse proxy/load balancer to point to port 80

### Manual Deployment

1. Build assets: `npm run build`
2. Deploy `dist/client/` to a static file server or CDN
3. Deploy `dist/server/` with `node dist/server/index.js`
4. Ensure PostgreSQL is accessible via `DATABASE_URL`

## Security Features

- Helmet.js for HTTP security headers
- Rate limiting on API endpoints (100 requests per 15 minutes)
- CORS configuration with origin whitelist
- Parameterized SQL queries (no string concatenation)
- Environment variable validation on startup
- Multi-stage Docker builds (minimized attack surface)
- `no-new-privileges` security option on containers
- Read-only volume mounts where applicable

## Troubleshooting

### Database connection refused
Ensure the database container is healthy: `docker-compose ps`. The server retries the connection 5 times with a 2-second delay.

### Port already in use
Stop conflicting services or change the port in `.env`:
```bash
PORT=3002  # Server
```

### Hot reload not working
Verify volume mounts in `docker-compose.dev.yml`. On macOS/Windows, ensure Docker Desktop file sharing is enabled for your project directory.

### Permission denied on database init scripts
Ensure `.sql` files have read permissions: `chmod 644 database/*.sql database/**/*.sql`

### Container out of memory
Adjust resource limits in `docker-compose.yml` under `deploy.resources.limits`.
