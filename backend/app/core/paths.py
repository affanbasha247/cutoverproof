"""Filesystem locations used by the backend.

All paths are resolved relative to the repository root, so the backend can be
started from any working directory without losing access to the data folder.
"""

from pathlib import Path

# .../CutoverProof/backend/app/core/paths.py
BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_ROOT = BACKEND_DIR.parent

DATA_DIR = PROJECT_ROOT / "data"
CONFIGS_DIR = DATA_DIR / "policies"
SCENARIOS_DIR = DATA_DIR / "scenarios"
PLANS_DIR = DATA_DIR / "plans"
REPORTS_DIR = DATA_DIR / "reports"

DATA_DIRECTORIES = (
    DATA_DIR,
    CONFIGS_DIR,
    SCENARIOS_DIR,
    PLANS_DIR,
    REPORTS_DIR,
)


def ensure_data_dirs() -> None:
    """Create the local data folders if they do not exist yet."""
    for directory in DATA_DIRECTORIES:
        directory.mkdir(parents=True, exist_ok=True)
