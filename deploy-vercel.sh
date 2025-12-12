#!/bin/bash
# fix-vercel-deploy.sh

echo "🔧 Fixing Vercel deployment..."

# 1. Install dompurify
npm install dompurify

# 2. Remove react-scripts if exists
npm uninstall react-scripts

# 3. Install Vite
npm install -D vite @vitejs/plugin-react

# 4. Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://codewithamul-blogify.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
EOF

# 5. Update package.json scripts
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.start="vite"

# 6. Create .vercelignore
cat > .vercelignore << 'EOF'
backend/
requirements.txt
manage.py
db.sqlite3
*.py
*.pyc
__pycache__/
env/
.vscode/
.DS_Store
EOF

echo "✅ Vercel deployment fixed!"
echo "📦 Run: npm run build"
echo "🚀 Then deploy to Vercel"