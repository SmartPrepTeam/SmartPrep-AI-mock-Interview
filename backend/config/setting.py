from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url : str
    mistral_api_key : str
    secret_key : str
    algorithm : str
    webrtc_server_url : str
    access_token_expire_minutes : int
    refresh_token_expire_minutes : int

    class Config:
        env_file = ".env"

settings = Settings()