resource "aws_cloudfront_distribution" "georecord" {

  enabled         = true
  is_ipv6_enabled = true
  comment         = "Georecord"

  default_cache_behavior {
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ]
    cache_policy_id          = aws_cloudfront_cache_policy.georecord.id //"4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress    = true
    default_ttl = 0
    max_ttl     = 0
    min_ttl     = 0
    origin_request_policy_id = aws_cloudfront_origin_request_policy.georecord.id //"216adef6-5c7f-47e4-b989-5492eafa07d3"
    smooth_streaming       = false
    target_origin_id       = aws_lb.georecord_lb.dns_name
    trusted_key_groups     = []
    trusted_signers        = []
    viewer_protocol_policy = "allow-all"
  }

  origin {
    connection_attempts = 3
    connection_timeout  = 10
    domain_name         = aws_lb.georecord_lb.dns_name
    origin_id           = aws_lb.georecord_lb.dns_name

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_ssl_protocols = [
        "SSLv3",
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2",
      ]
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_cache_policy" "georecord" {
  comment     = "Policy with caching disabled"
  default_ttl = 0
  max_ttl = 0
  min_ttl = 0
  name    = "Managed-CachingDisabled"

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = false
    enable_accept_encoding_gzip   = false

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"

    }

    query_strings_config {
      query_string_behavior = "none"

    }
  }
}

resource "aws_cloudfront_origin_request_policy" "georecord" {
  name    = "Managed-AllViewer"
  comment = "Policy to forward all parameters in viewer requests"


  cookies_config {
    cookie_behavior = "all"
  }
  headers_config {
    header_behavior = "allViewer"
  }
  query_strings_config {
    query_string_behavior = "all"
  }
}
