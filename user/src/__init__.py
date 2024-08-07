from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import bcrypt
import jwt
import sqlite3
from contextlib import contextmanager

# Define a Pydantic model for user input validation
class User(BaseModel):
    email: EmailStr
    password: str

# Create a database connection pool (context manager to handle the database connection)
@contextmanager
def get_db_connection():
    conn = sqlite3.connect('test.db')
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Initialize your FastAPI router
router = APIRouter()

# Sample function to create a user
@router.post("/register")
async def register_user(user: User):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO users (email, password) VALUES (?, ?)
        ''', (user.email, hashed_password))
        db.commit()
    return {"message": "User registered successfully"}

# Sample function to login a user
@router.post("/login")
async def login_user(user: User):
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute('''
            SELECT password FROM users WHERE email = ?
        ''', (user.email,))
        record = cursor.fetchone()
        if record and bcrypt.checkpw(user.password.encode('utf-8'), record['password']):
            token = jwt.encode({"email": user.email}, "secret", algorithm="HS256")
            return {"token": token}
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
