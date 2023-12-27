from fastapi import APIRouter
from . import users 

router = APIRouter()

# Include the route handlers
router.include_router(users.router)
