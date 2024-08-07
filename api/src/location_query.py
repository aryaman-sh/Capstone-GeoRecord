from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
import json

router = APIRouter()

async def get_db_connection(request: Request):
    async with request.app.state.db_pool.acquire() as connection:
        yield connection

@router.get("/location/query/{bbox}")
async def query_locations(bbox: str, request: Request, conn = Depends(get_db_connection)) -> JSONResponse:
    try:
        # Parse bounding box string to float values
        west, south, east, north = map(float, bbox.split(","))
    except ValueError:
        return JSONResponse(
            status_code = 400,
            content = {
                "error": True,
                "message": "Invalid bounding box format. Use comma-separated float values: west,south,east,north.",
                "payload": {}
            }
        )

    query = """
            SELECT id, name, owner_id, ST_AsGeoJSON(geometry)::json AS geometry
            FROM locations
            WHERE ST_Intersects(geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326));
            """
    records = await conn.fetch(query, west, south, east, north)

    if records:
        # Convert the geometry string back to JSON object before adding to features
        features = [{"type": "Feature",
                     "geometry": json.loads(record["geometry"]),  # Parsing geometry to JSON object
                     "properties": {"id": str(record["id"]),
                                    "name": record["name"],
                                    "owner_id": str(record["owner_id"])}
                    } for record in records]
        feature_collection = {"type": "FeatureCollection", "features": features}
    else:
        feature_collection = {"type": "FeatureCollection", "features": []}

    return JSONResponse(
        status_code=200,
        content={
            "error": False,
            "message": "Successfully retrieved locations.",
            "payload": feature_collection
        }
    )
