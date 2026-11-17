"""Read-only helpers for locally stored analysis reports.

Phase 1 does not generate reports yet. These helpers make the dashboard work
against whatever real report files exist under ``data/reports`` and return an
honest ``no_data`` state when the folder is empty.
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional

from app.api.schemas import LatestActivity, OverviewResponse, ReportFileInfo

VALID_STATUSES = {"safe", "at_risk", "unknown"}


def _iso_mtime(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).isoformat()


def _read_json(path: Path) -> Optional[Dict[str, Any]]:
    try:
        content = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return content if isinstance(content, dict) else None


def _normalise_status(value: Any) -> Optional[str]:
    if not isinstance(value, str):
        return None
    status = value.strip().lower()
    if status == "unsafe":
        status = "at_risk"
    return status if status in VALID_STATUSES else None


def _report_status(data: Dict[str, Any]) -> str:
    for key in ("security_status", "overall_status", "status"):
        status = _normalise_status(data.get(key))
        if status is not None:
            return status
    return "unknown"


def _non_negative_int(value: Any) -> Optional[int]:
    if isinstance(value, bool):
        return None
    if isinstance(value, int) and value >= 0:
        return value
    return None


def _summary(data: Dict[str, Any]) -> Dict[str, Any]:
    summary = data.get("summary")
    return summary if isinstance(summary, dict) else {}


def _scenario_count(data: Dict[str, Any]) -> int:
    summary = _summary(data)
    value = _non_negative_int(summary.get("scenarios_tested"))
    if value is None:
        value = _non_negative_int(data.get("scenarios_tested"))
    return value if value is not None else 1


def _attack_path_count(data: Dict[str, Any]) -> int:
    summary = _summary(data)
    value = summary.get("attack_paths", data.get("attack_paths", 0))
    if isinstance(value, list):
        return len(value)
    count = _non_negative_int(value)
    return count if count is not None else 0


def _report_files(directory: Path) -> List[Path]:
    if not directory.exists():
        return []
    return sorted(
        directory.glob("*.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _metadata(path: Path, data: Optional[Dict[str, Any]]) -> ReportFileInfo:
    status = _report_status(data) if data is not None else "unknown"
    created_at = None
    if data is not None and isinstance(data.get("created_at"), str):
        created_at = data["created_at"]
    return ReportFileInfo(
        id=path.stem,
        filename=path.name,
        created_at=created_at or _iso_mtime(path),
        security_status=status,
    )


def list_reports(directory: Path) -> List[ReportFileInfo]:
    return [_metadata(path, _read_json(path)) for path in _report_files(directory)]


def build_overview(directory: Path) -> OverviewResponse:
    scenarios_tested = 0
    safe_transitions = 0
    unsafe_transitions = 0
    attack_paths = 0

    latest: Optional[LatestActivity] = None
    statuses: List[str] = []

    for path in _report_files(directory):
        data = _read_json(path)
        if data is None:
            continue

        status = _report_status(data)
        statuses.append(status)
        scenarios_tested += _scenario_count(data)
        attack_paths += _attack_path_count(data)
        if status == "safe":
            safe_transitions += 1
        elif status == "at_risk":
            unsafe_transitions += 1

        if latest is None:
            title = data.get("title")
            latest = LatestActivity(
                report_id=path.stem,
                title=title if isinstance(title, str) and title else path.stem,
                security_status=status,
                created_at=(
                    data["created_at"]
                    if isinstance(data.get("created_at"), str)
                    else _iso_mtime(path)
                ),
            )

    if not statuses:
        aggregate: Literal["no_data", "safe", "at_risk", "unknown"] = "no_data"
    elif any(status == "at_risk" for status in statuses):
        aggregate = "at_risk"
    elif all(status == "safe" for status in statuses):
        aggregate = "safe"
    else:
        aggregate = "unknown"

    return OverviewResponse(
        scenarios_tested=scenarios_tested,
        safe_transitions=safe_transitions,
        unsafe_transitions=unsafe_transitions,
        attack_paths=attack_paths,
        latest_activity=latest,
        security_status=aggregate,
    )
