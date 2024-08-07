from fastapi import Request
import asyncpg

# Define your database connection details
DATABASE_URL = "postgresql://user:password@localhost/database_name"

async def get_db_connection(request: Request):
    # Acquire a database connection from the connection pool
    async with request.app.state.db_pool.acquire() as connection:
        # Yield the connection to the calling code
        yield connection

async def initialize_database(app):
    # Create a connection pool
    app.state.db_pool = await asyncpg.create_pool(DATABASE_URL)

async def close_database(app):
    # Close the connection pool when the application is shutting down
    await app.state.db_pool.close()

def setup_database(app):
    # Register the event handlers for database initialization and cleanup
    app.on_event("startup")(initialize_database)
    app.on_event("shutdown")(close_database)