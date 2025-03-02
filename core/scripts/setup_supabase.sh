#!/bin/bash

# Script to set up Supabase and run migrations

# Define colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}PillChecker Supabase Setup Script${NC}"
echo -e "${YELLOW}==================================${NC}\n"

# Step 1: Check if Supabase CLI is installed
echo -e "${GREEN}Checking Supabase CLI installation...${NC}"
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Supabase CLI is not installed. Please install it first:${NC}"
    echo "brew install supabase/tap/supabase (macOS/Linux)"
    echo "npm install -g supabase (using NPM)"
    exit 1
fi
echo -e "${GREEN}✓ Supabase CLI is installed.${NC}\n"

# Step 2: Stop Supabase if it's running
echo -e "${GREEN}Stopping Supabase services...${NC}"
supabase stop
echo -e "${GREEN}✓ Supabase services stopped.${NC}\n"

# Step 3: Start Supabase with a fresh database
echo -e "${GREEN}Starting Supabase services...${NC}"
supabase start
echo -e "${GREEN}✓ Supabase services started.${NC}\n"

# Step 4: Set the DATABASE_URL environment variable
export DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
echo -e "${GREEN}Environment variables set:${NC}"
echo "DATABASE_URL=$DATABASE_URL"
echo ""

# Step 5: Apply Alembic migrations
echo -e "${GREEN}Applying Alembic migrations...${NC}"
if ! alembic upgrade head; then
    echo -e "${RED}Failed to apply Alembic migrations.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Alembic migrations applied successfully.${NC}\n"

# Step 6: Verify database setup
echo -e "${GREEN}Verifying database setup...${NC}"
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "\dt" | cat
echo -e "${GREEN}✓ Database verification complete.${NC}\n"

echo -e "${GREEN}Supabase setup completed successfully!${NC}"
echo -e "${YELLOW}Supabase services:${NC}"
echo "API URL:      http://127.0.0.1:54321"
echo "GraphQL URL:  http://127.0.0.1:54321/graphql/v1"
echo "Storage URL:  http://127.0.0.1:54321/storage/v1"
echo "Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo "Studio URL:   http://127.0.0.1:54323"
