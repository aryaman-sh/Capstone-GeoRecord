# P01-GeoRecord
__Proposal:__ [proposal](https://csse6400.github.io/project-proposal-2024/s4606685/proposal.html)

__Live site:__ [Live site](https://d2rk6xqzz03yk4.cloudfront.net/)

__Video demo:__ [Demo](https://youtu.be/wXcsCujH-wM)

__Report:__ [Report](https://github.com/CSSE6400/P01-GeoRecord/blob/main/report/report.md)

__Communications:__ Facebook messenger for team management, Github issues/pull requests for technical.

## Repo structure
- One docker-compose file in the root of the project that upon running will run the enire project
- A folder for each service (microservices, DB, etc). This folder *must* contain a Dockerfile that runs the service
- The folder `/IaC` which contains the infrastructure as code to deploy the services to AWS
- A folder named "tests" shall contain all the tests

```
/
├── /auth     # Auth API microservice
├── /api      # Main API microservice
├── /frontend # Web frontend
├── /user     # Microservice for user data
├── /IaC      # config for running in production
├── /local    # config for running locally
├── /tests    # The tests for the project
├── docker-compose.yml
```

## Technologies*
- All microservices will be written in python using FastAPI.
- Postgres/RDS will be our primary databases
- Use raw SQL queries over ORM's
- Client-side React for the frontend

## Repo rules
- Functional and strongly-typed code should be preferenced over other styles.
- Write tests for your code
- Let the group know if you are making a *significant* architectural decision.
- All code should run on both x86-64 and ARM64.
- All code should be compatible with Linux at a minimum (Mac/Windows support is always nice)
