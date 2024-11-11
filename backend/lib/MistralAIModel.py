import os
from mistralai import Mistral
from config.config import Config

api_key = os.environ["MISTRAL_API_KEY"] = Config.MISTRAL_API_KEY

client = Mistral(api_key=api_key)
