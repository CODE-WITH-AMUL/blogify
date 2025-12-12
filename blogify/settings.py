#====================[IMPORT MODULES]====================#
import os
from pathlib import Path
import environ

#====================[FILE DIRECTORY]====================#
BASE_DIR = Path(__file__).resolve().parent.parent

#====================[INITIALIZE ENVIRONMENT]====================#
env = environ.Env(
    DEBUG=(bool, False),
)

# Load .env file for local development
if os.path.exists(os.path.join(BASE_DIR, '.env')):
    environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

#====================[SECURITY SETTINGS]====================#
SECRET_KEY = os.environ.get('DJANGO_KEY', 'django-insecure-dev-key-for-local')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'  # Default to True for local

# Parse ALLOWED_HOSTS from environment variable
allowed_hosts = os.environ.get('ALLOWED_HOSTS', '')
if allowed_hosts:
    # Handle different formats: comma-separated or JSON
    if allowed_hosts.startswith('[') and allowed_hosts.endswith(']'):
        # JSON array format
        import json
        try:
            ALLOWED_HOSTS = json.loads(allowed_hosts)
        except json.JSONDecodeError:
            # Fallback to comma-separated
            ALLOWED_HOSTS = [host.strip() for host in allowed_hosts.strip('[]').split(',') if host.strip()]
    else:
        # Comma-separated format
        ALLOWED_HOSTS = [host.strip() for host in allowed_hosts.split(',') if host.strip()]
else:
    ALLOWED_HOSTS = [
        '127.0.0.1',
        'localhost',
        'codewithamul-blogify.onrender.com',
        'www.amulsharma.com.np',
        'amulsharma.com.np',
    ]

# Add Render external hostname if present
if 'RENDER_EXTERNAL_HOSTNAME' in os.environ:
    if os.environ['RENDER_EXTERNAL_HOSTNAME'] not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(os.environ['RENDER_EXTERNAL_HOSTNAME'])

# Security settings for production only
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

#====================[APPLICATION CONFIG]====================#
INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Third-party apps
    "ckeditor",
    "ckeditor_uploader",
    "rest_framework",
    "corsheaders",
    "django_filters",
    
    # Local apps
    "core",
]

CKEDITOR_BASEPATH = "/static/ckeditor/ckeditor/"

#====================[MIDDLEWARE]====================#
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "blogify.urls"

#====================[TEMPLATES CONFIG]====================#
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.media",
            ],
        },
    },
]

WSGI_APPLICATION = "blogify.wsgi.application"

#====================[DATABASE CONFIGURATION]====================#
# Use DATABASE_URL if available (Render provides this), otherwise use sqlite
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3'),
            "NAME": os.environ.get('DB_NAME', os.path.join(BASE_DIR, "db.sqlite3")),
            "USER": os.environ.get('DB_USER', ''),
            "PASSWORD": os.environ.get('DB_PASSWORD', ''),
            "HOST": os.environ.get('DB_HOST', ''),
            "PORT": os.environ.get('DB_PORT', ''),
        }
    }

#====================[AUTH PASSWORD VALIDATORS]====================#
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

#====================[INTERNATIONALIZATION]====================#
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

#====================[STATIC & MEDIA FILES]====================#
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Create static directory if it doesn't exist
static_dir = BASE_DIR / "static"
if not static_dir.exists():
    static_dir.mkdir(parents=True, exist_ok=True)
STATICFILES_DIRS = [static_dir]

# Media files configuration
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Create media directory if it doesn't exist
media_dir = BASE_DIR / "media"
if not media_dir.exists():
    media_dir.mkdir(parents=True, exist_ok=True)

# WhiteNoise configuration
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

#====================[CORS CONFIGURATION]====================#
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Allow all in development
CORS_ALLOW_CREDENTIALS = True

# Parse CORS_ALLOWED_ORIGINS from environment
cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if cors_origins:
    if cors_origins.startswith('[') and cors_origins.endswith(']'):
        # JSON array format
        import json
        try:
            # Clean the string - remove any stray quotes
            cleaned = cors_origins.strip().strip('[]')
            if cleaned:
                # Split by comma and clean each item
                items = [item.strip().strip('"\'') for item in cleaned.split(',') if item.strip()]
                CORS_ALLOWED_ORIGINS = [item for item in items if item]
            else:
                CORS_ALLOWED_ORIGINS = []
        except:
            # Fallback to manual parsing
            cleaned = cors_origins.strip().strip('[]').replace('"', '').replace("'", "")
            items = [item.strip() for item in cleaned.split(',') if item.strip()]
            CORS_ALLOWED_ORIGINS = [item for item in items if item]
    else:
        # Comma-separated format
        CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]
