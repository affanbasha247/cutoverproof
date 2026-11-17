"""Report listing and raw report retrieval.

Report generation itself is implemented in Phase 6. Any JSON file placed in
``data/reports`` is treated as a real analysis result and surfaced as-is.
"""

import json
import re
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from app.api.deps import get_reports_dir
from app.api.schemas import ReportListResponse
from app.reports.store import list_reports

router = APIRouter()

REPORT_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]+$")


@router.get("/reports", response_model=ReportListResponse)
def reports(reports_dir: Path = Depends(get_reports_dir)) -> ReportListResponse:
    return ReportListResponse(reports=list_reports(reports_dir))


@router.get("/reports/{report_id}")
def report_detail(
    report_id: str,
    reports_dir: Path = Depends(get_reports_dir),
) -> JSONResponse:
    if not REPORT_ID_PATTERN.match(report_id):
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid report identifier.", "phase": 1},
        )

    report_path = (reports_dir / f"{report_id}.json").resolve()
    if report_path.parent != reports_dir.resolve():
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid report path.", "phase": 1},
        )
    if not report_path.is_file():
        raise HTTPException(
            status_code=404,
            detail={"message": "Report not found.", "phase": 1},
        )

    try:
        content = json.loads(report_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise HTTPException(
            status_code=422,
            detail={"message": f"Report is not valid JSON: {exc}", "phase": 1},
        ) from exc

    return JSONResponse(content=content)
