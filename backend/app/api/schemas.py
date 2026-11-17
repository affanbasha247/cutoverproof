"""Pydantic response models for the Phase 1 API."""

from typing import List, Literal, Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    mode: str


class LatestActivity(BaseModel):
    report_id: str
    title: str
    security_status: str
    created_at: str


class OverviewResponse(BaseModel):
    scenarios_tested: int
    safe_transitions: int
    unsafe_transitions: int
    attack_paths: int
    latest_activity: Optional[LatestActivity] = None
    security_status: Literal["no_data", "safe", "at_risk", "unknown"]


class ConfigFileInfo(BaseModel):
    id: str
    filename: str
    size_bytes: int
    modified_at: str


class ConfigListResponse(BaseModel):
    configs: List[ConfigFileInfo]


class ReportFileInfo(BaseModel):
    id: str
    filename: str
    created_at: Optional[str] = None
    security_status: Optional[str] = None


class ReportListResponse(BaseModel):
    reports: List[ReportFileInfo]
