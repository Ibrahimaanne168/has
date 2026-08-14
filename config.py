import os
import re
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-cette-cle-en-production')

    # Base de données PostgreSQL (Supabase) ou MySQL
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # Upload
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 32 * 1024 * 1024  # 32 Mo

    # Supabase Cloud Storage
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY', os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))
    SUPABASE_BUCKET = os.environ.get('SUPABASE_BUCKET', 'has-storage')

    # Mail (pour "mot de passe oublié")
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in {'1', 'true', 'yes', 'on'}
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')


class PostgresCursorWrapper:
    def __init__(self, cursor, conn):
        self._cursor = cursor
        self._conn = conn
        self._lastrowid = None

    @property
    def lastrowid(self):
        return self._lastrowid

    @property
    def description(self):
        return self._cursor.description

    @property
    def rowcount(self):
        return self._cursor.rowcount

    def execute(self, query, params=None):
        clean_q = query.strip()
        is_insert = clean_q.upper().startswith("INSERT INTO")
        
        # Si c'est un INSERT et qu'il n'y a pas déjà de clause RETURNING, on ajoute RETURNING id pour récupérer lastrowid
        if is_insert and "RETURNING" not in clean_q.upper():
            modified_query = clean_q.rstrip(";") + " RETURNING id"
            try:
                if params is not None:
                    self._cursor.execute(modified_query, params)
                else:
                    self._cursor.execute(modified_query)
                row = self._cursor.fetchone()
                if row:
                    if isinstance(row, dict):
                        self._lastrowid = row.get('id')
                    else:
                        self._lastrowid = row[0]
                return self
            except Exception:
                # Si la table n'a pas de colonne id, on rejoue la requête d'origine
                self._conn.rollback()
                pass
        
        if params is not None:
            self._cursor.execute(query, params)
        else:
            self._cursor.execute(query)
        return self

    def executemany(self, query, params_list):
        return self._cursor.executemany(query, params_list)

    def fetchone(self):
        return self._cursor.fetchone()

    def fetchall(self):
        return self._cursor.fetchall()

    def fetchmany(self, size=None):
        return self._cursor.fetchmany(size)

    def close(self):
        self._cursor.close()

    def __iter__(self):
        return iter(self._cursor)


class PostgresConnectionWrapper:
    def __init__(self, conn):
        self._conn = conn

    def cursor(self, dictionary=False):
        if dictionary:
            import psycopg2.extras
            cur = self._conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        else:
            cur = self._conn.cursor()
        return PostgresCursorWrapper(cur, self._conn)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

    @property
    def autocommit(self):
        return self._conn.autocommit

    @autocommit.setter
    def autocommit(self, val):
        self._conn.autocommit = val


def get_db():
    """
    Retourne une connexion à la base de données :
    - Supabase / PostgreSQL si DATABASE_URL ou SUPABASE_DB_URL est défini
    - MySQL en cas de variables MySQL ou fallback local
    """
    db_url = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL")
    
    if db_url:
        import psycopg2
        # Normaliser postgres:// -> postgresql:// si nécessaire (format Render/Supabase)
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        
        conn = psycopg2.connect(db_url, sslmode=os.environ.get("PGSSLMODE", "require"))
        conn.autocommit = True
        return PostgresConnectionWrapper(conn)
    
    # Fallback MySQL
    import mysql.connector
    return mysql.connector.connect(
        host=os.environ.get('MYSQLHOST', 'localhost'),
        port=int(os.environ.get('MYSQLPORT', 3306)),
        user=os.environ.get('MYSQLUSER', 'root'),
        password=os.environ.get('MYSQLPASSWORD', ''),
        database=os.environ.get('MYSQLDATABASE', 'has_platform'),
        autocommit=True,
    )
