from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# tables
class Users(Base):
    __tablename__ = "users"

    id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True)

    first_name = Column("first_name", String(20))
    last_name = Column("last_name", String(20))

    username = Column("username", String(20))
    email = Column("email", String(25), unique=True)
    password = Column("password", String(60), nullable=False)


class Banks(Base):
    __tablename__ = "bank"

    id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True)
    
    bank_name = Column("bank_name", String(20))
    routing_number = Column("routing_number", String(20))
    swift_bic = Column("swift_bic", String(20))