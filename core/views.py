# blogs/views.py (Updated Version)

from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count # Import Count for annotations

from .models import Blog_Post, Category_Types, Tag_Types, Search
from .serializers import (
    BlogPostSerializer, 
    CategoryListSerializer, # Use list serializer
    TagListSerializer,      # Use list serializer
    SearchSerializer
)

#---------------------[BLOG VIEWS]---------------------#
class BlogListView(generics.ListCreateAPIView):
    queryset = Blog_Post.objects.all().select_related('category').prefetch_related('tag')
    serializer_class = BlogPostSerializer
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'content', 'author']
    filterset_fields = {
        'featured_article': ['exact'],
        'category__Category': ['exact', 'icontains'],
    }
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

# You can split BlogListView into separate views for featured/recent if preferred:
# class FeaturedPostListView(generics.ListAPIView):
#     queryset = Blog_Post.objects.filter(featured_article=True).select_related('category')[:3]
#     serializer_class = BlogPostSerializer

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog_Post.objects.all().select_related('category').prefetch_related('tag')
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'


#---------------------[CATEGORY VIEWS]---------------------#
class CategoryListView(generics.ListAPIView):
    # Annotate to add 'post_count' field, which the serializer uses
    queryset = Category_Types.objects.annotate(
        post_count=Count('blog_posts_category')
    ).order_by('-post_count')
    serializer_class = CategoryListSerializer

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category_Types.objects.all()
    serializer_class = CategoryListSerializer # Can use List serializer here too
    lookup_field = 'Category'


#---------------------[TAG VIEWS]---------------------#
class TagListView(generics.ListAPIView):
    queryset = Tag_Types.objects.all()
    serializer_class = TagListSerializer

class TagDetailView(generics.RetrieveAPIView):
    queryset = Tag_Types.objects.all()
    serializer_class = TagListSerializer
    lookup_field = 'Tag'


#---------------------[SEARCH VIEWS]---------------------#
class SearchListView(generics.ListCreateAPIView):
    queryset = Search.objects.all()
    serializer_class = SearchSerializer
    # This view tracks searches, not for actual blog post searching