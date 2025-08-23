# 📄 Document Processing Appwrite Function

This Appwrite Function handles the async processing of PDF documents, including chunking, embedding generation, and Pinecone storage.

## 🚀 Deployment Instructions

### **Method 1: Using the Deployment Script (Recommended)**

1. **Navigate to the function directory:**

   ```bash
   cd appwrite-functions/process-document
   ```

2. **Make the deployment script executable:**

   ```bash
   chmod +x deploy.sh
   ```

3. **Run the deployment script:**

   ```bash
   ./deploy.sh
   ```

4. **Follow the on-screen instructions**

### **Method 2: Manual Deployment**

1. **Navigate to the function directory:**

   ```bash
   cd appwrite-functions/process-document
   ```

2. **Create a zip file:**

   ```bash
   zip -r process-document.zip . -x "*.git*" "*.DS_Store*" "deploy.sh" "README.md"
   ```

3. **Upload to Appwrite Console:**
   - Go to your Appwrite Console
   - Navigate to Functions → Create Function
   - Set function name: `process-document`
   - Set runtime: `Node.js 18`
   - Set entrypoint: `index.js`
   - Upload the `process-document.zip` file

## ⚙️ Environment Variables

Set these environment variables in your Appwrite Function:

```bash
APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-admin-api-key
APPWRITE_DATABASE_ID=your-database-id
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=sidchat
COHERE_API_KEY=your-cohere-api-key
```

## 🔧 Function Configuration

- **Runtime**: Node.js 18
- **Entrypoint**: `index.js`
- **Timeout**: 60 seconds (recommended)
- **Memory**: 512MB (minimum)

## 📋 Function Capabilities

- ✅ PDF document loading and parsing
- ✅ Text chunking with configurable size/overlap
- ✅ Cohere embedding generation
- ✅ Pinecone vector storage
- ✅ Progress tracking and status updates
- ✅ Error handling and retry logic
- ✅ User and workspace isolation

## 🐛 Troubleshooting

### **Build Errors**

If you encounter build errors:

1. **Check file structure:**

   ```
   process-document/
   ├── index.js          # Main function code
   ├── package.json      # Dependencies
   └── deploy.sh         # Deployment script
   ```

2. **Verify package.json exists:**

   - Ensure `package.json` is in the root of the function directory
   - Check that all required dependencies are listed

3. **Check Appwrite Console:**
   - Verify function runtime is set to Node.js 18
   - Ensure entrypoint is set to `index.js`
   - Check that environment variables are properly set

### **Common Issues**

1. **"package.json not found" error:**

   - Make sure you're uploading the entire `process-document` folder
   - Verify the zip file contains `package.json` at the root level

2. **Function execution fails:**

   - Check function logs in Appwrite Console
   - Verify all environment variables are set correctly
   - Ensure API keys have proper permissions

3. **Dependencies not found:**
   - Check that `package.json` contains all required dependencies
   - Verify dependency versions are compatible with Node.js 18

## 📞 Support

If you continue to experience issues:

1. Check the Appwrite Function logs in the console
2. Verify your environment variables are correct
3. Ensure your Appwrite instance supports Functions
4. Check that your API keys have the necessary permissions

## 🔄 Updating the Function

To update an existing function:

1. Make your changes to the code
2. Run the deployment script again: `./deploy.sh`
3. Upload the new zip file to the existing function
4. Redeploy the function

## 📊 Monitoring

After deployment, monitor your function:

- Check execution logs in Appwrite Console
- Monitor execution times and success rates
- Set up alerts for failed executions
- Track resource usage and performance
