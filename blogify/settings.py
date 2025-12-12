#====================[IMPORT MODULES]====================#
import os
from pathlib import Path
import environ

#====================[FILE DIRECTORY]====================#
BASE_DIR = Path(__file__).resolve().parent.parent

#====================[INITIALIZE ENVIRONMENT]====================#
env = environ.Env(
    # Set default values for local development
    DEBUG=(bool, False)
)

# Load .env file
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

#====================[SECURITY SETTINGS]====================#
SECRET_KEY = env("DJANGO_KEY", default="unsafe-default-key-for-dev")
DEBUG = env.bool("DEBUG_KEY", default=False)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[
    "127.0.0.1",
    "localhost",
    "amulsharma.com.np",
    "www.amulsharma.com.np"
])

#====================[APPLICATION CONFIG]====================#
INSTALLED_APPS = [
    "jazzmin",
    "ckeditor",
    "ckeditor_uploader",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Extra apps
    "core",
    "rest_framework",
    "corsheaders",
]

#====================[MIDDLEWARE]====================#
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must be first
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "blogify.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "blogify.wsgi.application"

#====================[DATABASE CONFIGURATION]====================#
DATABASES = {
    "default": {
        "ENGINE": env("DB_ENGINE", default="django.db.backends.sqlite3"),
        "NAME": env("DB_NAME", default=os.path.join(BASE_DIR, "db.sqlite3")),
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

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

#====================[CORS CONFIGURATION]====================#
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])

#====================[REST FRAMEWORK]====================#
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
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}

#====================[CKEDITOR CONFIG]====================#
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_IMAGE_BACKEND = "pillow"
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
    }
}

#====================[DEFAULT PRIMARY KEY]====================#
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

#====================[JAZZMIN ADMIN PANEL CONFIG]====================#
JAZZMIN_SETTINGS = {
    "site_title": "BlogSphere Admin",
    "site_header": "BlogSphere Dashboard",
    "site_brand": "BlogSphere",
    "site_logo": "admin/img/logo.svg",
    "welcome_sign": "Welcome to BlogSphere Admin Panel",
    "copyright": "© 2024 BlogSphere. All Rights Reserved.",
    "theme": "dark",
    "show_sidebar": True,
    "navigation_expanded": True,
    "show_search_bar": True,
    "related_modal_active": True,
    "modal_close_button": True,
    "modal_submit_button": True,
    "topmenu_links": [
        {"name": "Dashboard", "url": "admin:index", "permissions": ["auth.view_user"], "icon": "fas fa-tachometer-alt"},
        {"name": "Live Site", "url": "/", "new_window": True, "icon": "fas fa-external-link-alt"},
        {"name": "Support", "url": "https://github.com/farridav/django-jazzmin/issues", "new_window": True, "icon": "fas fa-question-circle"},
        {"app": "blog"},
        {"app": "auth"},
    ],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "blog": "fas fa-blog",
        "blog.Post": "fas fa-newspaper",
        "blog.Category": "fas fa-folder",
        "blog.Tag": "fas fa-tags",
        "blog.Comment": "fas fa-comments",
    },
    "dashboard_quick_actions": [
        {"name": "New Post", "url": "admin:blog_post_add", "icon": "fas fa-plus", "permissions": ["blog.add_post"]},
        {"name": "View Comments", "url": "admin:blog_comment_changelist", "icon": "fas fa-comments", "permissions": ["blog.view_comment"]},
    ],
    "recent_actions": {"max": 10, "model_whitelist": ["blog.Post", "blog.Comment", "auth.User"]},
}

