#-------------------[IMPORT MODULES]-------------------#
import os
from pathlib import Path
import environ

#-------------------[FILE DIR]-------------------#
BASE_DIR = Path(__file__).resolve().parent.parent

#-------------------[INITIALIZE ENV]-------------------#
env = environ.Env()

# Load the .env file (must come AFTER env initialization)
environ.Env.read_env(BASE_DIR / '.env')  # optional: specify full path

#-------------------[SECURITY KEY]-------------------#
SECRET_KEY = env('DJANGO_KEY')
# DEBUG = env('DEBUG')
DEBUG=env('DEBUG_KEY')



#-------------------[HOSTING SITES]-------------------#
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'localhost:8000', '*']


#-------------------[APPLICATION CONFIG]-------------------#
INSTALLED_APPS = [
    'jazzmin',
    # ... other apps
    'ckeditor',  # Add CKEditor
    'ckeditor_uploader',  # For file uploads
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]



EXTRA_APPS = [
    'core',
    'rest_framework',
    'corsheaders', 
]


INSTALLED_APPS += EXTRA_APPS


#-------------------[CROSS SITES]-------------------#
CORS_ALLOWED_ORIGINS = env.list(
    'CORS_ALLOWED_ORIGINS_KEY'
)

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True


#-------------------[MIDDLEWARE MODULES]-------------------#

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORS first
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]




#-------------------[REST APIS ]-------------------#



ROOT_URLCONF = 'blogify.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'blogify.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


#-------------------[REST FRAMEWORK CONFIG]-------------------#
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}


