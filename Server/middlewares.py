from fastapi import Header

from managers.auth import AuthManager

user_manager = AuthManager()


async def auth_validation(authorization=Header()):  # Bearer sindalksndklsandalksndalks
    token = authorization.split("Bearer ")[1]
    return user_manager.get_user(token)
