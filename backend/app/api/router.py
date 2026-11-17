"""Aggregate API router mounted under ``/api``."""

from fastapi import APIRouter

from app.api import configs, health, overview, planned, reports

api_router = APIRouter()
api_router.include_router(health.router, tags=["system"])
api_router.include_router(overview.router, tags=["overview"])
api_router.include_router(configs.router, tags=["configurations"])
api_router.include_router(reports.router, tags=["reports"])
api_router.include_router(planned.router, tags=["planned"])
