from fastapi import Depends, FastAPI, Request
from fastapi.routing import Lifespan
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from .location import router as location_router
import asyncpg
import os

from .middleware import JWTMiddleware
from .location import router as location_router  # Assuming you have this router setup
from .location_query import router as location_query_router  # The router we are integrating
from .health import router as health_router

DATABASE_URL = os.environ.get('DATABASE_URL', "postgres://postgres:password@localhost:5432/georecord")
# TODO store in env vars
app = FastAPI()
JWT_SECRET_KEY = "SKIBIDI_TOILET" #os.environ['JWT_SECRET_KEY']


@app.on_event("startup")
async def startup():
    app.state.db_pool = await asyncpg.create_pool(dsn=DATABASE_URL)
    print("Database connection pool created")
    app.state.JWT_SECRET_KEY = JWT_SECRET_KEY
    pass

@app.on_event("shutdown")
async def shutdown():
    await app.state.db_pool.close()
    print("Database connection pool closed")
    pass

# Example of middleware addition
app.add_middleware(JWTMiddleware)

@app.get("/secure-data")
async def secure_data(request: Request):
    # Access user info from request state
    user_info = request.state.user
    return {"message": "Secure data accessed", "user": user_info}


# Override default type exception handling
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code = 400,
        content = {
            "error": True,
            "message": str(exc),
            "payload": {}
        }
    )

# add auth middlewhere
app.add_middleware(middleware_class=JWTMiddleware)

# Include the routers
app.include_router(location_router, prefix="/api/v1/user")  # Include location related operations
app.include_router(location_query_router, prefix="/api/v1/user")  # Include advanced location query operations
app.include_router(health_router, prefix="/api/v1/user")