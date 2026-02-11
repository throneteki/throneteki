#!/usr/bin/env bash
set -euo pipefail

# =====================================================================
# Throneteki Production Setup Script
#
# Prerequisites:
#   - Docker and Docker Compose installed
#   - Git installed
#   - Port 80 (and 443 for SSL) available on the host
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# =====================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "============================================"
echo "  Throneteki Production Setup"
echo "============================================"
echo ""

# --- Step 1: Check prerequisites ---
echo "[1/6] Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    echo "  https://docs.docker.com/engine/install/"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose (v2) is not available."
    echo "  Install with: apt-get install docker-compose-plugin"
    exit 1
fi

echo "  Docker: $(docker --version)"
echo "  Docker Compose: $(docker compose version)"
echo ""

# --- Step 2: Initialize git submodules (card data) ---
echo "[2/6] Initializing git submodules (card data)..."
cd "$REPO_ROOT"
git submodule update --init --recursive
echo ""

# --- Step 3: Create .env from template if missing ---
echo "[3/6] Checking environment file..."
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
    cp .env.example .env
    echo "  Created .env from .env.example"
    echo "  >> Please edit deploy/.env and set PUBLIC_DOMAIN to your server's hostname or IP."
else
    echo "  .env already exists, skipping."
fi
echo ""

# --- Step 4: Check production config ---
echo "[4/6] Checking production config..."

if grep -q 'CHANGE_ME' config/production.json5; then
    echo ""
    echo "  WARNING: config/production.json5 still contains default secrets."
    echo "  You MUST edit it before going live:"
    echo "    - Set 'secret' to a random string (openssl rand -hex 32)"
    echo "    - Set 'hmacSecret' to a different random string"
    echo "    - Set 'origin' to your public URL"
    echo ""

    read -rp "  Continue anyway for initial testing? [y/N] " response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "  Aborting. Edit the config and re-run this script."
        exit 1
    fi
fi
echo ""

# --- Step 5: Create SSL directory ---
echo "[5/6] Preparing SSL directory..."
mkdir -p nginx/ssl

if [ ! -f nginx/ssl/fullchain.pem ]; then
    echo "  No SSL certificates found in deploy/nginx/ssl/."
    echo "  The site will run on HTTP only."
    echo "  To enable HTTPS later:"
    echo "    1. Place fullchain.pem and privkey.pem in deploy/nginx/ssl/"
    echo "    2. Uncomment the HTTPS block in deploy/nginx/nginx.conf"
    echo "    3. Restart nginx: docker compose restart nginx"
fi
echo ""

# --- Step 6: Build and start ---
echo "[6/6] Building and starting services..."
echo ""

docker compose build
docker compose up -d mongo redis
echo "  Waiting for MongoDB to be ready..."
sleep 5

echo "  Importing card data (this may take a minute)..."
docker compose run --rm fetchdata

echo "  Starting lobby, game node, and nginx..."
docker compose up -d lobby gamenode nginx

echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
echo ""
echo "  Services running:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

PUBLIC_DOMAIN=$(grep -oP 'PUBLIC_DOMAIN=\K.*' .env 2>/dev/null || echo "localhost")
echo "  Open in your browser: http://${PUBLIC_DOMAIN}"
echo ""
echo "  Useful commands (run from the deploy/ directory):"
echo "    docker compose logs -f          # View all logs"
echo "    docker compose logs -f lobby    # View lobby logs"
echo "    docker compose logs -f gamenode # View game node logs"
echo "    docker compose restart          # Restart all services"
echo "    docker compose down             # Stop all services"
echo "    docker compose down -v          # Stop and delete all data"
echo ""
