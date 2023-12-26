from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

user_bank_association = Table(
    'user_bank_association',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('bank_id', Integer, ForeignKey('banks.id'))
)

# tables
class Users(Base):
    __tablename__ = "users"

    id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True)

    first_name = Column("first_name", String(20))
    last_name = Column("last_name", String(20))

    username = Column("username", String(20))
    email = Column("email", String(25), unique=True)
    password = Column("password", String(60), nullable=False)

    # Establish a many-to-many relationship
    banks = relationship("Banks", secondary=user_bank_association, back_populates="users")


class Banks(Base):
    __tablename__ = "banks"

    id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True)
    
    bank_name = Column("bank_name", String(20))
    routing_number = Column("routing_number", String(20))
    swift_bic = Column("swift_bic", String(20))

    # Establish a many-to-many relationship
    users = relationship("Users", secondary=user_bank_association, back_populates="banks")