from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import bcrypt
import jwt

router = APIRouter()

class Register(BaseModel):
    name: str
    email: EmailStr  # Using EmailStr for email validation
    password: str

async def get_db_connection(request: Request):
    async with request.app.state.db_pool.acquire() as connection:
        yield connection

@router.post("/register")
async def register(register: Register, request: Request, conn = Depends(get_db_connection)):
    # Check if email already exists
    check_user_query = "SELECT id FROM auth WHERE email = $1"
    existing_user = await conn.fetchrow(check_user_query, register.email)
    if existing_user:
        return JSONResponse(
            status_code = 422,
            content = {
                "error": True,
                "message": "This user has already registered.",
                "payload": {}
            }
        )

    # Hash password
    hashed_password = bcrypt.hashpw(register.password.encode('utf-8'), bcrypt.gensalt())

    # Insert new user into database
    insert_query = """
    INSERT INTO auth (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id
    """
    new_user_id = await conn.fetchval(insert_query, register.name, register.email, hashed_password.decode('utf-8'))

    # Generate JWT
    payload = {
        "id": str(new_user_id),
        "name": register.name,
        "email": register.email
    }

    jwt_secret_key = request.app.state.JWT_SECRET_KEY  # Assuming you have set this in your app's state
    token = jwt.encode(payload, jwt_secret_key, algorithm="HS256")

    return {
        "error": False,
        "message": "User successfully registered.",
        "payload": {
            "jwt": token,
            "id": str(new_user_id),
            "name": register.name,
            "email": register.email
        }
    }
