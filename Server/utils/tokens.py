import jwt
import os


class TokenManager:

    def encode(self, s):
        KEY = os.environ.get("JWT_SECRET")
        return jwt.encode(s, KEY, algorithm="HS256")

    def decode(self, token: str):
        KEY = os.environ.get("JWT_SECRET")
        return jwt.decode(token, KEY, algorithms="HS256")
