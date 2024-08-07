from fastapi import APIRouter, HTTPException, Depends
import asyncpg
import json
from typing import List

router = APIRouter()

# Assuming you're using asyncpg to manage async database connections
async def get_db():
    conn = await asyncpg.connect(user='user', password='password', database='database', host='localhost')
    try:
        yield conn
    finally:
        await conn.close()

async def get_locations_as_geojson(user_id: str, db):
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }
    try:
        query = "SELECT id, name, ST_AsGeoJSON(geom) as geometry FROM locations WHERE user_id=$1;"
        rows = await db.fetch(query, user_id)
        for row in rows:
            feature = {
                "type": "Feature",
                "properties": {
                    "id": row['id'],
                    "name": row['name']
                },
                "geometry": json.loads(row['geometry'])
            }
            geojson["features"].append(feature)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return geojson


async def get_user_locations(user_id: str, db) -> List[dict]:
    locations = []
    try:
        rows = await db.fetch("SELECT * FROM locations WHERE user_id=$1", user_id)
        for row in rows:
            locations.append({
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": row['coordinates'],  # Ensure your DB has coordinates stored appropriately
                },
                "properties": {
                    "name": row['name'],
                    "created_at": row['created_at'],
                    "description": row.get('description', '')
                }
            })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return locations

@router.get("/locations/{user_id}", response_model=dict)
async def locations_route(user_id: str, db=Depends(get_db)):
    return await get_locations_as_geojson(user_id, db)

