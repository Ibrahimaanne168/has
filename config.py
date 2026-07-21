import os
from urllib.parse import urlparse
from dotenv import load_dotenv
import mysql.connector

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-cette-cle-en-production')

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'mysql+pymysql://root:password@localhost/has'
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
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('MYSQL_URL')

    if database_url:
        parsed = urlparse(database_url)
        return {
            'host': parsed.hostname or os.environ.get('DB_HOST', 'localhost'),
            'port': int(parsed.port or os.environ.get('DB_PORT', 3306)),
            'user': parsed.username or os.environ.get('DB_USER', 'root'),
            'password': parsed.password or os.environ.get('DB_PASSWORD', ''),
            'database': parsed.path.lstrip('/') or os.environ.get('DB_NAME', 'has_platform'),
        }

    return {
        'host': os.environ.get('DB_HOST', 'localhost'),
        'port': int(os.environ.get('DB_PORT', 3306)),
        'user': os.environ.get('DB_USER', 'root'),
        'password': os.environ.get('DB_PASSWORD', ''),
        'database': os.environ.get('DB_NAME', 'has_platform'),
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
