from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

connection_string = "mysql+pymysql://root:root123123@localhost/torim?charset=utf8mb4"
engine = create_engine(connection_string)
Session = sessionmaker(bind=engine)
