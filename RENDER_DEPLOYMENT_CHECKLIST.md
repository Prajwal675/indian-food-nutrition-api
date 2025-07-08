# 📋 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Files Created/Updated**
- [ ] `render.yaml` - Render configuration file
- [ ] `build.sh` - Build script (make executable with `chmod +x build.sh`)
- [ ] `foodapi/render_settings.py` - Production settings
- [ ] `requirements.txt` - Updated with database dependencies
- [ ] Code pushed to GitHub

### 2. **Required Files Check**
```bash
# Verify these files exist:
ls -la render.yaml
ls -la build.sh
ls -la foodapi/render_settings.py
ls -la requirements.txt
```

### 3. **Make Build Script Executable**
```bash
chmod +x build.sh
git add build.sh
git commit -m "Make build script executable"
git push origin main
```

## 🚀 Deployment Steps

### Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub account
3. Verify email address

### Step 2: Deploy Using Blueprint (Recommended)
1. Click "New +" → "Blueprint"
2. Connect your GitHub repository
3. Select your repository
4. Render detects `render.yaml` automatically
5. Click "Apply"
6. Wait for deployment (5-10 minutes)

### Step 3: Alternative Manual Deployment
If blueprint doesn't work:
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: `indian-food-nutrition-api`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn foodapi.wsgi:application`
   - **Instance Type**: `Free`

### Step 4: Set Environment Variables
In Render dashboard → Your service → Environment:
- `DJANGO_SETTINGS_MODULE`: `foodapi.render_settings`
- `SECRET_KEY`: (auto-generated or custom)
- `PYTHON_VERSION`: `3.11.9`

## 🧪 Testing Your Deployment

### 1. **Basic API Test**
```bash
# Replace YOUR_APP_NAME with your actual Render app name
curl https://YOUR_APP_NAME.onrender.com/api/

# Expected response:
# {"message": "Welcome to Indian Food Nutrition API"}
```

### 2. **Search Endpoint Test**
```bash
curl "https://YOUR_APP_NAME.onrender.com/api/search/?dish=Naan"

# Expected: Nutrition data for Naan
```

### 3. **Foods List Test**
```bash
curl https://YOUR_APP_NAME.onrender.com/api/foods/

# Expected: Array of 1000+ food names
```

### 4. **Special Characters Test**
```bash
curl "https://YOUR_APP_NAME.onrender.com/api/search/?dish=Chapati/Roti"

# Expected: Nutrition data for Chapati/Roti
```

## 🔧 Troubleshooting

### Build Failures

#### Issue: "Permission denied: ./build.sh"
**Solution:**
```bash
chmod +x build.sh
git add build.sh
git commit -m "Fix build script permissions"
git push origin main
```

#### Issue: "Module not found"
**Solution:** Check `requirements.txt` has all dependencies:
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

### Runtime Errors

#### Issue: "DisallowedHost"
**Solution:** Check `ALLOWED_HOSTS` in `render_settings.py`:
```python
ALLOWED_HOSTS = [
    '.onrender.com',
    'localhost',
    '127.0.0.1',
]
```

#### Issue: "Static files not found"
**Solution:** Verify build script runs `collectstatic`:
```bash
python manage.py collectstatic --no-input
```

### Database Issues

#### Issue: "Database connection failed"
**Solution:** 
1. Ensure PostgreSQL database is created in Render
2. Check `DATABASE_URL` environment variable is set
3. Verify `dj-database-url` is in requirements.txt

## 📊 Monitoring Your Deployment

### 1. **Render Dashboard**
- View real-time logs
- Monitor resource usage
- Check deployment history
- View metrics

### 2. **Health Check Endpoint**
Add to your Django app:
```python
# In nutrition/views.py
@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "healthy",
        "timestamp": timezone.now().isoformat(),
        "version": "1.0.0"
    })

# In nutrition/urls.py
urlpatterns = [
    # ... existing patterns
    path('health/', views.health_check),
]
```

Test: `curl https://YOUR_APP_NAME.onrender.com/api/health/`

## 🔄 Updating Your Deployment

### Automatic Updates
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update API features"
   git push origin main
   ```
3. Render automatically redeploys

### Manual Redeploy
1. Go to Render dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## 💰 Cost Management

### Free Tier Limits
- 750 hours/month
- 512MB RAM
- Sleeps after 15 minutes of inactivity
- Cold start delay (~30 seconds)

### Upgrading to Paid ($7/month)
- No sleep mode
- Faster performance
- More RAM options
- Priority support

## 🌐 Custom Domain Setup

### 1. **Add Custom Domain**
1. Render dashboard → Your service → Settings
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yoursite.com`)

### 2. **Update DNS**
Add CNAME record:
- **Name**: `api` (or your subdomain)
- **Value**: `YOUR_APP_NAME.onrender.com`

### 3. **Update CORS Settings**
In `render_settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://api.yoursite.com",
    "https://yoursite.com",
]
```

## 🎯 Production Optimization

### 1. **Environment Variables**
Set in Render dashboard:
- `WEB_CONCURRENCY`: `4` (number of worker processes)
- `MAX_REQUESTS`: `1000` (requests per worker before restart)

### 2. **Database Optimization**
- Use PostgreSQL for production
- Enable connection pooling
- Set appropriate `CONN_MAX_AGE`

### 3. **Caching**
Add Redis for caching:
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## ✅ Final Checklist

- [ ] API deployed successfully
- [ ] All endpoints working
- [ ] CORS configured for your frontend
- [ ] Custom domain set up (optional)
- [ ] Monitoring configured
- [ ] Frontend updated with new API URL
- [ ] Documentation updated

## 🎉 Success!

Your Django REST API is now live on Render! 

**Your API URL**: `https://YOUR_APP_NAME.onrender.com/api/`

Share this URL with your frontend applications and start building amazing nutrition-powered features! 🚀