else:
    # Default for local development
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://www.amulsharma.com.np",
        "https://amulsharma.com.np",
        "https://codewithamul-blogify.onrender.com",
    ]

# Parse CSRF_TRUSTED_ORIGINS
csrf_origins = os.environ.get('CSRF_TRUSTED_ORIGINS', '')
if csrf_origins:
    if csrf_origins.startswith('[') and csrf_origins.endswith(']'):
        # JSON array format
        import json
        try:
            cleaned = csrf_origins.strip().strip('[]')
            if cleaned:
                items = [item.strip().strip('"\'') for item in cleaned.split(',') if item.strip()]
                CSRF_TRUSTED_ORIGINS = [item for item in items if item]
            else:
                CSRF_TRUSTED_ORIGINS = []
        except:
            cleaned = csrf_origins.strip().strip('[]').replace('"', '').replace("'", "")
            items = [item.strip() for item in cleaned.split(',') if item.strip()]
            CSRF_TRUSTED_ORIGINS = [item for item in items if item]
    else:
        CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_origins.split(',') if origin.strip()]
else:
    CSRF_TRUSTED_ORIGINS = [
        "https://codewithamul-blogify.onrender.com",
        "https://www.amulsharma.com.np",
        "https://amulsharma.com.np",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

#====================[REST FRAMEWORK CONFIG]====================#
REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}

#====================[CKEDITOR CONFIG]====================#
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_IMAGE_BACKEND = "pillow"
CKEDITOR_ALLOW_NONIMAGE_FILES = False
CKEDITOR_CONFIGS = {
    "default": {
        "toolbar": "full",
        "height": 400,
        "width": "100%",
        "extraPlugins": ",".join([
            "uploadimage",
            "div",
            "autolink",
            "autoembed",
            "embedsemantic",
            "autogrow",
            "widget",
            "lineutils",
            "clipboard",
            "dialog",
            "dialogui",
            "elementspath"
        ]),
        "skin": "moono-lisa",
        "filebrowserUploadUrl": "/ckeditor/upload/",
        "filebrowserImageUploadUrl": "/ckeditor/upload/",
        "removePlugins": "stylesheetparser",
        "extraAllowedContent": "iframe[*]",
    }
}

#====================[DEFAULT PRIMARY KEY]====================#
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

#====================[JAZZMIN ADMIN PANEL CONFIG]====================#
JAZZMIN_SETTINGS = {
    "site_title": "BlogSphere Admin",
    "site_header": "BlogSphere Dashboard",
    "site_brand": "BlogSphere",
    "site_logo": None,
    "welcome_sign": "Welcome to BlogSphere Admin Panel",
    "copyright": "© 2024 BlogSphere. All Rights Reserved.",
    "show_sidebar": True,
    "navigation_expanded": True,
    "show_search_bar": True,
    "related_modal_active": True,
    "modal_close_button": True,
    "modal_submit_button": True,
    "topmenu_links": [
        {"name": "Dashboard", "url": "admin:index", "permissions": ["auth.view_user"], "icon": "fas fa-tachometer-alt"},
        {"name": "Live Site", "url": "/", "new_window": True, "icon": "fas fa-external-link-alt"},
        {"name": "API Docs", "url": "/api/", "new_window": True, "icon": "fas fa-book"},
    ],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "core.Post": "fas fa-newspaper",
        "core.Category": "fas fa-folder",
        "core.Tag": "fas fa-tags",
        "core.Comment": "fas fa-comments",
    },
}

JAZZMIN_UI_TWEAKS = {
    "theme": "darkly",
    "dark_mode_theme": "darkly",
}

#====================[LOGGING CONFIGURATION]====================#
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# Print debug info when DEBUG is True
if DEBUG:
    print(f"DEBUG Mode: {DEBUG}")
    print(f"ALLOWED_HOSTS: {ALLOWED_HOSTS}")
    print(f"CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}")
    print(f"CSRF_TRUSTED_ORIGINS: {CSRF_TRUSTED_ORIGINS}")