#!/bin/bash

# Appwrite Function Deployment Script
# This script helps deploy the document processing function

echo "🚀 Deploying Appwrite Function: process-document"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the process-document directory."
    exit 1
fi

if [ ! -f "index.js" ]; then
    echo "❌ Error: index.js not found. Make sure you're in the process-document directory."
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."

# Remove any existing zip files
rm -f process-document.zip

# Create zip file with correct structure
zip -r process-document.zip . -x "*.git*" "*.DS_Store*" "deploy.sh" "README.md"

echo "✅ Deployment package created: process-document.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Appwrite Console"
echo "2. Navigate to Functions → process-document"
echo "3. Upload the process-document.zip file"
echo "4. Set environment variables:"
echo "   - APPWRITE_ENDPOINT"
echo "   - APPWRITE_PROJECT_ID"
echo "   - APPWRITE_API_KEY"
echo "   - APPWRITE_DATABASE_ID"
echo "   - PINECONE_API_KEY"
echo "   - PINECONE_INDEX_NAME"
echo "   - COHERE_API_KEY"
echo "5. Deploy the function"
echo "6. Copy the Function ID to your .env.local file"
