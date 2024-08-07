from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import bcrypt
import jwt

router = APIRouter()

class Login(BaseModel):
    email: EmailStr
    password: str

async def get_db_connection(request: Request):
    async with request.app.state.db_pool.acquire() as connection:
        yield connection

@router.post("/login")
async def login(request: Request, login: Login, conn = Depends(get_db_connection)):
    query = "SELECT id, name, email, password FROM auth WHERE email = $1"
    user = await conn.fetchrow(query, login.email)

    if user and bcrypt.checkpw(login.password.encode('utf-8'), user['password'].encode('utf-8')):
        payload = {
            "id": str(user['id']),
            "name": user['name'],
            "email": user['email']
        }
        token = jwt.encode(payload, request.app.state.JWT_SECRET_KEY, algorithm="HS256")
        return {
            "error": False,
            "message": "Successfully logged in.",
            "payload": {
                "jwt": token,
                "id": str(user['id']),
                "name": user['name'],
                "email": user['email']
            }
        }
    else:
        return JSONResponse(
            status_code = 401,
            content = {
                "error": True,
                "message": "Incorrect email or password.",
                "payload": {}
            }
        )
