# API endpoint tests

## Running:
```
poetry install
poetry run pytest src
```

## Test plans:

### Auth Microservice test plan

#### TC1: Successful Login
- **Objective**: Verify that a valid user can log in successfully.
- **Steps**:
    1. Call `/login` with valid email and password.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false and a non-null `jwt`.

#### TC2: Register New User
- **Objective**: Verify that a new user can register.
- **Steps**:
    1. Generate a unique email.
    2. Call `/register` with the new email and a password.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false.

#### TC3: Register Existing User
- **Objective**: Verify that registering an already registered email fails.
- **Steps**:
    1. Call `/register` with an existing user's email and password.
- **Expected Result**:
    - Status code 422.

#### TC4: Login with Wrong Email
- **Objective**: Verify that login with a non-existing email is rejected.
- **Steps**:
    1. Call `/login` with a modified (incorrect) email of an existing user.
- **Expected Result**:
    - Status code not 200.

#### TC5: Login with Wrong Password
- **Objective**: Verify that login with a wrong password is rejected.
- **Steps**:
    1. Call `/login` with valid email and a wrong password.
- **Expected Result**:
    - Status code not 200.

#### TC6: Health Check
- **Objective**: Verify that the health check endpoint is up and running.
- **Steps**:
    1. Call `/health`.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false.

### Location Management

#### TC7: Register New Location
- **Objective**: Verify that a new location can be registered.
- **Steps**:
    1. Call `/location` with valid location details and JWT.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false.

#### TC8: Register Invalid Location
- **Objective**: Verify that registering an invalid location is rejected.
- **Steps**:
    1. Call `/location` with incomplete location details and JWT.
- **Expected Result**:
    - Status code other than 200.
    - JSON response with `error` true.

#### TC9: Retrieve Registered Location
- **Objective**: Verify that a previously registered location can be retrieved.
- **Steps**:
    1. Call `/location/{location_id}` with a valid location ID and JWT.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false and location details.

#### TC10: Query Locations in Bounding Box
- **Objective**: Verify that locations within a bounding box are correctly returned.
- **Steps**:
    1. Call `/location/query/{bounding_box}` with a valid bounding box and JWT.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false and one or more locations.

### Thread Management

#### TC11: Create Thread for a Location
- **Objective**: Verify that a thread can be created for a given location.
- **Steps**:
    1. Call `/threads/{location_id}` with valid thread details and JWT.
- **Expected Result**:
    - Status code 201.
    - JSON response with `error` false.

#### TC12: Retrieve Threads for a Location
- **Objective**: Verify that threads for a given location can be retrieved.
- **Steps**:
    1. Call `/threads/{location_id}` with a valid location ID and JWT.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false and one or more threads.

### Comment Management

#### TC13: Create Comment on a Thread
- **Objective**: Verify that a comment can be added to a thread.
- **Steps**:
    1. Call `/threads/comment/{thread_id}` with valid comment details and JWT.
- **Expected Result**:
    - Status code 201.
    - JSON response with `error` false.

#### TC14: Retrieve Comments for a Thread
- **Objective**: Verify that comments for a given thread can be retrieved.
- **Steps**:
    1. Call `/threads/comment/{thread_id}` with a valid thread ID and JWT.
- **Expected Result**:
    - Status code 200.
    - JSON response with `error` false and one or more comments.
