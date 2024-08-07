workspace {

    model {
        user = person "User" "Interacts with the system."

        georecord = softwareSystem "GeoRecord" "The GeoRecord Web Application" {


            frontend = container "Frontend" "A web interface to interact with the service" "React" "Web Browser" {
                auth_hook = component "Auth Hook" "A React hook that manages authentication state and communication"
                location_hook = component "Location Hook" "A React hook that manages location state and communication"
                user_hook = component "User Hook" "A React hook that manages user data communication"
            }

            auth_microservice = container "Auth Microservice" "A microservice responsible for managing user authentication"
            api_microservice = container "API Microservice" "A microservice responsible for managing location data"
            user_microservice = container "User Microservice" "A microservice responsible for managing user data"
            frontend_microservice = container "Frontend Microservice" "A microservice responsible for serving the web frontend"



            db = container "PostGIS" "A geospatial database based on Postgres" "PostGIS" "Database"

            user -> this "uses"
            user -> frontend "Interacts with"

            frontend_auth_rel = auth_hook -> auth_microservice "Authenticates with" "JSON/HTTPS"
            frontend_api_rel = frontend -> api_microservice "Gets/Sets location data" "JSON/HTTPS"
            frontend_user_rel = frontend -> user_microservice "Sets/Gets user data" "JSON/HTTPS"
            frontend_frontend_rel = frontend -> frontend_microservice "Retreives frontend code" "HTTPS"


            auth_microservice -> db "Queries" "TCP/IP"
            api_microservice -> db "Queries" "TCP/IP"
            user_microservice -> db "Queries" "TCP/IP"
        }



        production = deploymentEnvironment "Production" {
            deploymentNode "Customer's computer" "" "" {
                production_web_browser = deploymentNode "Web Browser" "" "Chrome, Firefox, Safari, or Edge" {
                    production_frontend = containerInstance frontend
                }
            }

            production_aws_global = deploymentNode "AWS Global" "" "" {
                production_cdn = infrastructureNode "CDN" "Effeciently routes and caches traffic" "AWS Cloudfront" {}
            }

            deploymentNode "AWS US-EAST-1" "" "" {
                production_lb = infrastructureNode "Application Load Balancer" "Routes requests to the microservices" "AWS Elastic Load Balancer" {}

                production_frontend_microservice_ecs = deploymentNode "ECS Services" "AWS serverless scaleable container hosting" "AWS Elastic Container Service" {
                    production_frontend_microservice = containerInstance frontend_microservice
                    production_auth_microservice = containerInstance auth_microservice
                    production_api_microservice = containerInstance api_microservice
                    production_user_microservice = containerInstance user_microservice
                }

                production_database = deploymentNode "RDS" "AWS managed database hosting" "AWS Relational Database Service" {
                    production_db = containerInstance db
                }

            }

            production_frontend -> production_cdn "Web Traffix" "HTTPS"
            production_cdn -> production_lb "Web Traffic" "HTTP"

            production_lb -> production_frontend_microservice "Forwards web page requests" "HTTP"
            production_lb -> production_auth_microservice "Forwards authentication requests" "HTTP/JSON"
            production_lb -> production_api_microservice "Forwards location requests" "HTTP/JSON"
            production_lb -> production_user_microservice "Forwards user data requests" "HTTP/JSON"
        }

    }

    views {
        systemContext georecord {
            include georecord user
            autolayout lr
        }

        container georecord {
            include *
            autolayout lr
        }


        deployment * production {
            include *
            autolayout lr
            exclude frontend_auth_rel frontend_api_rel frontend_user_rel frontend_frontend_rel
        }

        theme default

        styles {
            element "Person" {
                color #ffffff
                fontSize 22
                shape Person
            }
            element "Web Browser" {
                shape WebBrowser
            }
            element "Mobile App" {
                shape MobileDeviceLandscape
            }
            element "Database" {
                shape Cylinder
            }
        }
    }

}
