from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from uuid import UUID

router = APIRouter()

async def get_db_connection(request: Request):
    async with request.app.state.db_pool.acquire() as connection:
        yield connection


@router.get("/search/")
async def search_locations(query: str, request: Request, conn=Depends(get_db_connection)):
    """
    Return a JSON of polygon ids and names that match the given query parameter.
    """
    search_query = f"%{query}%"
    sql_query = """
        SELECT id, name
        FROM locations
        WHERE name ILIKE $1
    """

    rows = await conn.fetch(sql_query, search_query)

    if not rows:
        return JSONResponse(
            status_code=404,
            content={
                "error": True,
                "message": "No locations found.",
                "payload": []
            }
        )

    locations_list = [
        {
            "id": str(location["id"]),
            "name": location["name"],
            "url": f"/{str(location['id'])}" 
        }
        for location in rows
    ]

    return JSONResponse(
        status_code=200,
        content={
            "error": False,
            "message": "Successfully retrieved locations.",
            "payload": locations_list
        }
    )
