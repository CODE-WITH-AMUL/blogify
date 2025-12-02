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
