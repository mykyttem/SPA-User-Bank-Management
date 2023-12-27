from fastapi import APIRouter
from pydantic import BaseModel


# sqlalchemy
from sqlalchemy.exc import ProgrammingError, OperationalError, DatabaseError


# files
from log import logger, msg_connection_db, msg_close_db
from database import engine
from models import Users
from parse_randomUser import random_user


"""
    - get random user, when click button
    - save in DB
    - display always from db
    - edit user, delete
"""

router = APIRouter()


# Get amount random users
class Data(BaseModel):
    amount: int


# Get id for delete from DB
class DeleteUserData(BaseModel):
    id: int

# Get data edit user
class EditUserData(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: str
    password: str


# routes
@router.post("/api/users")
async def add_user(amount: Data):
    # get amount 
    amount = amount.amount
    user_data = random_user(amount=amount)


    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)  

            for user_dict in user_data:
                # Save the users to the database
                connection.execute(Users.__table__.insert().values(user_dict))
                connection.commit()

            # Fetch all users from the "Users" table after insertion
            users_result = connection.execute(Users.__table__.select())
            users = users_result.fetchall()

            # Extract user data from the result set
            users_data = [
                {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "password": user.password
                }
                for user in users
            ]

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")

        # Set users_data to an empty list in case of an error
        users_data = []


    return {"users": users_data}


@router.post("/api/users/delete")
async def delete_user(id_user: DeleteUserData):
    # get user id
    id_user = id_user.id

    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            # delete from DB
            connection.execute(Users.__table__.delete().where(Users.id == id_user))
            connection.commit()

            logger.warning(f"Delete user from database id = {id_user}")

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")


# Update 
@router.post("/api/users/edit")
async def edit_user(updated_data: EditUserData):
    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            # Access data from the updated_data Pydantic model
            id_user = updated_data.id
            first_name = updated_data.first_name
            last_name = updated_data.last_name
            username = updated_data.username
            email = updated_data.email
            password = updated_data.password

            # Update the user in the database
            connection.execute(
                Users.__table__.update().where(Users.id == id_user).values(
                    first_name=first_name,
                    last_name=last_name,
                    username=username,
                    email=email,
                    password=password
                )
            )
            connection.commit()

            logger.info(f"User with ID {id_user} updated in the database")

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")