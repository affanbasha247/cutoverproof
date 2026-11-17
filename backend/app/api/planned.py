"""Explicit placeholders for capabilities delivered in later phases.

Returning 501 keeps the dashboard honest: no endpoint fabricates SAT results,
attack paths, or deployment plans before those engines exist.
"""

from fastapi import APIRouter, HTTPException

router = APIRouter()


def _not_implemented(phase: int, message: str) -> None:
    raise HTTPException(
        status_code=501,
        detail={"message": message, "phase": phase},
    )


@router.post("/analysis/run")
def run_analysis() -> None:
    _not_implemented(
        2,
        "Configuration parsing and permission diffing arrive in Phase 2.",
    )


@router.post("/simulation/run")
def run_simulation() -> None:
    _not_implemented(
        2,
        "Attack-path simulation arrives in Phase 2 and Phase 4.",
    )


@router.post("/verification/run")
def run_verification() -> None:
    _not_implemented(
        3,
        "Z3 authorization verification arrives in Phase 3.",
    )


@router.post("/planner/run")
def run_planner() -> None:
    _not_implemented(
        5,
        "Safe deployment planning arrives in Phase 5.",
    )
