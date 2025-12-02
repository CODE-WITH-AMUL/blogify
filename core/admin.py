from django.contrib import admin
from .models import Post, Category, Tag
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms
from django.utils.html import mark_safe

class PostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget(config_name='default'))

    class Meta:
        model = Post
        fields = '__all__'

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    form = PostAdminForm
    list_display = ['title', 'author', 'created_date', 'published', 'is_featured', 'get_featured_image']  # Added is_featured
    list_filter = ['published', 'created_date', 'categories', 'tags', 'is_featured']  # Added filter
    search_fields = ['title', 'content', 'categories__name', 'tags__name']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['categories', 'tags']
    date_hierarchy = 'created_date'

    def get_featured_image(self, obj):
        if obj.featured_image:
            return mark_safe(f'<img src="{obj.featured_image.url}" width="60" height="60" />')
        return "No Image"
    get_featured_image.short_description = 'Featured Image'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}