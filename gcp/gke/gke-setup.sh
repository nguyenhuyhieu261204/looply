#!/bin/bash
# =============================================
# Script: gke-setup.sh
# Purpose: Create a GKE Autopilot cluster
# Usage: ./gke-setup.sh
# =============================================

# ----------------------
# Config variables
# ----------------------
PROJECT_ID="${PROJECT_ID:-looply-478609}"
PROJECT_NAME="${GCP_PROJECTNAME:-looply}"
REGION="${GCP_REGION:-us-central1}"
CLUSTER_NAME="${GCP_CLUSTERNAME:-looply-cluster}"

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

enable_gke() {
    log_info "Enabling GKE API..."
    
    if gcloud services enable container.googleapis.com &> /dev/null; then
        log_success "GKE API enabled."
    else
        log_error "Failed to enable GKE API."
        exit 1
    fi
}

create_gke_cluster() {
    log_info "Checking if GKE Autopilot cluster $CLUSTER_NAME exists in region $REGION..."

    if gcloud container clusters describe "$CLUSTER_NAME" --region "$REGION" &> /dev/null; then
        log_warning "Cluster $CLUSTER_NAME already exists. Skipping creation."
    else
        log_info "Creating GKE Autopilot cluster $CLUSTER_NAME..."
        if gcloud container clusters create-auto "$CLUSTER_NAME" --region "$REGION"; then
            log_success "GKE Autopilot cluster $CLUSTER_NAME created."
        else
            log_error "Failed to create GKE Autopilot cluster $CLUSTER_NAME. See errors above."
            exit 1
        fi
    fi
}

set_kubectl_context() {
    log_info "Setting kubectl context for cluster $CLUSTER_NAME in region $REGION..."

    if gcloud container clusters get-credentials "$CLUSTER_NAME" \
        --region "$REGION" &> /dev/null; then
        log_success "kubectl context set to cluster $CLUSTER_NAME."
    else
        log_error "Failed to set kubectl context for cluster $CLUSTER_NAME."
        exit 1
    fi
}

# ----------------------
# Main function
# ----------------------
main() {
    check_gcloud_installed
    check_login
    check_project
    set_project
    enable_gke
    create_gke_cluster
    set_kubectl_context
}

# ----------------------
# Run the script
# ----------------------
main