###################################
#   Auth microservice image
###################################
resource "aws_ecr_repository" "auth" {
  name = "georecord/auth"
}

resource "docker_image" "auth" {
  name = "${aws_ecr_repository.auth.repository_url}:latest"
  build {
    context = "${path.cwd}/../auth/"
  }
}

resource "docker_registry_image" "auth" {
  name = docker_image.auth.name
}

###################################
#   api microservice image
###################################

resource "aws_ecr_repository" "api" {
  name = "georecord/api"
}

resource "docker_image" "api" {
  name = "${aws_ecr_repository.api.repository_url}:latest"
  build {
    context = "${path.cwd}/../api/"
  }
}

resource "docker_registry_image" "api" {
  name = docker_image.api.name
}

###################################
#   frontend microservice image
###################################

resource "aws_ecr_repository" "frontend" {
  name = "georecord/frontend"
}

resource "docker_image" "frontend" {
  name = "${aws_ecr_repository.frontend.repository_url}:latest"
  build {
    context = "${path.cwd}/../frontend/"
  }
}

resource "docker_registry_image" "frontend" {
  name = docker_image.frontend.name
}

###################################
#   user microservice image
###################################

resource "aws_ecr_repository" "user" {
  name = "georecord/user"
}

resource "docker_image" "user" {
  name = "${aws_ecr_repository.user.repository_url}:latest"
  build {
    context = "${path.cwd}/../user/"
  }
}

resource "docker_registry_image" "user" {
  name = docker_image.user.name
}
