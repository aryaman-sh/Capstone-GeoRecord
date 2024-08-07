from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import jwt

class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip middleware for unprotected routes (currently all routes are protected)
        if request.url.path in ["/api/v1/user/health"]:
            response = await call_next(request)
            return response

        # Extract the JWT from the Authorization header
        jwt_token: str = request.headers.get("Authorization")
        if jwt_token and jwt_token.startswith("Bearer "):
            jwt_token = jwt_token[7:]  # Remove "Bearer " prefix
        else:
            # No valid JWT provided
            return JSONResponse(status_code=403, content={
                    "error": True,
                    "message": "Invalid token.",
                    "payload": {}
                }
            )

        try:
            # Validate and decode the JWT
            payload = jwt.decode(jwt_token, request.app.state.JWT_SECRET_KEY, algorithms=["HS256"])
            request.state.user = payload  # Attach user payload to request state
        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=403, content={
                    "error": True,
                    "message": "Token has expired. Please try to sign out and sign back in again",
                    "payload": {}
                })
        except jwt.InvalidTokenError:
            return JSONResponse(status_code=403, content={
                    "error": True,
                    "message": "Invalid. Please try to sign out and sign back in again",
                    "payload": {}
                })

        response = await call_next(request)
        return response
