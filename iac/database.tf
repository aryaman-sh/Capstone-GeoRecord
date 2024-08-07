resource "aws_rds_cluster" "georecord_db" {
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"
  engine_version         = "15.4"
  master_username        = local.database_username
  master_password        = local.database_password
  skip_final_snapshot    = true
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.allow_db.id]
  apply_immediately      = true
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  count               = 1
  identifier          = "georecorddb"
  cluster_identifier  = aws_rds_cluster.georecord_db.id
  instance_class      = "db.t4g.medium" # TODO: increase size later
  engine              = aws_rds_cluster.georecord_db.engine
  engine_version      = aws_rds_cluster.georecord_db.engine_version
  publicly_accessible = true
}

# Create a Subnet Group for RDS
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "db_subnet_group"
  subnet_ids = data.aws_subnets.ecs_subnet.ids
}

# Allow traffic to the RDS from within the VPC
resource "aws_security_group" "allow_db" {
  name        = "allow_db"
  description = "Allow internal access to the RDS instance"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "db_endpoint" {
  value = aws_rds_cluster.georecord_db.endpoint
}

output "db_cluster_arn" {
  value = aws_rds_cluster.georecord_db.arn
}

output "db_connection_string" {
  value = "postgresql://${local.database_username}:${local.database_password}@${aws_rds_cluster.georecord_db.endpoint}/georecord"
}

locals {
  db_connection_string = "postgresql://${local.database_username}:${local.database_password}@${aws_rds_cluster.georecord_db.endpoint}/georecord"
}
