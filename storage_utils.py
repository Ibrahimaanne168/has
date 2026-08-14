import os
import mimetypes
import time
from werkzeug.utils import secure_filename
from flask import url_for, redirect, send_file

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")).strip()
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "has-storage").strip()

_supabase_client = None

def get_supabase():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            from supabase import create_client
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            return _supabase_client
        except Exception as e:
            print(f"[Supabase Storage] Erreur initialisation client: {e}")
            return None
    return None

def is_supabase_storage_enabled():
    return bool(SUPABASE_URL and SUPABASE_KEY and get_supabase() is not None)

def upload_file(file_obj, folder="general", custom_filename=None):
    """
    Sauvegarde un fichier soit sur Supabase Storage (cloud permanent) soit en local.
    Retourne l'URL publique Supabase ou le chemin relatif local (ex: uploads/cours/nom.pdf).
    """
    if not file_obj or not getattr(file_obj, "filename", None):
        return None

    orig_filename = secure_filename(file_obj.filename)
    if not orig_filename:
        return None

    ext = os.path.splitext(orig_filename)[1].lower()

    if custom_filename:
        filename = secure_filename(custom_filename)
        if not filename.endswith(ext):
            filename += ext
    else:
        base = os.path.splitext(orig_filename)[0]
        filename = f"{base}_{int(time.time())}{ext}"

    # 1. Tentative d'upload sur Supabase Storage
    supabase = get_supabase()
    if supabase:
        try:
            file_obj.seek(0)
            file_bytes = file_obj.read()
            content_type = getattr(file_obj, "content_type", None) or mimetypes.guess_type(filename)[0] or "application/octet-stream"

            path_in_bucket = f"{folder}/{filename}".strip("/")
            
            # Upload vers le bucket Supabase
            res = supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=path_in_bucket,
                file=file_bytes,
                file_options={"content-type": content_type, "upsert": "true"}
            )

            # Obtenir l'URL publique
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(path_in_bucket)
            if public_url:
                return public_url
        except Exception as e:
            print(f"[Supabase Storage] Note: Envoi Supabase Storage ({e}), repli vers stockage local.")

    # 2. Repli Local (static/uploads/{folder}/...)
    local_dir = os.path.join("static", "uploads", folder)
    os.makedirs(local_dir, exist_ok=True)
    local_path = os.path.join(local_dir, filename)
    file_obj.seek(0)
    file_obj.save(local_path)
    return f"uploads/{folder}/{filename}"

def get_file_url(path_or_url):
    """
    Retourne l'URL complète d'un fichier pour les balises <img> ou les liens <a>.
    """
    if not path_or_url:
        return ""
    if str(path_or_url).startswith("http://") or str(path_or_url).startswith("https://"):
        return str(path_or_url)
    
    clean_path = str(path_or_url).replace("/static/", "").replace("static/", "").lstrip("/")
    try:
        return url_for("static", filename=clean_path)
    except Exception:
        return f"/static/{clean_path}"

def serve_or_redirect_file(path_or_url, download_name=None, as_attachment=False):
    """
    Sert le fichier soit par redirection CDN Supabase, soit via Flask send_file.
    """
    if not path_or_url:
        return "Fichier introuvable", 404

    if str(path_or_url).startswith("http://") or str(path_or_url).startswith("https://"):
        return redirect(str(path_or_url))

    clean_path = str(path_or_url).replace("/static/", "").replace("static/", "").lstrip("/")
    local_path = os.path.join("static", clean_path)

    if not os.path.exists(local_path):
        for sub in ["", "uploads", "uploads/cours", "uploads/photos", "uploads/edt", "uploads/communiques", "uploads/profils", "uploads/profs"]:
            alt = os.path.join("static", sub, os.path.basename(clean_path))
            if os.path.exists(alt):
                local_path = alt
                break

    if os.path.exists(local_path):
        return send_file(local_path, as_attachment=as_attachment, download_name=download_name or os.path.basename(local_path))

    return "Fichier introuvable sur le serveur", 404

def delete_file(path_or_url):
    """
    Supprime le fichier sur Supabase Storage ou sur le disque local.
    """
    if not path_or_url:
        return
    
    supabase = get_supabase()
    if supabase and (str(path_or_url).startswith("http")):
        try:
            marker = f"/{SUPABASE_BUCKET}/"
            if marker in path_or_url:
                bucket_path = path_or_url.split(marker, 1)[1]
                supabase.storage.from_(SUPABASE_BUCKET).remove([bucket_path])
                return
        except Exception as e:
            print(f"[Supabase Storage] Erreur suppression: {e}")

    # Suppression locale
    clean_path = str(path_or_url).replace("/static/", "").replace("static/", "").lstrip("/")
    local_path = os.path.join("static", clean_path)
    if os.path.exists(local_path):
        try:
            os.remove(local_path)
        except Exception as e:
            print(f"[Local Storage] Erreur suppression {local_path}: {e}")
