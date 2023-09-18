import pathlib
from typing import List, Union

from pydantic import AnyHttpUrl, Field, validator
from pydantic_settings import BaseSettings


BASE_DIR = pathlib.Path(__file__).absolute().parent.parent


class APISettings(BaseSettings):
    CORS_ORIGINS: Union[str, List[AnyHttpUrl]] = Field(
        ["http://localhost:3000"], env="CORS_ORIGINS"
    )

    @validator("CORS_ORIGINS", pre=True)
    def _assemble_cors_origins(cls, cors_origins):
        if isinstance(cors_origins, str):
            return [item.strip() for item in cors_origins.split(",")]
        return cors_origins

    class Config:
        env_file = BASE_DIR / ".env"
