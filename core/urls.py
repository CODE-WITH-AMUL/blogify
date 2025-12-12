from django.urls import path
from .views import PostList, PostDetail, SearchView, FeaturedPostsView, CategoryList

urlpatterns = [
    path('api/posts/', PostList.as_view(), name='post_list'),
    path('api/posts/<slug:slug>/', PostDetail.as_view(), name='post_detail'),
    path('api/categories/', CategoryList.as_view(), name='category_list'),
    path('api/search/', SearchView.as_view(), name='search'),
    path('api/featured-posts/', FeaturedPostsView.as_view(), name='featured_posts'),  # New
]