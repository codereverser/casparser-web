import pathlib

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = pathlib.Path(__file__).absolute().parent.parent


class APISettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env")

    CORS_ORIGINS: str | list[AnyHttpUrl] = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _assemble_cors_origins(cls, cors_origins):
        if isinstance(cors_origins, str):
            return [item.strip() for item in cors_origins.split(",")]
        return cors_origins
