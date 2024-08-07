from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import jwt
import json
from uuid import UUID

router = APIRouter()

async def get_db_connection(request: Request):
    async with request.app.state.db_pool.acquire() as connection:
        yield connection

class GeoJsonGeometry(BaseModel):
    type: str
    coordinates: List[List[List[float]]]

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__,
            sort_keys=True,
            indent=4)


class GeoJsonProperties(BaseModel):
    name: str

class Location(BaseModel):
    type: str
    geometry: GeoJsonGeometry
    properties: GeoJsonProperties

"""
Insert a location
"""
@router.post("/location")
async def register(location: Location, request: Request, conn = Depends(get_db_connection)):

    insert_query = """
        INSERT INTO locations(owner_id, name, geometry)
        VALUES($1, $2, ST_GeomFromGeoJSON($3))
        RETURNING id
        """

    new_location_id = await conn.fetchval(insert_query, request.state.user["id"], location.properties.name, location.geometry.toJSON())

    return JSONResponse(
        status_code = 200,
        content = {
            "error": False,
            "message": "Successfully created a new location.",
            "payload": {
                "location_id": str(new_location_id),
                "name": location.properties.name
            }
        }
    )

"""
Get a location by ID and return it as GeoJSON
"""
@router.get("/location/{location_id}")
async def get_location(location_id: UUID, request: Request, conn = Depends(get_db_connection)) -> JSONResponse:
    query = """
        SELECT
            id, name, owner_id,
            ST_AsGeoJSON(geometry)::json AS geometry
        FROM locations
        WHERE id = $1;
        """

    location = await conn.fetchrow(query, str(location_id))
    if location is None:
        return JSONResponse(
            status_code=404,
            content={
                "error": True,
                "message": "Location not found.",
                "payload": {}
            }
        )

    # Preparing GeoJSON
    geojson = {
        "type": "Feature",
        "geometry": location["geometry"],
        "properties": {
            "id": str(location["id"]),
            "name": location["name"],
            "owner_id": str(location["owner_id"])
        }
    }

    return JSONResponse(
        status_code=200,
        content={
            "error": False,
            "message": "Successfully retrieved location.",
            "payload": geojson
        }
    )
