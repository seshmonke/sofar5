#!/bin/bash

# AssortiShop Backend Deployment Script for Selectel
# This script automates the deployment process

set -e

echo "🚀 AssortiShop Backend Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ This script must be run as root${NC}"
    exit 1
fi

# Step 1: Update Docker
echo -e "${YELLOW}Step 1: Updating Docker and Docker Compose...${NC}"
apt update
apt install -y docker-compose-plugin

# Verify Docker Compose installation
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
echo ""

# Step 2: Check if .env file exists
echo -e "${YELLOW}Step 2: Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.production...${NC}"
    if [ -f ".env.production" ]; then
        cp .env.production .env
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env file and set your actual values:${NC}"
        echo "   - DB_PASSWORD: Set a strong password"
        echo "   - API_URL: Set your server IP or domain"
        echo "   - FRONTEND_URL: Set your server IP or domain"
        echo ""
        read -p "Press Enter after editing .env file..."
    else
        echo -e "${RED}❌ .env.production file not found${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Environment configuration ready${NC}"
echo ""

# Step 3: Build and start containers
echo -e "${YELLOW}Step 3: Building and starting containers...${NC}"
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 10

# Step 4: Run migrations
echo -e "${YELLOW}Step 4: Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate

echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Step 5: Verify deployment
echo -e "${YELLOW}Step 5: Verifying deployment...${NC}"
sleep 5

# Check if containers are running
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Containers are running${NC}"
else
    echo -e "${RED}❌ Containers are not running${NC}"
    docker compose -f docker-compose.prod.yml logs
    exit 1
fi

# Check health endpoint
HEALTH_CHECK=$(curl -s http://localhost:3000/api/health || echo "failed")
if echo "$HEALTH_CHECK" | grep -q "OK"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed. Checking logs...${NC}"
    docker compose -f docker-compose.prod.yml logs backend
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✨ Deployment completed successfully!"
echo "==========================================${NC}"
echo ""
echo "📊 Container Status:"
docker compose -f docker-compose.prod.yml ps
echo ""
echo "🔗 API Endpoints:"
echo "   - Health Check: http://localhost:3000/api/health"
echo "   - API Docs: http://localhost:3000/api-docs"
echo "   - Products: http://localhost:3000/api/products"
echo ""
echo "📝 Useful Commands:"
echo "   - View logs: docker compose -f docker-compose.prod.yml logs -f"
echo "   - Stop: docker compose -f docker-compose.prod.yml down"
echo "   - Restart: docker compose -f docker-compose.prod.yml restart"
echo "   - Database shell: docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop"
echo ""
