#!/bin/bash
# =============================================
# Script: artifact-registry-setup.sh
# Purpose: Prepare GCP infrastructure for project using Artifact Registry
# Usage: ./artifact-registry-setup.sh
# =============================================

# ----------------------
# Config variables
# ----------------------
PROJECT_ID="${GCP_PROJECTID:-looply-478609}"
PROJECT_NAME="${GCP_PROJECTNAME:-looply}"
REGION="${GCP_REGION:-us-central1}"
FRONTEND_REPO="${GCP_FRONTEND_REPO:-looply-frontend}"
BACKEND_REPO="${GCP_BACKEND_REPO:-looply-backend}"
POLICY_FILE="${GCP_POLICY_FILE:-./gcp/artifact-registry/artifact-registry-cleanup.json}"

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
        log_error "Project $PROJECT_ID does not exist. Create it using 'gcloud projects create $PROJECT_ID --name=$PROJECT_NAME'"
        exit 1
    fi
    log_success "Project $PROJECT_ID exists."
}

set_project() {
    log_info "Setting project to $PROJECT_ID..."
    
    if gcloud config set project $PROJECT_ID &> /dev/null; then
        log_success "Project set to $PROJECT_ID."
    else
        log_error "Failed to set project to $PROJECT_ID."
        exit 1
    fi
}

enable_artifact_registry() {
    log_info "Enabling Artifact Registry API..."
    
    if gcloud services enable artifactregistry.googleapis.com &> /dev/null; then
        log_success "Artifact Registry API enabled."
    else
        log_error "Failed to enable Artifact Registry API."
        exit 1
    fi
}

create_repositories() {
    log_info "Creating repositories..."
    
    if ! gcloud artifacts repositories describe $FRONTEND_REPO --location=$REGION &> /dev/null; then
        log_info "Creating repository $FRONTEND_REPO..."
        gcloud artifacts repositories create $FRONTEND_REPO \
            --repository-format=docker \
            --location=$REGION \
            --description="Repository for Looply Frontend Docker images" || {
                log_error "Failed to create repository $FRONTEND_REPO."
                exit 1
            }
        log_success "Repository $FRONTEND_REPO created."
    else
        log_warning "Repository $FRONTEND_REPO already exists."
    fi
    
    if ! gcloud artifacts repositories describe $BACKEND_REPO --location=$REGION &> /dev/null; then
        log_info "Creating repository $BACKEND_REPO..."
        gcloud artifacts repositories create $BACKEND_REPO \
            --repository-format=docker \
            --location=$REGION \
            --description="Repository for Looply Backend Docker images" || {
                log_error "Failed to create repository $BACKEND_REPO."
                exit 1
            }
        log_success "Repository $BACKEND_REPO created."
    else
        log_warning "Repository $BACKEND_REPO already exists."
    fi

    log_success "Repositories created."
}

apply_policies() {
    log_info "Applying policies..."

    if [ ! -f "$POLICY_FILE" ]; then
        log_error "Policy file $POLICY_FILE does not exist."
        exit 1
    fi  
    
    gcloud artifacts repositories set-cleanup-policies $FRONTEND_REPO \
        --project=$PROJECT_ID \
        --location=$REGION \
        --policy=$POLICY_FILE || {
            log_error "Failed to apply policies to repository $FRONTEND_REPO."
            exit 1
        }
    
    gcloud artifacts repositories set-cleanup-policies $BACKEND_REPO \
        --project=$PROJECT_ID \
        --location=$REGION \
        --policy=$POLICY_FILE || {
            log_error "Failed to apply policies to repository $BACKEND_REPO."
            exit 1
        }
    log_success "Policies applied."
}

# ----------------------
# Main function
# ----------------------
main() {
    log_info "Starting GCP GCR setup..."

    check_gcloud_installed
    check_login
    check_project
    set_project
    enable_artifact_registry
    create_repositories
    apply_policies

    log_success "GCP Artifact Registry setup complete!"
    echo -e "  ${YELLOW}docker tag IMAGE_NAME $REGION-docker.pkg.dev/$PROJECT_ID/$FRONTEND_REPO/IMAGE_NAME:TAG${NC}"
    echo -e "  ${YELLOW}docker push $REGION-docker.pkg.dev/$PROJECT_ID/$FRONTEND_REPO/IMAGE_NAME:TAG${NC}"
    echo -e "  ${YELLOW}docker tag IMAGE_NAME $REGION-docker.pkg.dev/$PROJECT_ID/$BACKEND_REPO/IMAGE_NAME:TAG${NC}"
    echo -e "  ${YELLOW}docker push $REGION-docker.pkg.dev/$PROJECT_ID/$BACKEND_REPO/IMAGE_NAME:TAG${NC}"
}

# ----------------------
# Run main function
# ----------------------
main
