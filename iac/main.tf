terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "aws" {
  region                   = "us-east-1"
  default_tags {
    tags = {
      Course     = "CSSE6400"
      Name       = "GeoRecord"
      Automation = "Terraform"
    }
  }
}

data "aws_ecr_authorization_token" "ecr_token" {}

provider "docker" {
  # Uncomment the following to use on mac
  host ="unix:///Users/tday/.docker/run/docker.sock"
  registry_auth {
    address  = data.aws_ecr_authorization_token.ecr_token.proxy_endpoint
    username = data.aws_ecr_authorization_token.ecr_token.user_name
    password = data.aws_ecr_authorization_token.ecr_token.password
  }
}

data "aws_iam_role" "lab" {
  name = "LabRole"
}

locals {
    database_username = "postgres"
    database_password = "ThisIsATestPasswordPlzDontUseInProd"
}

output "url" {
  value  = "https://${aws_cloudfront_distribution.georecord.domain_name}/"
}
