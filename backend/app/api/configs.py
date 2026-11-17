"""List IAM configuration files available for analysis.

Parsing and diffing are implemented in Phase 2. Phase 1 only exposes real
filesystem metadata so the UI never shows invented configuration data.
"""

from datetime import datetime, timezone
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends

from app.api.deps import get_configs_dir
from app.api.schemas import ConfigFileInfo, ConfigListResponse

router = APIRouter()


@router.get("/configs", response_model=ConfigListResponse)
def list_configs(configs_dir: Path = Depends(get_configs_dir)) -> ConfigListResponse:
    if not configs_dir.exists():
        return ConfigListResponse(configs=[])

    files: List[ConfigFileInfo] = []
    for path in sorted(
        configs_dir.glob("*.json"),
        key=lambda item: item.stat().st_mtime,
        reverse=True,
    ):
        stat = path.stat()
        files.append(
            ConfigFileInfo(
                id=path.stem,
                filename=path.name,
                size_bytes=stat.st_size,
                modified_at=datetime.fromtimestamp(
                    stat.st_mtime, tz=timezone.utc
                ).isoformat(),
            )
        )
    return ConfigListResponse(configs=files)
