# forms.py
from django import forms
from ckeditor.widgets import CKEditorWidget
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from .models import Blog_Post

class BlogPostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget(config_name='word_like'))
    
    class Meta:
        model = Blog_Post
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add placeholder help text
        self.fields['title'].help_text = "Enter a catchy title for your blog post"
        self.fields['content'].help_text = "Write your content here. Use the toolbar for formatting like in MS Word."
        self.fields['slug'].help_text = "URL-friendly version (auto-generated from title)"
        self.fields['author'].help_text = "Name of the author"
        self.fields['category'].help_text = "Select the main category"
        self.fields['tag'].help_text = "Hold Ctrl/Cmd to select multiple tags"