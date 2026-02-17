#!/bin/bash

# Configuration
VPS_IP="103.159.50.249"
VPS_USER="root"
OLD_DIR="/var/www/recruitment"
BACKUP_DIR="/var/www/recruitment_bak_$(date +%Y%m%d)"
NEW_REPO_URL="https://github.com/dndkhoa3012/recruitment-system.git"

echo "🚀 Starting VPS migration to Monorepo..."

ssh -t $VPS_USER@$VPS_IP "
    set -e # Stop on error

    echo '1. backing up old folder...'
    if [ -d \"$OLD_DIR\" ]; then
        mv $OLD_DIR $BACKUP_DIR
        echo '   -> Backup created at $BACKUP_DIR'
    else
        echo '   -> Old directory not found, skipping backup.'
    fi

    echo '2. Cloning new Monorepo...'
    git clone $NEW_REPO_URL $OLD_DIR
    
    echo '3. Restoring .env file...'
    if [ -f \"$BACKUP_DIR/.env\" ]; then
        cp $BACKUP_DIR/.env $OLD_DIR/recruitment/.env
        echo '   -> .env restored.'
    else
        echo '   -> WARNING: .env not found in backup!'
    fi

    echo '4. Restarting Docker containers...'
    # Stop old containers to avoid conflicts (force remove)
    docker rm -f recruitment_app recruitment_db || true
    
    # Start new
    cd $OLD_DIR/recruitment
    docker compose up -d --build
    
    echo '✅ Migration complete!'
"
