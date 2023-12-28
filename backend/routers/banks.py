from fastapi import APIRouter
from pydantic import BaseModel

# sqlalchemy
from sqlalchemy import select, exists
from sqlalchemy.exc import ProgrammingError, OperationalError, DatabaseError

# files
from log import logger, msg_connection_db, msg_close_db
from db.database import engine
from db.models import Banks, Users, User_bank_association
from parse_api import random_bank


router_bank = APIRouter()


class id_associate(BaseModel):
    id_user: int
    id_bank: int

# Get amount random users
class AmountBanks(BaseModel):
    amount: int


# Get id for delete from DB
class DeleteBankData(BaseModel):
    id: int


# Get data edit bank
class EditBankData(BaseModel):
    id: int
    bank_name: str
    routing_number: str
    swift_bic: str


@router_bank.post("/banks/random")      
async def add_random_banks(amount: AmountBanks):
    amount = amount.amount
    bank_data = random_bank(amount=amount)

    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            for bank_dict in bank_data:
                # Save the banks to the database
                connection.execute(Banks.__table__.insert().values(bank_dict))
                connection.commit()

            # Fetch all banks from the table after insertion
            banks_result = connection.execute(Banks.__table__.select())
            banks = banks_result.fetchall()

            # Extract bank data from the result set
            banks_data = [
                {
                    "id": bank.id,
                    "bank_name": bank.bank_name,
                    "routing_number": bank.routing_number,
                    "swift_bic": bank.swift_bic,
                }
                for bank in banks
            ]

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")

        # Set banks_data to an empty list in case of an error
        banks_data = []

    return {"banks": banks_data}


@router_bank.get("/banks/database")
async def get_banks_from_database():
    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            # Fetch all banks from the database
            banks_result = connection.execute(Banks.__table__.select())
            banks = banks_result.fetchall()

            # Extract bank data from the result set
            banks_data = [
                {
                    "id": bank.id,
                    "bank_name": bank.bank_name,
                    "routing_number": bank.routing_number,
                    "swift_bic": bank.swift_bic,
                }
                for bank in banks
            ]

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")

        # Set banks_data to an empty list in case of an error
        banks_data = []

    return {"banks": banks_data}


@router_bank.post("/banks/delete")
async def delete_bank(id_bank: DeleteBankData):
    # get bank id
    id_bank = id_bank.id

    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            # Check if there are any users associated with the bank
            users_associated = connection.execute(
                User_bank_association.__table__.select().where(User_bank_association.bank_id == id_bank)
            )
           
            result = users_associated.fetchall()
           
            if not result:
                connection.execute(Banks.__table__.delete().where(Banks.id == id_bank))
                connection.commit()

                logger.warning(f"Bank with ID {id_bank} deleted from the database")
            else:
                # Users are associated with the bank, do not delete
                return {"error": f"Cannot delete bank. Users are associated with it."}

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")


@router_bank.post("/banks/edit")
async def edit_bank(updated_data: EditBankData):
    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            # Access data from the updated_data Pydantic model
            id_bank = updated_data.id
            bank_name = updated_data.bank_name
            routing_number = updated_data.routing_number
            swift_bic = updated_data.swift_bic

            # Update the bank in the database
            connection.execute(
                Banks.__table__.update().where(Banks.id == id_bank).values(
                    bank_name=bank_name,
                    routing_number=routing_number,
                    swift_bic=swift_bic
                )
            )
            connection.commit()

            logger.info(f"Bank with ID {id_bank} updated in the database")

        logger.info(msg_close_db)
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")


@router_bank.post("/banks/associate_user")
async def associate_user(id: id_associate):
    id_user = id.id_user
    id_bank = id.id_bank


    try:
        with engine.connect() as connection:
            logger.info(msg_connection_db)

            # Insert a new row into the user_bank_association table
            connection.execute(
                User_bank_association.__table__.insert().values(user_id=id_user, bank_id=id_bank)
            )
            connection.commit()

            logger.info(f"User with ID {id_user} associated with bank ID {id_bank}")

        logger.info(msg_close_db)
    except (OperationalError, ProcessLookupError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")