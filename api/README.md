# GeoRecord-Auth
The main API microservice for GeoRecord

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

**Note:** Currently all api endpoints require an auth token. This token should be issued by the auth microservices. This you may register a user by running the docker-compose file in the parent directory and posting a json body like:
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

#### Threads
- POST (/threads/location_id) : Creates a new thread for a location  
  - Example POST body : `{
    "location_id": "<location id>",
    "title": "test_title",
    "descript": "test_description"
}`

- POST (/threads/comment/thread_id) : Create a new comment for a thread  
  - Example POST body: `{
    "thread_id": "<thread id>",
    "comment": "test comment",
    "user_id": "<User id>"
}`
- GET (/threads/location_id) : Gets all threads for a location 
  - Example GET body: `{"location_id": "<location id>"}`
- GET (/threads/comment/thread_id) : Get all comments for a thread  
  - - Example GET body: `{"thread_id": "<thread id>"}`

#### Search
- Search by **location name**: searches location names like search term
  - endpoint: `/api/v1/search/?query=<search_term>` 
  - example response: `{
    "error": false,
    "message": "Successfully retrieved locations.",
    "payload": [
        {
            "id": "83758b0f-fff7-46dd-b9c0-57d2f262e463",
            "name": "location1"
        },
        {
            "id": "77666a17-bf5a-4a2c-9e12-11b60f2e3892",
            "name": "location2"
        }
    ]
}`

## Feature checklist
- [x] Authentication middleware
- [ ] Healthcheck endpoint (GET `/health`). Should be exempt from authentication.
- [x] Add a location (POST `/location`)
- [ ] On Location creation, do linear ring validation (you can currently insert bad locations into the system)
- [x] Get a location (GET `/location/{location id}`)
- [x] Query locations (GET `/location/query/{bounding box}`). Should return all polygons that intersect a given bounding box in GeoJSON format with metadata attached (HARD).
- [ ] Search locations (GET `/location/search/{search query}?{filter1}&{filter2}&{etc}`). Allows users to search locations with a set of optional filters.
- [ ] Query a thread (GET `/thread/{location id}) Returns the content of a given location's thread. Should be paginated and chronologically ordered. **Note:** there's no need to create a thread, as they are automatically created when a location is created.
- [ ] Comment on a thread (POST `/thread/location). Should support text and an optionally attached set of images. (HARD - probably leave until we figure out storage)
- [ ] **Your idea here**. If you can think of a feature we need feel free to add it to the list. Just make sure it wouldn't be better suited in one of the other micrservices.
