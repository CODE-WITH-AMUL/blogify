from rest_framework import serializers
from .models import Post, Category, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    categories = CategorySerializer(many=True)
    tags = TagSerializer(many=True)
    featured_image = serializers.ImageField(use_url=True, required=False)
    thumbnail = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = Post
        fields = '__all__'