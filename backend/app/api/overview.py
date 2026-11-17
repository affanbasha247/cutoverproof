"""Dashboard overview totals derived from stored reports."""

from pathlib import Path

from fastapi import APIRouter, Depends

from app.api.deps import get_reports_dir
from app.api.schemas import OverviewResponse
from app.reports.store import build_overview

router = APIRouter()


@router.get("/overview", response_model=OverviewResponse)
def overview(reports_dir: Path = Depends(get_reports_dir)) -> OverviewResponse:
    return build_overview(reports_dir)
