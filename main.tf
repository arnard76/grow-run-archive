# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }

    neon = {
      source = "kislerdm/neon"
    }

  }
}

provider "neon" {
  api_key = "napi_hldsf2m2p38jnden7zq78l25wi2gdmlezbadb4okf5wrxgi59yw2z4kqb35nc4h8"



}

resource "neon_project" "grow-run-archive-test" {
  name = "Grow Run Archive Test"
}

# Configures the provider to use the resource block's specified project for quota checks.
provider "google-beta" {
  user_project_override = true
}

# Configures the provider to not use the resource block's specified project for quota checks.
# This provider should only be used during project creation and initializing services.
provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

# Terraform configuration to set up providers by version.

# Configures the provider to use the resource block's specified project for quota checks.

# Configures the provider to not use the resource block's specified project for quota checks.

# Creates a new Google Cloud project.
resource "google_project" "default" {
  provider   = google-beta.no_user_project_override
  name       = "Grow Run Archive Test"
  project_id = "grow-run-archive-test"
  # Required for any service that requires the Blaze pricing plan
  # (like Firebase Authentication with GCIP)
  #   billing_account = "000000-000000-000000"

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebasedatabase.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default
  ]
}

# Creates a Firebase Android App in the new project created above.
resource "google_firebase_web_app" "default" {
  provider = google-beta

  project      = google_project.default.project_id
  display_name = "Grow Run Archive UI"

  # Wait for Firebase to be enabled in the Google Cloud project before creating this App.
  depends_on = [
    google_firebase_project.default,
  ]
}

# Creates an Identity Platform config.
# Also enables Firebase Authentication with Identity Platform in the project if not.
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_firebase_project.default.project

  # Auto-deletes anonymous users
  autodelete_anonymous_users = true

  # Configures local sign-in methods, like anonymous, email/password, and phone authentication.
  sign_in {
    allow_duplicate_emails = false

    email {
      enabled           = true
      password_required = false
    }

  }



  # Configures blocking functions.
  blocking_functions {
    triggers {
      event_type   = "beforeSignIn"
      function_uri = "https://us-east1-${google_project.default.project_id}.cloudfunctions.net/before-sign-in"
    }
    forward_inbound_credentials {
      refresh_token = true
      access_token  = true
      id_token      = true
    }
  }

  # Configures a temporary quota for new signups for anonymous, email/password, and phone number.
  quota {
    sign_up_quota_config {
      quota          = 1000
      start_time     = ""
      quota_duration = "7200s"
    }
  }

  # Configures authorized domains.
  authorized_domains = [
    "localhost",
    "${google_project.default.project_id}.firebaseapp.com",
    "${google_project.default.project_id}.web.app",
  ]
}

resource "google_firebase_database_instance" "database" {
  provider = google-beta
  project  = google_firebase_project.default.project
  # See available locations: https://firebase.google.com/docs/database/locations
  region = "asia-southeast1"
  # This value will become the first segment of the database's URL.
  instance_id = "${google_project.default.project_id}-default-rtdb"
  type        = "DEFAULT_DATABASE"
}

