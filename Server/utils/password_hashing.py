from bcrypt import hashpw
import base64
import hashlib
import bcrypt


class PasswordHasher:

    def hash_pass(self, password: str) -> str:
        hashed = bcrypt.hashpw(
            base64.b64encode(hashlib.sha256(password.encode()).digest()), bcrypt.gensalt()
        )
        return hashed.decode()

    def check_password(self, password: str, hashed: str) -> bool:
        return bcrypt.checkpw(
            password=password.encode(), hashed_password=hashed.encode()
        )
