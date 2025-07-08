# 🎨 Deploy to Render

Render is a modern cloud platform that offers free hosting for web applications with automatic deployments from Git.

## Prerequisites
1. Create a free Render account: https://render.com/
2. GitHub account with your code
3. Your Django project pushed to GitHub

## Step-by-Step Deployment

### 1. Prepare Your Project for Render

First, let's create a Render-specific configuration file:

Create `render.yaml` in your project root:
```yaml
databases:
  - name: foodapi-db
    databaseName: foodapi
    user: foodapi

services:
  - type: web
    name: indian-food-nutrition-api
    env: python
    buildCommand: "./build.sh"
    startCommand: "gunicorn foodapi.wsgi:application"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: foodapi-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: WEB_CONCURRENCY
        value: 4
```

### 2. Create Build Script

Create `build.sh` in your project root:
```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
```

Make it executable:
```bash
chmod a+x build.sh
```

### 3. Update Settings for Render

Create `foodapi/render_settings.py`:
```python
import os
import dj_database_url
from .settings import *

# Override settings for Render deployment
DEBUG = False

# Security settings
ALLOWED_HOSTS = [
    '.onrender.com',
    'localhost',
    '127.0.0.1',
]

# Database configuration for Render
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
    }

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Add whitenoise for static files
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-app.onrender.com",
    "https://your-frontend-app.netlify.app",
    "https://your-frontend-app.vercel.app",
]

# For development/testing, you can temporarily allow all origins
# CORS_ALLOW_ALL_ORIGINS = True  # Remove this in production

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
}
```

### 4. Update Requirements

Add database support to `requirements.txt`:
```txt
django==5.2.4
djangorestframework==3.16.0
pandas==2.3.0
gunicorn==21.2.0
whitenoise==6.6.0
python-decouple==3.8
django-cors-headers==4.3.1
dj-database-url==2.1.0
psycopg2-binary==2.9.7
```

### 5. Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 6. Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Go to https://render.com/
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy

#### Option B: Manual Setup
1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `indian-food-nutrition-api`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn foodapi.wsgi:application`
   - **Instance Type**: `Free` (or paid for better performance)

### 7. Set Environment Variables

In your Render dashboard:
1. Go to your service
2. Click "Environment" tab
3. Add these variables:
   - `DJANGO_SETTINGS_MODULE`: `foodapi.render_settings`
   - `SECRET_KEY`: Generate a secure key
   - `PYTHON_VERSION`: `3.11.9`

### 8. Configure Database (Optional)

If you want to use PostgreSQL instead of SQLite:
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Create database with name: `foodapi-db`
3. Copy the connection string
4. Add to your web service environment variables:
   - `DATABASE_URL`: `[your-postgres-connection-string]`

## Your API Endpoints Will Be:
- Welcome: `https://your-app-name.onrender.com/api/`
- Foods List: `https://your-app-name.onrender.com/api/foods/`
- Food Data: `https://your-app-name.onrender.com/api/food/Naan/`
- Search: `https://your-app-name.onrender.com/api/search/?dish=Chapati/Roti`

## Testing Your Deployment

Once deployed, test your API:

```bash
# Test welcome endpoint
curl https://your-app-name.onrender.com/api/

# Test search endpoint
curl "https://your-app-name.onrender.com/api/search/?dish=Naan"

# Test foods list
curl https://your-app-name.onrender.com/api/foods/
```

## Advantages of Render:
- ✅ **Free tier available** (750 hours/month)
- ✅ **Automatic deployments** from Git
- ✅ **Built-in SSL certificates**
- ✅ **Easy database integration**
- ✅ **No sleep mode** (unlike Heroku free tier)
- ✅ **Great performance**
- ✅ **Simple configuration**

## Limitations:
- ⚠️ Free tier has limited compute hours
- ⚠️ Cold starts on free tier
- ⚠️ Limited to 512MB RAM on free tier

## Troubleshooting

### Build Failures:
```bash
# Check build logs in Render dashboard
# Common issues:
# 1. Missing dependencies in requirements.txt
# 2. Build script permissions
# 3. Python version mismatch
```

### Runtime Errors:
```bash
# Check application logs in Render dashboard
# Common issues:
# 1. Missing environment variables
# 2. Database connection issues
# 3. Static files not collected
```

### Database Issues:
```bash
# If using PostgreSQL, ensure:
# 1. DATABASE_URL is set correctly
# 2. psycopg2-binary is in requirements.txt
# 3. Database migrations are run in build script
```

## Updating Your Deployment

To update your API:
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update API"
   git push origin main
   ```
3. Render will automatically redeploy

## Cost Optimization

### Free Tier:
- Good for development and testing
- 750 hours/month free
- Automatic sleep after inactivity

### Paid Tier ($7/month):
- No sleep mode
- Better performance
- More compute hours
- Custom domains

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `api.yoursite.com`)
4. Update your DNS records as instructed
5. SSL certificate is automatically provisioned

## Monitoring

Render provides:
- Real-time logs
- Metrics dashboard
- Uptime monitoring
- Performance insights

Access these in your service dashboard.

## Next Steps

1. **Test thoroughly** - Verify all endpoints work
2. **Update frontend** - Change API URLs to your Render URL
3. **Set up monitoring** - Use Render's built-in tools
4. **Configure custom domain** - For production use
5. **Optimize performance** - Consider upgrading to paid tier

Your Django REST API is now live on Render! 🚀

**Example deployed URL**: `https://indian-food-nutrition-api.onrender.com/api/`
