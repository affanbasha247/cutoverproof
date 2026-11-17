"""Application settings.

Values can be overridden with environment variables prefixed with
``CUTOVERPROOF_`` (for example ``CUTOVERPROOF_VERSION``).
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CutoverProof API"
    version: str = "0.1.0"
    mode: str = "local-simulation"
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_prefix="CUTOVERPROOF_",
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
