from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url : str
    mistral_api_key : str
    
    class Config:
        env_file = ".env"

settings = Settings()