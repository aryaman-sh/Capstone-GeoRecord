#
# Load balancer
#
resource "aws_lb" "georecord_lb" {
  name               = "georecord"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.auth.id]
  subnets            = data.aws_subnets.ecs_subnet.ids

  enable_deletion_protection = false
}

resource "aws_lb_listener" "georecord_listener" {
  load_balancer_arn = aws_lb.georecord_lb.arn
  port              = "80"
  protocol          = "HTTP"

  # Todo forward to frontend
  default_action {
      type = "fixed-response"

      fixed_response {
        content_type = "text/plain"
        message_body = "Fixed response content"
        status_code  = "200"
      }
    }
}

#
# Auth routing
#
resource "aws_lb_target_group" "auth_tg" {
  name     = "auth-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/" # todo: Change later when we have a health endpoint
    protocol            = "HTTP"
    matcher             = "404" # todo: Change later when we have a health endpoint
  }

}

resource "aws_lb_listener_rule" "auth_rule" {
  listener_arn = aws_lb_listener.georecord_listener.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.auth_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/auth/*"]
    }
  }

}

#
# API
#
resource "aws_lb_target_group" "api_tg" {
  name     = "api-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/" # todo: Change later when we have a health endpoint
    protocol            = "HTTP"
    matcher             = "403" # todo: Change later when we have a health endpoint
  }

}

resource "aws_lb_listener_rule" "api_rule" {
  listener_arn = aws_lb_listener.georecord_listener.arn
  priority     = 300

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/*"]
    }
  }

}

#
# frontend
#
resource "aws_lb_target_group" "frontend_tg" {
  name     = "frontend-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/" # todo: Change later when we have a health endpoint
    protocol            = "HTTP"
    matcher             = "403" # todo: Change later when we have a health endpoint
  }

}

resource "aws_lb_listener_rule" "frontend_rule" {
  listener_arn = aws_lb_listener.georecord_listener.arn
  priority     = 400

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }

  condition {
    path_pattern {
      values = ["*"]
    }
  }

}


#
# user
#
resource "aws_lb_target_group" "user_tg" {
  name     = "user-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/" # todo: Change later when we have a health endpoint
    protocol            = "HTTP"
    matcher             = "403" # todo: Change later when we have a health endpoint
  }
}

resource "aws_lb_listener_rule" "user_rule" {
  listener_arn = aws_lb_listener.georecord_listener.arn
  priority     = 201

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.user_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/user/*"]
    }
  }

}
