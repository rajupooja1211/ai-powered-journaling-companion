# AI-Powered Journaling Companion

An AI-assisted journaling application that helps users reflect on their thoughts, emotions, and patterns over time.
The app supports voice/text journaling, AI-generated insights, and domain-based visualizations (Work, Family, Health, etc.).

# IMPORTANT
This project is designed to run locally using Docker, with secure environment variable handling and a production-aware architecture.

# Tech Stack

# Frontend

Next.js (React)

Material UI

Chart-based visualizations

# Backend

Node.js + Express

# PostgreSQL

pgvector (for embeddings)

REST APIs

# Infrastructure

Docker & Docker Compose

PostgreSQL container with init SQL

Environment-based configuration

# Getting Started (Docker – Recommended)

# Prerequisites (REQUIRED)

Docker

Docker Compose

# No local installation of Node.js or PostgreSQL is required.

# Run the Application (REQUIRED STEP)

# Make sure the Docker application is running before executing this command

From the project root:

docker compose up --build

This command will automatically:

# Start PostgreSQL with demo data

# Start the backend API

# Start the frontend application

# Application URLs (IMPORTANT)

Once the containers are running, access the app here:

# Frontend (UI):
👉 http://localhost:3000

# Backend API:
👉 http://localhost:3001

# Database (PostgreSQL in Docker)

The database runs inside Docker and is automatically initialized with schema + demo data.

# SECURITY NOTE
Since this is a local demo / interview project, database details are shown below.
In production systems, credentials should never be exposed.

# Database Details (Demo-Only)

User: journaluser

Password: journalpass

Database: journaldb

Host (inside Docker): postgres

Port: 5432

# Inspect the Database (Inside Docker) (OPTIONAL BUT USEFUL)

To open a PostgreSQL shell inside the container:

# docker exec -it journal-postgres psql -U journaluser -d journaldb

Useful commands inside psql:
-- List tables
\dt

-- View users
SELECT * FROM users;

-- View journal entries
SELECT * FROM journal_entries;

-- Exit
\q

# Demo Data (IMPORTANT FOR REVIEWERS)

The database is preloaded with:

A demo user: Alex Johnson

Multiple journal entries across domains:

Work

Family

Finances

Health

Relationships

This allows reviewers to explore:

Visualizations

Domain trends

AI insights

No manual data creation is required to evaluate the application.

# Environment Variables & Secrets (CRITICAL)
The .env files should not be pushed to the repo. So please create 2 .env files.
1. .ev inside journaling-backend folder
2.  .env inside journal-app folder 
# ❌ .env files should NOT be committed (by design) 

Secrets and environment-specific values must never be committed to GitHub.

# This repository uses .env files Please use this inside your code to run the application.

Environment Templates (Committed)
# journaling-backend /.env

Database (Docker)
DATABASE_URL=postgresql://journaluser:journalpass@postgres:5432/journaldb

AI Keys (OPTIONAL for demo)
GEMINI_API_KEY = # please insert your gemini key for the functionality

# journal-app /.env.
NEXT_PUBLIC_API_URL=http://localhost:3001


# Add your API keys to backend/.env and restart:

docker compose up --build

# Graceful Degradation (IMPORTANT DESIGN POINT)

If AI keys are not provided:

The app still runs

Journal entries are saved

Visualizations still work

AI features are skipped or limited

This demonstrates secure, production-aware design.

# Docker Commands Reference

# Start everything
docker compose up --build

# Stop containers
docker compose down

# Stop + remove database volume (fresh DB)
docker compose down -v

# Restart backend only
docker compose restart backend

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Design Notes

Secrets are injected via environment variables, never hardcoded

Docker is the default runtime for consistency

Database schema + demo data are initialized via SQL

App is designed to be easy to evaluate in interviews

# Summary

This project demonstrates:

Secure environment handling

Docker-based local development

Clean backend / frontend separation

Thoughtful data modeling

Interview-friendly setup

# Notes for Reviewers (PLEASE READ)

No secrets are included in this repository

AI features are optional

The app runs out-of-the-box with Docker

Database can be inspected easily via Docker commands
