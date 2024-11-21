from beanie import Document

class BlackList(Document):
    token : str
    class Settings:
        Collection = "blacklisted-tokens"
