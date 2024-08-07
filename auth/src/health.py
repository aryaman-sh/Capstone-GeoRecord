from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import json

router = APIRouter()

"""
Get a location by ID and return it as GeoJSON
"""
@router.get("/health")
async def get_location(request: Request) -> JSONResponse:

    return JSONResponse(
        status_code=200,
        content={
            "error": False,
            "message": "Service healthy.",
            "payload": {}
        }
    )
