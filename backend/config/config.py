
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MISTRAL_API_KEY: str 
    MONGODB_ATLAS:str
    model_config = SettingsConfigDict(
        env_file=".env", 
        extra="ignore"
    )