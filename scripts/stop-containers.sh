#!/bin/bash

# ----------------------
# Color logging template
# ----------------------
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ----------------------
# Config
# ----------------------
BACKEND_CONTAINER="looply-api-container"
FRONTEND_CONTAINER="looply-frontend-container"

# ----------------------
# Stop container if running
# ----------------------
stop_container() {
    local NAME=$1

    if docker container inspect "$NAME" > /dev/null 2>&1; then
        log_info "Stopping container: $NAME"
        if docker stop "$NAME" >/dev/null 2>&1; then
            log_success "Stopped: $NAME"
        else
            log_error "Failed to stop: $NAME"
        fi
    else
        log_warning "Container not running: $NAME"
    fi
}

# ----------------------
# Main
# ----------------------
log_info "Stopping backend and frontend containers..."

stop_container "$BACKEND_CONTAINER"
stop_container "$FRONTEND_CONTAINER"

log_success "Done stopping containers!"

echo
read -p "Press ENTER to exit..."
