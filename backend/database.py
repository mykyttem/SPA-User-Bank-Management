import os
from log import logger

# sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError, OperationalError, DatabaseError
from sqlalchemy.orm import sessionmaker

# config
from config import USER, PASSWORD, HOST, DATABASE


"""
Database Initialization:
    - This file connects to the MySQL database and initializes tables
    - Set sessions for interacting with the database.
    - Logging: The script uses a custom logger from the `log` module
    - Configuration: Database connection details and other configurations are sourced from the `config` module
    - Models: imporing models for representing database tables
    - Perform database migrations with Alembic
"""

url_mysql = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}/{DATABASE}"
os.environ["DATABASE_URL"] = url_mysql

engine = create_engine(url_mysql)


try:
    # connect to the database
    with engine.connect() as connection:
        logger.info(f' Successfully connected to database "{DATABASE}"')  

        # sessions
        Session = sessionmaker(bind=engine)
        session = Session()
        
    logger.info(" connection to database close")
except (OperationalError, ProgrammingError, DatabaseError) as e:
    logger.error(f" Connection failed. Error: {e}")