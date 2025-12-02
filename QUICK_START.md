# Blogify - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js & npm
- Django 5.2
- React 18

### Installation

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Setup Database**
   ```bash
   python manage.py migrate
   ```

3. **Create Admin User (if needed)**
   ```bash
   python manage.py createsuperuser
   ```

---

## 🎯 Running the Application

### Open Two Terminal Windows

**Terminal 1 - Backend (Django)**
```bash
cd c:\Users\Lenovo\Desktop\blogify
python manage.py runserver
# Server runs at: http://localhost:8000
```

**Terminal 2 - Frontend (React)**
```bash
cd c:\Users\Lenovo\Desktop\blogify
npm start
# App opens at: http://localhost:3000
```

---

## 📖 Features Overview

### Pages Available

| Page | URL | Description |
|------|-----|-------------|
| Home | `http://localhost:3000/` | Landing page with featured posts |
| Blog List | `http://localhost:3000/blog` | All blogs with search & filter |
| Blog Detail | `http://localhost:3000/blog/[slug]` | Read full blog post |
| Admin | `http://localhost:8000/admin` | Content management |

### Key Features

✅ **Blog Management**
- Create, edit, delete blog posts
- Upload featured images
- Multiple categories & tags
- Featured article option

✅ **User Experience**
- Smooth animations on all interactions
- Responsive design (Mobile/Tablet/Desktop)
- Search across blog content
- Filter by category
- Related posts recommendations

✅ **Search & Filter**
- Search by title, content, or author
- Filter by category
- Sort by date or title
- Grid/List view toggle

---

## 🔧 Admin Panel Usage

1. Visit `http://localhost:8000/admin/`
2. Login with admin credentials
3. Click "Core" → "Blog Posts"
4. Click "Add Blog Post"
5. Fill in:
   - **Title**: Blog post title
   - **Content**: Full article content (with rich editor)
   - **Author**: Author name
   - **Category**: Select category
   - **Tags**: Add multiple tags
   - **Slug**: Auto-generated URL slug
   - **Featured Article**: Check if featured
   - **Image**: Upload cover image

6. Click "Save"
7. Post appears on frontend automatically!

---

## 🎨 Customization

### Change Site Name
Edit `src/components/Navbar.js`:
```javascript
<span className="logo-main">Your Site Name</span>
```

### Add New Categories
1. Admin → Core → Category Types
2. Click "Add Category Type"
3. Enter category name
4. Save

### Modify Colors
Edit `src/static/style/main.css` and change color codes:
- Primary: `#3b82f6` (Blue)
- Secondary: `#667eea` (Purple)
- Accent: `#764ba2` (Purple)

---

## 🐛 Troubleshooting

### Images Not Showing
- Ensure Django server is running
- Check image was uploaded in admin
- Verify `DEBUG=True` in `.env`

### API Errors
- Check Django server is running on `localhost:8000`
- Verify `.env` file has correct settings
- Run `python manage.py check`

### Routing Issues
- Clear browser cache
- Ensure slug is correct in URL
- Check post exists in database

### React Not Starting
- Delete `node_modules` folder
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

---

## 📁 Project Structure

```
blogify/
├── src/
│   ├── sites/
│   │   ├── Blog.js              # Blog list page
│   │   └── BlogDetail.js        # Blog detail page
│   ├── components/
│   │   ├── Navbar.js            # Navigation
│   │   ├── FeaturedPosts.js     # Featured section
│   │   └── ... (other components)
│   ├── config/
│   │   ├── PostCard.js          # Post card component
│   │   └── ... (config files)
│   ├── middleware/
│   │   ├── api.js               # API calls
│   │   └── helpers.js           # Utility functions
│   ├── App.js                   # Main app with routes
│   └── landingpage.js           # Landing page
├── core/
│   ├── models.py                # Database models
│   ├── views.py                 # API views
│   ├── serializers.py           # API serializers
│   └── urls.py                  # App URLs
├── blogify/
│   ├── settings.py              # Django settings
│   ├── urls.py                  # Main URLs
│   └── wsgi.py                  # WSGI config
├── manage.py                    # Django management
├── package.json                 # Node dependencies
├── requirements.txt             # Python dependencies
└── db.sqlite3                   # Database
```

---

## 📊 API Endpoints

### Get All Posts
```
GET http://localhost:8000/api/blogs/
```

### Search Posts
```
GET http://localhost:8000/api/blogs/?search=react
```

### Filter by Category
```
GET http://localhost:8000/api/blogs/?category__Category__icontains=PROGRAMMING
```

### Get Categories
```
GET http://localhost:8000/api/categories/
```

### Get Tags
```
GET http://localhost:8000/api/tags/
```

---

## 🎬 Animation Classes

Available animations (in `main.css`):
- `fadeIn` - Fade with slide
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right
- `slideInUp` - Slide from bottom
- `slideInDown` - Slide from top
- `pulse` - Pulsing effect
- `bounce` - Bouncing effect
- `glow` - Glowing effect
- `scaleIn` - Scale up animation

---

## 📱 Responsive Breakpoints

```css
Desktop: 1280px+
Tablet: 768px - 1279px
Mobile: 320px - 767px
```

---

## ⚡ Performance Tips

1. **Optimize Images**: Compress images before upload
2. **Browser Cache**: Clear cache for fresh content
3. **Database**: Run `python manage.py migrate` after adding models
4. **Build**: Run `npm run build` for production

---

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Set `DEBUG = False` in production
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Regular database backups

---

## 📞 Support

For issues or questions:
1. Check FEATURES_IMPLEMENTED.md
2. Review console errors (F12)
3. Check Django logs
4. Verify all services running

---

**Happy Blogging! 🎉**

Last Updated: December 2, 2025
