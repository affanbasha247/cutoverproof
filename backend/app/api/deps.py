"""Shared FastAPI dependencies.

Directories are exposed as dependencies so tests can point the API at a
temporary folder without touching the real data directory.
"""

from pathlib import Path

from app.core import paths


def get_configs_dir() -> Path:
    return paths.CONFIGS_DIR


def get_reports_dir() -> Path:
    return paths.REPORTS_DIR
