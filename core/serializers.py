# blogs/serializers.py (Updated Version)

from rest_framework import serializers
from django.db.models import Count
from .models import Blog_Post, Category_Types, Tag_Types, Search

#-------------------[CATEGORY SERIALIZER - NESTED]-------------------#
# Used inside BlogPostSerializer to display category details
class CategoryTypesNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category_Types
        fields = ['Category']
    
    def to_representation(self, instance):
        return {'Category': instance.Category} 

#-------------------[TAG SERIALIZER - NESTED]-------------------#
# Used inside BlogPostSerializer to display tag details
class TagTypesNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag_Types
        fields = ['Tag']
    
    def to_representation(self, instance):
        return instance.Tag 

#---------------------[BLOG POST SERIALIZER]-------------------#
class BlogPostSerializer(serializers.ModelSerializer):
    # Use the nested serializers for clean relationship display
    category = CategoryTypesNestedSerializer() 
    tag = TagTypesNestedSerializer(many=True) 
    
    # You can add a URL field for the image if using DRF for image serving
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Blog_Post
        fields = [
            'id', 'title', 'content', 'author', 'slug', 'created_at', 
            'category', 'tag', 'featured_article', 'image', 'image_url'
        ]
        # You can add 'read_only_fields = ('created_at', 'updated_at',)' if needed

    def get_image_url(self, obj):
        # This helper method provides the full URL for the image
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url)
        return None

#-------------------[CATEGORY LIST SERIALIZER]-------------------#
# Used for the /categories/ endpoint to show count
class CategoryListSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)
    blog_posts_category = serializers.SerializerMethodField()

    class Meta:
        model = Category_Types
        fields = ['Category', 'post_count', 'blog_posts_category']
    
    def get_blog_posts_category(self, obj):
        posts = obj.blog_posts_category.all()
        return BlogPostSerializer(posts, many=True, context=self.context).data 

#-------------------[TAG LIST SERIALIZER]-------------------#
# Used for the /tags/ endpoint
class TagListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag_Types
        fields = ['Tag']

#-------------------[SEARCH SERIALIZER]-------------------#
class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Search
        fields = '__all__'