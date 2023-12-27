# sqlalchemy
from sqlalchemy import create_engine

# config
from config import USER, PASSWORD, HOST, DATABASE


"""
Database Initialization:
    - This file connects to the MySQL database and initializes tables
    - Configuration: Database connection details and other configurations are sourced from the `config` module
    - Perform database migrations with Alembic
"""

url_mysql = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}/{DATABASE}"
engine = create_engine(url_mysql)