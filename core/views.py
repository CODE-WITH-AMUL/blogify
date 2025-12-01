#-------------------[IMPORT MODULES]-------------------#
from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from .models import Blog_Post, Category_Types, Tag_Types, Search
from .serializers import BlogSerializer, CategorySerializer, TagSerializer, SearchSerializer


#---------------------[BLOG VIEWS]---------------------#
class BlogListView(generics.ListCreateAPIView):
    queryset = Blog_Post.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'content', 'author']

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog_Post.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'slug'


#---------------------[CATEGORY VIEWS]---------------------#
class CategoryListView(generics.ListAPIView):
    queryset = Category_Types.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category_Types.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'Category'


#---------------------[TAG VIEWS]---------------------#
class TagListView(generics.ListAPIView):
    queryset = Tag_Types.objects.all()
    serializer_class = TagSerializer

class TagDetailView(generics.RetrieveAPIView):
    queryset = Tag_Types.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'Tag'


#---------------------[SEARCH VIEWS]---------------------#
class SearchListView(generics.ListCreateAPIView):
    queryset = Search.objects.all().order_by('-searched_at')
    serializer_class = SearchSerializer
    filter_backends = [SearchFilter]
    search_fields = ['query']
