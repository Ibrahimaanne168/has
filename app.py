import os
from dotenv import load_dotenv
from flask import Flask
from datetime import timedelta
from config import Config

load_dotenv()

from routes.public import public
from routes.admin import admin
from routes.professeur import professeur
from routes.etudiant import etudiant

from storage_utils import get_file_url

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config.get('SECRET_KEY', 'change-moi-en-production')
app.permanent_session_lifetime = timedelta(days=7)

# Enregistrement du helper Jinja2 pour les médias et fichiers (Supabase / Local)
app.jinja_env.filters['file_url'] = get_file_url
app.jinja_env.globals['file_url'] = get_file_url

@app.context_processor
def inject_media_helpers():
    return dict(file_url=get_file_url)

app.register_blueprint(public)
app.register_blueprint(admin)
app.register_blueprint(professeur)
app.register_blueprint(etudiant)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)