#-----------------------[ADMIN UI]--------------------------#
JAZZMIN_SETTINGS = {
    # =============================================
    # SITE CONFIGURATION
    # =============================================
    "site_title": "BlogSphere Admin",  # Admin panel title
    "site_header": "BlogSphere Dashboard",  # Login screen title
    "site_brand": "BlogSphere",  # Brand name in admin panel
    "site_logo": "admin/img/logo.svg",  # Path to your logo
    "site_logo_classes": "img-fluid",  # CSS classes for logo
    "site_icon": "admin/img/favicon.png",  # Favicon path
    
    # Welcome message on login screen
    "welcome_sign": "Welcome to BlogSphere Admin Panel",
    
    # Copyright information
    "copyright": "© 2024 BlogSphere. All Rights Reserved.",
    
    # Field for user avatar
    "user_avatar": "profile_picture",

    # =============================================
    # THEME & UI CUSTOMIZATION
    # =============================================
    # Theme options: light, dark, default, primary, secondary, success, info, warning, danger
    "theme": "dark",  # Professional dark theme for admin panel
    
    # Dark mode by default
    "dark_mode_theme": True,
    
    # Button theming
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary btn-outline",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    },

    # =============================================
    # LAYOUT & NAVIGATION
    # =============================================
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    
    # Order apps in sidebar
    "order_with_respect_to": [
        "auth",
        "blog",
        "blog.Post",
        "blog.Category",
        "blog.Tag",
        "blog.Comment",
        "accounts",
        "pages",
        "analytics"
    ],

    # =============================================
    # TOP MENU CONFIGURATION
    # =============================================
    "topmenu_links": [
        # Dashboard link
        {"name": "Dashboard", "url": "admin:index", "permissions": ["auth.view_user"], "icon": "fas fa-tachometer-alt"},
        
        # External links
        {"name": "Live Site", "url": "/", "new_window": True, "icon": "fas fa-external-link-alt"},
        {"name": "Support", "url": "https://github.com/farridav/django-jazzmin/issues", "new_window": True, "icon": "fas fa-question-circle"},
        
        # App dropdowns
        {"app": "blog"},
        {"app": "auth"},
        {"model": "analytics.Visitor"},
    ],

    # =============================================
    # USER MENU CONFIGURATION
    # =============================================
    "usermenu_links": [
        {"name": "Profile", "url": "admin:auth_user_change", "args": [1], "icon": "fas fa-user-edit"},
        {"name": "Settings", "url": "admin:auth_user_changelist", "icon": "fas fa-cog"},
        {"name": "View Site", "url": "/", "new_window": True, "icon": "fas fa-eye"},
        {"model": "auth.user", "icon": "fas fa-users"},
    ],

    # =============================================
    # SIDEBAR MENU ICONS
    # =============================================
    "icons": {
        # Auth app icons
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        
        # Blog app icons
        "blog": "fas fa-blog",
        "blog.Post": "fas fa-newspaper",
        "blog.Category": "fas fa-folder",
        "blog.Tag": "fas fa-tags",
        "blog.Comment": "fas fa-comments",
        "blog.Author": "fas fa-user-edit",
        
        # Analytics icons
        "analytics": "fas fa-chart-line",
        "analytics.Visitor": "fas fa-chart-bar",
        "analytics.PageView": "fas fa-eye",
        
        # Media icons
        "media": "fas fa-images",
        
        # Pages icons
        "pages": "fas fa-file-alt",
        "pages.Page": "fas fa-file",
        
        # Settings icons
        "sites": "fas fa-globe",
    },
    
    "default_icon_parents": "fas fa-chevron-right",
    "default_icon_children": "fas fa-circle",

    # =============================================
    # CUSTOM LINKS IN SIDEBAR
    # =============================================
    "custom_links": {
        "blog": [{
            "name": "Create Post", 
            "url": "admin:blog_post_add", 
            "icon": "fas fa-plus-circle",
            "permissions": ["blog.add_post"]
        }, {
            "name": "View Published", 
            "url": "admin:blog_post_changelist?status__exact=published", 
            "icon": "fas fa-check-circle",
            "permissions": ["blog.view_post"]
        }, {
            "name": "Pending Review", 
            "url": "admin:blog_post_changelist?status__exact=draft", 
            "icon": "fas fa-clock",
            "permissions": ["blog.view_post"]
        }],
        
        "analytics": [{
            "name": "Dashboard", 
            "url": "admin:analytics_dashboard", 
            "icon": "fas fa-chart-pie",
            "permissions": ["analytics.view_analytics"]
        }],
    },

    # =============================================
    # SEARCH & FILTERS
    # =============================================
    "search_model": ["blog.Post", "blog.Category", "auth.User", "blog.Comment"],
    
    # Show search bar in navbar
    "show_search_bar": True,

    # =============================================
    # UI/UX ENHANCEMENTS
    # =============================================
    # Form display formats
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs",
        "blog.Post": "collapsible",
    },
    
    # Use modals for related forms (cleaner UI)
    "related_modal_active": True,
    
    # Modal settings
    "modal_close_button": True,
    "modal_submit_button": True,
    
    # =============================================
    # MULTI-LANGUAGE SUPPORT
    # =============================================
    "language_chooser": True,
    
    # Available languages
    "languages": {
        "en": "English",
        "fr": "French",
        "es": "Spanish",
        "de": "German",
    },

    # =============================================
    # CUSTOM CSS & JS
    # =============================================
    "custom_css": "scr/staic/admin/css/custom_admin.css",
    "custom_js": "scr/static/admin/js/custom_admin.js",
    
    # Google Fonts
    "use_google_fonts_cdn": True,
    
    # Font family
    "font_family": "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    
    # Font size
    "font_size": "14px",

    # =============================================
    # UI CUSTOMIZER
    # =============================================
    "show_ui_builder": True,  # Allow admins to customize UI

    # =============================================
    # PERFORMANCE OPTIMIZATIONS
    # =============================================
    "actions_sticky_top": True,  # Keep action buttons visible
    
    # List per page
    "list_per_page": 25,
    
    # List max show all
    "list_max_show_all": 100,

    # =============================================
    # NOTIFICATIONS & ALERTS
    # =============================================
    "show_messages": True,
    
    # Alert styles
    "alert_styles": {
        "success": "alert-success",
        "info": "alert-info",
        "warning": "alert-warning",
        "danger": "alert-danger",
        "primary": "alert-primary",
        "secondary": "alert-secondary",
        "light": "alert-light",
        "dark": "alert-dark"
    },

    # =============================================
    # BREADCRUMBS
    # =============================================
    "show_breadcrumbs": True,
    "breadcrumb_separator": "›",

    # =============================================
    # FOOTER LINKS
    # =============================================
    "footer_links": [
        {"name": "Documentation", "url": "https://docs.example.com", "new_window": True},
        {"name": "API Docs", "url": "https://api.example.com", "new_window": True},
        {"name": "GitHub", "url": "https://github.com/example/blogsphere", "new_window": True},
    ],

    # =============================================
    # ADVANCED SETTINGS
    # =============================================
    # Custom templates
    "custom_templates": {
        "admin/base_site.html": "admin/base_site.html",
        "admin/index.html": "admin/index.html",
    },
    
    # Timezone
    "timezone": "UTC",
    
    # Date format
    "date_format": "Y-m-d",
    
    # Time format
    "time_format": "H:i",
    
    # Datetime format
    "datetime_format": "Y-m-d H:i",
    
    # Decimal separator
    "decimal_separator": ".",
    
    # Thousand separator
    "thousand_separator": ",",
    
    # Currency
    "currency": "USD",
    
    # Currency format
    "currency_format": "${amount}",
}

