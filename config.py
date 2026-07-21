import os
from urllib.parse import urlparse
from dotenv import load_dotenv
import mysql.connector

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-cette-cle-en-production')

    SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{os.environ.get('MYSQLUSER')}:"
    f"{os.environ.get('MYSQLPASSWORD')}@"
    f"{os.environ.get('MYSQLHOST')}:"
    f"{os.environ.get('MYSQLPORT')}/"
    f"{os.environ.get('MYSQLDATABASE')}"
)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Upload
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 Mo

    # Mail (pour "mot de passe oublié")
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in {'1', 'true', 'yes', 'on'}
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

def _database_connection_params():
    return {
        'host': os.environ.get('MYSQLHOST'),
        'port': int(os.environ.get('MYSQLPORT', 3306)),
        'user': os.environ.get('MYSQLUSER'),
        'password': os.environ.get('MYSQLPASSWORD'),
        'database': os.environ.get('MYSQLDATABASE'),
    }


def get_db():
    params = _database_connection_params()
    return mysql.connector.connect(
        host=params['host'],
        port=int(params['port']),
        user=params['user'],
        password=params['password'],
        database=params['database'],
        autocommit=True,
    )
