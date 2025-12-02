# blogs/models.py (Updated Version)

from django.db import models
from django.utils import timezone

#---------------------[DATA LIST ]---------------------#
# It's good practice to keep choices defined outside the model classes 
# or in a separate file if they are extensive.
CATEGORY_DEFAULT_CHOICES = [
    ('TECHNOLOGY', 'Technology'),
    ('LIFESTYLE', 'Lifestyle'),
    ('BUSINESS', 'Business'),
    ('ENTERTAINMENT', 'Entertainment'),
    ('HEALTH', 'Health'),
    ('CODING', 'Coding'),
    ('PROGRAMMING', 'Programming'),
    ('FOOD', 'Food'),
    ('FASHION', 'Fashion'),
    ('SPORTS', 'Sports'),
    ('TRAVEL', 'Travel'),
    ('OTHER', 'Other'),
]

TAG_DEFAULT_CHOICES = [
    # Programming Languages
    ('PYTHON', 'Python'),
    ('JAVASCRIPT', 'JavaScript'),
    # ... (Include all your tags here)
    ('DJANGO', 'Django'),
    ('REACT', 'React'),
    # ...
]

#---------------------[UNIVERSAL TIME]---------------------#
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


#---------------------[CATEGORY MODEL]---------------------#
class Category_Types(models.Model):
    Category = models.CharField(
        max_length=50, 
        choices=CATEGORY_DEFAULT_CHOICES, 
        unique=True
    )

    def __str__(self):
        return self.Category


#---------------------[TAG MODEL]---------------------#
class Tag_Types(models.Model):
    Tag = models.CharField(
        max_length=50, 
        choices=TAG_DEFAULT_CHOICES, 
        unique=True
    )

    def __str__(self):
        return self.Tag


#---------------------[BLOG MODEL]---------------------#
class Blog_Post(TimeStampedModel):
    title = models.CharField(max_length=250)
    content = models.TextField()
    author = models.CharField(max_length=250)
    slug = models.SlugField(unique=True)
    # Using 'on_delete=models.PROTECT' is often safer than CASCADE for critical relationships
    category = models.ForeignKey(
        Category_Types, 
        on_delete=models.CASCADE, 
        related_name='blog_posts_category'
    )
    tag = models.ManyToManyField(
        Tag_Types, 
        related_name='blog_posts_tags'
    )
    featured_article = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to='blog_images/', 
        null=True, 
        blank=True
    )

    class Meta:
        # Ensures that the latest posts are always retrieved first by default
        ordering = ['-created_at'] 

    def __str__(self):
        return self.title


#---------------------[SEARCH MODEL]---------------------#
class Search(models.Model):
    query = models.CharField(max_length=200)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return self.query