from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from uuid import UUID

router = APIRouter()


async def get_db_connection(request: Request):
    async with request.app.state.db_pool.acquire() as connection:
        yield connection


class Thread(BaseModel):
    location_id: UUID
    title: Optional[str]
    descript: Optional[str]


class Comment(BaseModel):
    thread_id: UUID
    comment: str


@router.post("/threads/{location_id}")
async def create_thread(location_id: UUID, thread: Thread, request: Request, conn=Depends(get_db_connection)):
    """
    Creates a new thread
    """
    query = """
        INSERT INTO threads(location_id, title, descript)
        VALUES($1, $2, $3)
        RETURNING id
    """

    new_thread_id = await conn.fetchval(query, str(location_id), thread.title, thread.descript)

    return JSONResponse(
        status_code=201,
        content={
            "error": False,
            "message": "Successfully created thread.",
            "payload": {
                "thread_id": str(new_thread_id),
                "title": thread.title,
                "description": thread.descript
            }
        }
    )


@router.get("/threads/{location_id}")
async def get_threads(location_id: UUID, request: Request, conn=Depends(get_db_connection)) -> JSONResponse:
    """
    Get threads for a given location id
    """
    query = """
        SELECT id, location_id, title, descript
        FROM threads
        WHERE location_id = $1
    """

    rows = await conn.fetch(query, str(location_id))

    if not rows:
        return JSONResponse(
            status_code=404,
            content={
                "error": True,
                "message": "No threads found for the specified location.",
                "payload": []
            }
        )

    threads = [
        {
            "id": str(row["id"]),
            "location_id": str(row["location_id"]),
            "title": row["title"],
            "descript": row["descript"]
        }
        for row in rows
    ]

    return JSONResponse(
        status_code=200,
        content={
            "error": False,
            "message": "Successfully retrieved threads.",
            "payload": threads
        }
    )


@router.post("/threads/comment/{thread_id}")
async def create_comment(thread_id: UUID, comment: Comment, request: Request, conn=Depends(get_db_connection)):
    """
    Creates a new comment for a thread
    """
    query = """
        INSERT INTO comments(thread_id, user_id, comment)
        VALUES($1, $2, $3)
        RETURNING id
    """

    new_comment_id = await conn.fetchval(query, str(thread_id), request.state.user["id"], comment.comment)

    return JSONResponse(
        status_code=201,
        content={
            "error": False,
            "message": "Successfully created comment.",
            "payload": {
                "comment_id": str(new_comment_id)
            }
        }
    )


@router.get("/threads/comment/{thread_id}")
async def get_comments(thread_id: UUID, request: Request, conn=Depends(get_db_connection)) -> JSONResponse:
    """
    Get comments for given thread_id
    """
    query = """
        SELECT c.id, c.thread_id, c.user_id, c.comment, c.created_at, a.name as user_name
        FROM comments c
        JOIN auth a ON c.user_id = a.id
        WHERE c.thread_id = $1
    """

    rows = await conn.fetch(query, str(thread_id))

    if not rows:
        return JSONResponse(
            status_code=404,
            content={
                "error": True,
                "message": "No comments found for the specified thread.",
                "payload": []
            }
        )

    comments = [
        {
            "id": str(row["id"]),
            "thread_id": str(row["thread_id"]),
            "user_id": str(row["user_id"]),
            "comment": row["comment"],
            "created_at": row["created_at"].isoformat(),
            "user_name": row["user_name"]
        }
        for row in rows
    ]

    return JSONResponse(
        status_code=200,
        content={
            "error": False,
            "message": "Successfully retrieved comments.",
            "payload": comments
        }
    )