# =============================================
# JAZZMIN UI TWEAKS CONFIGURATION
# =============================================
JAZZMIN_UI_TWEAKS = {
    # Theme variations
    "theme": "darkly",  # You can also use: flatly, darkly, slate, superhero, etc.
    
    # Navbar
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    
    # Brand colors
    "brand_colour": "navbar-dark",
    "accent": "accent-primary",
    
    # Navbar style
    "navbar": "navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    
    # Footer
    "footer_fixed": False,
    
    # Sidebar
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    
    # Main content
    "main_header_fixed": True,
    
    # Dark sidebar theme
    "dark_mode_theme": "darkly",
}

# =============================================
# ADDITIONAL CUSTOMIZATIONS FOR BLOG SPECIFIC
# =============================================
JAZZMIN_SETTINGS.update({
    # Quick actions in dashboard
    "dashboard_quick_actions": [
        {"name": "New Post", "url": "admin:blog_post_add", "icon": "fas fa-plus", "permissions": ["blog.add_post"]},
        {"name": "View Comments", "url": "admin:blog_comment_changelist", "icon": "fas fa-comments", "permissions": ["blog.view_comment"]},
        {"name": "Analytics", "url": "admin:analytics_dashboard", "icon": "fas fa-chart-line", "permissions": ["analytics.view_analytics"]},
        {"name": "Media Library", "url": "admin:media_changelist", "icon": "fas fa-images", "permissions": ["media.view_media"]},
    ],
    
    # Recent actions
    "recent_actions": {
        "max": 10,
        "model_whitelist": ["blog.Post", "blog.Comment", "auth.User"]
    },
    
    # Stats cards in dashboard
    "dashboard_stats": [
        {
            "name": "Total Posts",
            "value": "post_count",  # This should be calculated in your view
            "icon": "fas fa-newspaper",
            "color": "primary",
            "url": "admin:blog_post_changelist"
        },
        {
            "name": "Published",
            "value": "published_count",
            "icon": "fas fa-check-circle",
            "color": "success",
            "url": "admin:blog_post_changelist?status__exact=published"
        },
        {
            "name": "Comments",
            "value": "comment_count",
            "icon": "fas fa-comments",
            "color": "info",
            "url": "admin:blog_comment_changelist"
        },
        {
            "name": "Users",
            "value": "user_count",
            "icon": "fas fa-users",
            "color": "warning",
            "url": "admin:auth_user_changelist"
        },
    ],
})

# =============================================
# ADMIN SITE HEADER CONFIGURATION
# =============================================
ADMIN_SITE_HEADER = "BlogSphere Administration"
ADMIN_SITE_TITLE = "BlogSphere Admin"
ADMIN_INDEX_TITLE = "Dashboard Overview"



# CKEditor Configuration
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 400,
        'width': '100%',
        'extraPlugins': ','.join([
            'codesnippet',
            'widget',
            'dialog',
        ]),
        'skin': 'moono-lisa',
        'toolbar_Custom': [
            ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
            ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'],
            ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
            '/',
            ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
             'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl',
             'Language'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'],
            '/',
            ['Styles', 'Format', 'Font', 'FontSize'],
            ['TextColor', 'BGColor'],
            ['Maximize', 'ShowBlocks'],
            ['About']
        ],
    },
    'word_like': {
        'skin': 'office2013',
        'toolbar': [
            ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
            ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'],
            ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
            '/',
            ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
             'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl',
             'Language'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'],
            '/',
            ['Styles', 'Format', 'Font', 'FontSize'],
            ['TextColor', 'BGColor'],
            ['Maximize', 'ShowBlocks'],
            ['About']
        ],
        'height': 500,
        'width': '100%',
        'filebrowserUploadUrl': '/ckeditor/upload/',
        'filebrowserBrowseUrl': '/ckeditor/browse/',
    }
}