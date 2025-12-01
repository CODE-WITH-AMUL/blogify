#-------------------[IMPORTS MODELS]-------------------#
from rest_framework import serializers
from .models import *

#---------------------[BLOG POST SERIALIZER]-------------------#
class BlogPostSerializer(serializers.Serializer):
    class Meta:
        models = Blog_Post
        fields = '__all__'
#-------------------[CATEGORY SERIALIZER]-------------------#
class CategoryTypesSerializer(serializers.Serializer):
    class Meta:
        models = Category_Types
        fields = '__all__'
#-------------------[TAG SERIALIZER]-------------------#
class TagTypesSerializer(serializers.Serializer):
    class Meta:
        models = Tag_Types
        fields = '__all__'
#-------------------[SEARCH SERIALIZER]-------------------#
class SearchSerializer(serializers.Serializer):
    class Meta:
        models = Search
        fields = '__all__'
        