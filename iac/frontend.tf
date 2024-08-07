
resource "aws_ecs_cluster" "frontend" {
  name = "georecord-frontend"
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "georecord-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = data.aws_iam_role.lab.arn
  task_role_arn            = data.aws_iam_role.lab.arn

  container_definitions = templatefile("${path.module}/container_definition.json.tpl", {
    image         = docker_registry_image.frontend.name
    task_name     = "frontend"
    database_url  = ""
  })

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
}

resource "aws_ecs_service" "frontend" {
  name            = "georecord-frontend"
  cluster         = aws_ecs_cluster.frontend.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 8080
  }

  network_configuration {
    subnets             = data.aws_subnets.ecs_subnet.ids
    security_groups     = [aws_security_group.frontend.id]
    assign_public_ip    = true
  }

}

resource "aws_security_group" "frontend" {
  name = "frontend"
  description = "frontend microservice Security Group"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


#
# Autoscaling config
#

resource "aws_appautoscaling_target" "frontend" {
  max_capacity       = 4
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.frontend.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  depends_on = [aws_ecs_service.frontend]
}

# CPU policy
resource "aws_appautoscaling_policy" "frontend_cpu_autoscale_policy" {
  name               = "cpu-utilization-target"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.frontend.resource_id
  scalable_dimension = aws_appautoscaling_target.frontend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 50.0
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_in_cooldown  = 10
    scale_out_cooldown = 60
  }
}
