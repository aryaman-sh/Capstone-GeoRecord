# GeoRecord-Auth
The user microservice for GeoRecord

## Running
Simply run `docker-compose` in the parent directory and all the services will be started.

## Developing
__It's as easy as 123:__

1. Run the docker-compose file to start postgres and the other microservices.
```sh
docker-compose up # Note this needs to be run in the parent directory
```

2. Run the development server
```sh
poetry install
poetry run fastapi run src/main.py
```

3. You may now access the api at `http://127.0.0.1:8000`

**Note:** Some of the api endpoints require an auth token. This token should be issued by the auth microservices. This you may register a user by running the docker-compose file in the parent directory and posting a json body like:
```json
{
  "email": "pog@mail.com",
  "name": "pog",
  "password": "pog"
}
```
to `http://localhost:8080/api/v1/auth/register`. This should return you a JWT to use.

## Documentation
Follow the instructions in the __Developing__ section above and then navigate to `http://127.0.0.1:8000/docs`. The docs are on that webpage. Make sure to update then as you go.

## Feature checklist
- [x] Authentication middleware
- [x] Healthcheck endpoint (GET `/health`). Should be exempt from authentication.
- [ ] Get all locations submitted by a user (GET `/locations/{user_id}`). Should return valid GeoJSON.
- [ ] Get public profile info (GET `/{user_id}`). Returns name, profile photo url, user_id, etc.
- [ ] Get private profile info (GET `/profile/{user_id}`). Returns full info (e.g. name, email, DoB, owned API keys).
