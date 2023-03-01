variable "PROJECT_ID" {
  type        = string
  description = "GCP project ID"
}

variable "COMMON_NAME" {
  type    = string
  default = "game-demo"
}

variable "REGION" {
  type    = string
  default = "us-west1"
}

variable "VPC_NAME" {
  type    = string
  default = "vpc-game-demo"
}

variable "SPANNER_TOPIC" {
  type    = string
  default = "pushToSpannerTest"
}

variable "SIMULATOR_TOPIC" {
  type    = string
  default = "simulatorTest"
}

variable "REDIS_TOPIC" {
  type    = string
  default = "updateRedisTest"
}

variable "SCORE_TOPIC" {
  type    = string
  default = "updateScoreTest"
}

variable "REDIS_INST_NAME" {
  type    = string
  default = "redis-test"
}

variable "SPANNER_INST_NAME" {
  type    = string
  default = "game-demo-inst"
}

variable "SPANNER_DB_NAME" {
  type    = string
  default = "game-demo-db"
}

variable "GKE_CLUSTER_NAME" {
  type    = string
  default = "game-demo-cluster"
}