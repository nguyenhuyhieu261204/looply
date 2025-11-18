#!/bin/bash
# =============================================
# Script: artifact-registry-push.sh
# Purpose: Build Docker image and push to Artifact Registry
# Usage: ./artifact-registry-push.sh
# =============================================


# ----------------------
# Config variables
# ----------------------
PROJECT_ID="${GCP_PROJECTID:-looply-478609}"
REGION="${GCP_REGION:-us-central1}"
BACKEND_REPO="${GCP_BACKEND_REPO:-looply-backend}"
BACKEND_IMAGE_NAME="${GCP_BACKEND_IMAGE_NAME:-looply-api}"
BACKEND_TAG="${GCP_BACKEND_TAG:-latest}"

FRONTEND_REPO="${GCP_FRONTEND_REPO:-looply-frontend}"
FRONTEND_IMAGE_NAME="${GCP_FRONTEND_IMAGE_NAME:-looply-frontend}"
FRONTEND_TAG="${GCP_FRONTEND_TAG:-latest}"  

FULL_BACKEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$BACKEND_REPO/$BACKEND_IMAGE_NAME"
FULL_FRONTEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$FRONTEND_REPO/$FRONTEND_IMAGE_NAME"

# ----------------------
# Color logging
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
# Functions
# ----------------------

check_docker() {
    log_info "Checking if Docker is installed..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Install from https://docs.docker.com/get-docker/"
        exit 1
    fi
    log_success "Docker is installed."
}

check_gcloud_installed() {
    log_info "Checking if gcloud CLI is installed..."
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Install from https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    log_success "gcloud CLI is installed."
}

check_login() {
    log_info "Checking if gcloud is logged in..."
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
        log_error "gcloud is not logged in. Run 'gcloud auth login' to log in."
        exit 1
    fi
    log_success "gcloud is logged in."
}

check_project() {
    log_info "Checking if project $PROJECT_ID exists..."
    if ! gcloud projects describe $PROJECT_ID &> /dev/null; then
        log_error "Project $PROJECT_ID does not exist."
        exit 1
    fi
    log_success "Project $PROJECT_ID exists."
}

create_repository_if_not_exists() {
    local repo_name=$1
    log_info "Checking if Artifact Registry repository '$repo_name' exists..."
    if gcloud artifacts repositories describe $repo_name --location=$REGION --project=$PROJECT_ID &> /dev/null; then
        log_success "Repository $repo_name already exists."
    else
        log_warning "Repository $repo_name does not exist. Creating..."
        gcloud artifacts repositories create $repo_name \
            --repository-format=docker \
            --location=$REGION \
            --description="Auto-created by deploy script" \
            --project=$PROJECT_ID
        log_success "Repository $repo_name created successfully."
    fi
}

ensure_adc_login() {
    log_info "Ensuring Application Default Credentials (ADC) are available..."
    if [ ! -f "$HOME/.config/gcloud/application_default_credentials.json" ]; then
        log_info "ADC not found. Running 'gcloud auth application-default login'..."
        gcloud auth application-default login
    else
        log_success "ADC found."
    fi
}

authenticate_ar() {
    log_info "Configuring standalone Docker credential helper with ADC..."
    
    if ! command -v docker-credential-gcr &> /dev/null; then
        log_error "docker-credential-gcr is not installed or not in PATH. Install from https://github.com/GoogleCloudPlatform/docker-credential-gcr/releases"
        exit 1
    fi
 
    docker-credential-gcr configure-docker --registries=$REGION-docker.pkg.dev || {
        log_error "Failed to configure docker-credential-gcr. Check if ADC is valid."
        exit 1
    }

    log_success "Standalone Docker credential helper configured for Artifact Registry using ADC."
}

grant_artifact_registry_admin() {
    log_info "Granting Artifact Registry Admin role to the current user..."

    CURRENT_USER=$(gcloud config get-value account)

    if [ -z "$CURRENT_USER" ]; then
        log_error "No active gcloud user found."
        exit 1
    fi

    log_info "Adding IAM role roles/artifactregistry.admin for user: $CURRENT_USER"

    if gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="user:$CURRENT_USER" \
        --role="roles/artifactregistry.admin" &> /dev/null; then

        log_success "Role roles/artifactregistry.admin granted to $CURRENT_USER"
    else
        log_error "Failed to grant roles/artifactregistry.admin to $CURRENT_USER"
        exit 1
    fi
}

build_image() {
    local image_name=$1
    local tag=$2
    local path=$3

    log_info "Building image $image_name:$tag from $path..."
    
    docker build -t $image_name:$tag $path || {
        log_error "Failed to build image $image_name:$tag from $path."
        exit 1
    }
    
    log_success "Image $image_name:$tag built successfully."
}

push_image() {
    local image_name=$1
    local tag=$2

    log_info "Pushing image $image_name:$tag to Artifact Registry..."

    docker push $image_name:$tag || {
        log_error "Failed to push image $image_name:$tag to Artifact Registry."
        exit 1
    }

    log_success "Image $image_name:$tag pushed successfully."
}

verify_push() {
    log_info "Verifying images in Artifact Registry..."
    if ! gcloud artifacts docker images describe $FULL_BACKEND_IMAGE:$BACKEND_TAG &> /dev/null; then
        log_error "Backend image not found in Artifact Registry."
        exit 1
    fi
    if ! gcloud artifacts docker images describe $FULL_FRONTEND_IMAGE:$FRONTEND_TAG &> /dev/null; then
        log_error "Frontend image not found in Artifact Registry."
        exit 1
    fi
    log_success "All images verified in Artifact Registry!"
}

# ----------------------
# Main function
# ----------------------
main() {
    log_info "Starting Docker build & push process for backend and frontend..."

    check_docker
    check_gcloud_installed
    check_login
    check_project
    create_repository_if_not_exists $BACKEND_REPO
    create_repository_if_not_exists $FRONTEND_REPO
    grant_artifact_registry_admin     
    ensure_adc_login
    authenticate_ar
    build_image $FULL_BACKEND_IMAGE $BACKEND_TAG ./server
    build_image $FULL_FRONTEND_IMAGE $FRONTEND_TAG ./client
    push_image $FULL_BACKEND_IMAGE $BACKEND_TAG
    push_image $FULL_FRONTEND_IMAGE $FRONTEND_TAG
    verify_push

    log_success "All Docker images built and pushed to Artifact Registry!"
}

# ----------------------
# Run main function
# ----------------------
main
echo
read -p "Press ENTER to exit..."
