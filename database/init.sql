-- Database initialization script
-- This runs automatically on first container startup

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE myapp TO myuser;

-- Run migrations
\i /docker-entrypoint-initdb.d/migrations/001_initial_schema.sql

-- Run seeds in development
\i /docker-entrypoint-initdb.d/seeds/seed_data.sql
