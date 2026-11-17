"""CutoverProof FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.paths import ensure_data_dirs

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    ensure_data_dirs()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=(
        "Local research prototype for verifying that AWS IAM cutovers do not "
        "leave unauthorized access paths behind."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/", include_in_schema=False)
def root() -> dict:
    return {
        "service": "cutoverproof-api",
        "version": settings.version,
        "docs": "/docs",
        "health": "/api/health",
    }
