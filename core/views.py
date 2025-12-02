from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q
from .models import Post
from .serializers import PostSerializer

class PostList(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.filter(published=True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(categories__slug=category)
        return queryset.distinct()

class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.filter(published=True)
    serializer_class = PostSerializer
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class SearchView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        category = self.request.query_params.get('category', '')
        tag = self.request.query_params.get('tag', '')
        queryset = Post.objects.filter(published=True)
        if query:
            q_objects = Q(title__icontains=query) | Q(content__icontains=query)
            if category:
                for cat in category.split(','):
                    q_objects |= Q(categories__name__icontains=cat.strip())
            if tag:
                for t in tag.split(','):
                    q_objects |= Q(tags__name__icontains=t.strip())
            queryset = queryset.filter(q_objects)
        return queryset.distinct().order_by('-created_date')

class FeaturedPostsView(generics.ListAPIView):  # New: Featured posts
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(published=True, is_featured=True).order_by('-created_date')[:5]  # Top 5 featured