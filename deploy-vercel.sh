#!/bin/bash

echo " Starting Vercel Deployment..."

# Step 1: Clean up
echo " Cleaning up..."
rm -rf dist
rm -rf node_modules

# Step 2: Install dependencies
echo " Installing dependencies..."
npm install --legacy-peer-deps

# Step 3: Build the project
echo " Building project..."
npm run build

# Step 4: Check build
if [ -d "dist" ]; then
    echo " Build successful! Size:"
    du -sh dist/
else
    echo " Build failed!"
    exit 1
fi

# Step 5: Deploy to Vercel
echo " Deploying to Vercel..."
vercel --prod --confirm

echo " Deployment complete!"