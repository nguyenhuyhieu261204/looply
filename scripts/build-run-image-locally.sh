#!/bin/bash
# Script: build-and-run-locally.sh
# Location: scripts/
# Purpose: Build and run backend + frontend Docker images locally

# ----------------------
# Fix PATH for Docker in WSL (conditional)
# ----------------------
if [[ -d "/mnt/c/Program Files/Docker/Docker/resources/bin" ]]; then
    export PATH="/usr/bin:/usr/local/bin:/mnt/c/Program Files/Docker/Docker/resources/bin:$PATH"
fi

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
# Check Docker availability
# ----------------------
check_docker() {
    log_info "Checking Docker availability..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker command not found!"
        log_error "Please ensure Docker Desktop is running and WSL integration is enabled."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running!"
        log_error "Please start Docker Desktop."
        exit 1
    fi
    
    log_success "Docker is available: $(docker --version)"
}

# ----------------------
# Variables
# ----------------------
# Backend
BACKEND_IMAGE_NAME="looply-api"
BACKEND_TAG="latest"
BACKEND_DOCKERFILE="./server"
BACKEND_PORT=8000

# Frontend
FRONTEND_IMAGE_NAME="looply-frontend"
FRONTEND_TAG="latest"
FRONTEND_DOCKERFILE="./client"
FRONTEND_PORT=3000

# ----------------------
# Function: Remove old image
# ----------------------
remove_old_image() {
    local IMAGE=$1
    local TAG=$2
    if docker image inspect "${IMAGE}:${TAG}" > /dev/null 2>&1; then
        log_info "Removing existing image: ${IMAGE}:${TAG}"
        docker rmi -f "${IMAGE}:${TAG}" && log_success "Old image removed successfully." || {
            log_error "Failed to remove old image: ${IMAGE}:${TAG}"
            exit 1
        }
    else
        log_warning "No existing image found: ${IMAGE}:${TAG}"
    fi
}

# ----------------------
# Function: Build image
# ----------------------
build_image() {
    local IMAGE=$1
    local TAG=$2
    local BUILD_PATH=$3

    log_info "Building Docker image: ${IMAGE}:${TAG}"
    docker build -t "${IMAGE}:${TAG}" "${BUILD_PATH}" && log_success "Docker image built successfully: ${IMAGE}:${TAG}" || {
        log_error "Docker build failed: ${IMAGE}:${TAG}"
        exit 1
    }
}

# ----------------------
# Function: Run container
# ----------------------
run_container() {
    local IMAGE=$1
    local TAG=$2
    local NAME=$3
    local PORT=$4

    # Stop & remove container if it exists
    if docker ps -a --format '{{.Names}}' | grep -Eq "^${NAME}\$"; then
        log_warning "Container ${NAME} already exists. Removing..."
        docker rm -f "${NAME}" > /dev/null 2>&1
    fi

    log_info "Starting container ${NAME} from image ${IMAGE}:${TAG} on port ${PORT}"
    docker run -d --name "${NAME}" -p "${PORT}:${PORT}" "${IMAGE}:${TAG}" && \
        log_success "Container ${NAME} is running on port ${PORT}" || {
        log_error "Failed to run container ${NAME}"
        exit 1
    }
}

# ----------------------
# Main function
# ----------------------
main() {
    log_info "Starting Docker build & run process for backend and frontend..."
    
    # Check Docker first
    check_docker

    # Build backend
    remove_old_image "${BACKEND_IMAGE_NAME}" "${BACKEND_TAG}"
    build_image "${BACKEND_IMAGE_NAME}" "${BACKEND_TAG}" "${BACKEND_DOCKERFILE}"

    # Build frontend
    remove_old_image "${FRONTEND_IMAGE_NAME}" "${FRONTEND_TAG}"
    build_image "${FRONTEND_IMAGE_NAME}" "${FRONTEND_TAG}" "${FRONTEND_DOCKERFILE}"

    # Run backend container
    run_container "${BACKEND_IMAGE_NAME}" "${BACKEND_TAG}" "looply-api-container" "${BACKEND_PORT}"

    # Run frontend container
    run_container "${FRONTEND_IMAGE_NAME}" "${FRONTEND_TAG}" "looply-frontend-container" "${FRONTEND_PORT}"

    log_success "All Docker images built and containers are running!"
}

# ----------------------
# Execute main with trap for unexpected exit
# ----------------------
trap 'echo; log_error "Script exited unexpectedly. Press ENTER to close..."; read' EXIT
main
trap - EXIT 
echo
read -p "Press ENTER to exit..."