#---------------------[IMPORT MODULES]---------------------#
from django.contrib import admin
from .models import Blog_Post, Category_Types, Tag_Types, Search


#---------------------[BLOG POST ADMIN]---------------------#
@admin.register(Blog_Post)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'created_at', 'updated_at')
    list_filter = ('category', 'tag', 'created_at')
    search_fields = ('title', 'content', 'author')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tag',)
    ordering = ('-created_at',)


#---------------------[CATEGORY ADMIN]---------------------#
@admin.register(Category_Types)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('Category',)
    search_fields = ('Category',)


#---------------------[TAG ADMIN]---------------------#
@admin.register(Tag_Types)
class TagAdmin(admin.ModelAdmin):
    list_display = ('Tag',)
    search_fields = ('Tag',)


#---------------------[SEARCH ADMIN]---------------------#
@admin.register(Search)
class SearchAdmin(admin.ModelAdmin):
    list_display = ('query', 'searched_at')
    search_fields = ('query',)
    ordering = ('-searched_at',)
