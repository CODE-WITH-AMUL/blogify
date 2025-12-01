#---------------------[IMPORT MODULES]---------------------#
from django.urls import path
from .views import (
    BlogListView, BlogDetailView,
    CategoryListView, CategoryDetailView,
    TagListView, TagDetailView,
    SearchListView
)

urlpatterns = [
    # Blog
    path('api/blogs/', BlogListView.as_view(), name='blog-list'),
    path('api/blogs/<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),

    # Category
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/categories/<str:Category>/', CategoryDetailView.as_view(), name='category-detail'),

    # Tag
    path('api/tags/', TagListView.as_view(), name='tag-list'),
    path('api/tags/<str:Tag>/', TagDetailView.as_view(), name='tag-detail'),

    # Search
    path('api/search/', SearchListView.as_view(), name='search-list'),
]
