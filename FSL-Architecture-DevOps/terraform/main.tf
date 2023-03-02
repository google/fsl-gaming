provider "google" {
  project = var.PROJECT_ID
  region  = var.REGION
}

# random ID
resource "random_id" "bucket_prefix" {
  byte_length = 8
}

#resource "google_storage_bucket" "default" {
#  name          = "tfstate-${random_id.bucket_prefix.hex}"
#  force_destroy = false
#  uniform_bucket_level_access = true
#  location      = "US"
#  storage_class = "STANDARD"
#  versioning {
#    enabled = false
#  }
#}

#terraform {
#  backend "gcs" {
#    bucket = "tfstate-${random_id.bucket_prefix.hex}"
#    prefix = "terraform/state"
#  }
#}

# vpc  network
resource "google_compute_network" "vpc_network" {
  name                    = var.VPC_NAME
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "vpc_subnet" {
  name          = "${var.VPC_NAME}-subnet"
  region        = var.REGION
  network       = google_compute_network.vpc_network.self_link
  ip_cidr_range = "10.1.0.0/16"
}

resource "google_compute_firewall" "allow_http" {
  name = "allow-http-${var.COMMON_NAME}"
  network = google_compute_network.vpc_network.self_link
  source_ranges = ["0.0.0.0/0"]
  destination_ranges = ["0.0.0.0/0"]
  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
}

resource "google_compute_firewall" "allow_redis" {
  name    = "allow-redis-${var.COMMON_NAME}"
  network = google_compute_network.vpc_network.self_link
  source_ranges = ["0.0.0.0/0"]
  destination_ranges = ["0.0.0.0/0"]
  allow {
    protocol = "tcp"
    ports    = ["6379", "6380"]
  }
}

# pub/sub
resource "google_pubsub_topic" "spanner_topic" {
  name = "${var.SPANNER_TOPIC}"
}

resource "google_pubsub_subscription" "spanner_topic_sub" {
  name = "${var.SPANNER_TOPIC}-sub"
  topic = google_pubsub_topic.spanner_topic.name
}

resource "google_pubsub_topic" "simulator_topic" {
  name = "${var.SIMULATOR_TOPIC}"
}

resource "google_pubsub_subscription" "simulator_topic_sub" {
  name = "${var.SIMULATOR_TOPIC}-sub"
  topic = google_pubsub_topic.simulator_topic.name
}

resource "google_pubsub_topic" "redis_topic" {
  name = "${var.REDIS_TOPIC}"
}

resource "google_pubsub_subscription" "redis_topic_sub" {
  name = "${var.REDIS_TOPIC}-sub"
  topic = google_pubsub_topic.redis_topic.name
}

resource "google_pubsub_topic" "score_topic" {
  name = "${var.SCORE_TOPIC}"
}

resource "google_pubsub_subscription" "score_topic_sub" {
  name = "${var.SCORE_TOPIC}-sub"
  topic = google_pubsub_topic.score_topic.name
}

# memory store - redis
resource "google_redis_instance" "redis_instance" {
  name               = var.REDIS_INST_NAME
  tier               = "BASIC"
  memory_size_gb     = 5
  authorized_network = google_compute_network.vpc_network.self_link
}

# Spanner
resource "google_spanner_instance" "spanner_instance" {
  name         = var.SPANNER_INST_NAME
  config       = "regional-${var.REGION}"
  display_name = var.SPANNER_INST_NAME
  processing_units = 200
}

resource "google_spanner_database" "spanner_database" {
  instance = google_spanner_instance.spanner_instance.name
  name     = var.SPANNER_DB_NAME
  deletion_protection = false
}

# GKE
resource "google_container_cluster" "gke_cluster" {
  name     = var.GKE_CLUSTER_NAME
  location = var.REGION
  network    = google_compute_network.vpc_network.name
  subnetwork = google_compute_subnetwork.vpc_subnet.name
  remove_default_node_pool = true
  initial_node_count       = 1
  enable_ip_masq = true
}

resource "google_container_node_pool" "gke_node_pool" {
  name = "${var.GKE_CLUSTER_NAME}-default"
  location = var.REGION
  cluster = google_container_cluster.gke_cluster.name
  node_count = 1

  node_config {
    preemptible  = true    
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

