from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Dict
import asyncpg
from uuid import UUID
from .db_utils import get_db_connection

router = APIRouter()

@router.get("/locations/{user_id}", response_model=Dict[str, List])  # Ensure correct response model
async def get_locations_by_user(user_id: UUID, conn=Depends(get_db_connection)):
    try:
        # Query to select locations by user_id
        query = """
        SELECT ST_AsGeoJSON(geometry)::json AS geometry, properties
        FROM locations
        WHERE owner_id = $1;
        """
        records = await conn.fetch(query, str(user_id))
        if not records:
            raise HTTPException(status_code=404, detail="No locations found for this user.")

        # Constructing GeoJSON FeatureCollection
        features = [{"type": "Feature", "geometry": record["geometry"], "properties": record["properties"]} for record in records]
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        return geojson

    except asyncpg.exceptions.PostgresError as e:
        # Handle database errors
        raise HTTPException(status_code=500, detail=str(e))
