from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import asyncpg
import os
from fastapi.middleware.cors import CORSMiddleware

from .login import router as login_router
from .register import router as register_router
from .health import router as health_router

DATABASE_URL = os.environ.get('DATABASE_URL', "postgres://postgres:password@localhost:5432/georecord")
# TODO store in env vars
JWT_SECRET_KEY = "SKIBIDI_TOILET" #os.environ['JWT_SECRET_KEY']

app = FastAPI()

@app.on_event("startup")
async def startup():
    app.state.db_pool = await asyncpg.create_pool(dsn=DATABASE_URL)
    print("Database connection pool created")
    app.state.JWT_SECRET_KEY = JWT_SECRET_KEY

@app.on_event("shutdown")
async def shutdown():
    await app.state.db_pool.close()
    print("Database connection pool closed")

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

# Add locahost origins for local development
origins = [
    "http://localhost:8080",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Include the login router
app.include_router(login_router, prefix="/api/v1/auth")
app.include_router(register_router, prefix="/api/v1/auth")
app.include_router(health_router, prefix="/api/v1/auth")
