# 🚄 Deploy to Railway

Railway is a modern deployment platform that's very developer-friendly.

## Prerequisites
1. Create a Railway account: https://railway.app/
2. Connect your GitHub account
3. Push your code to GitHub

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
cd foodapi_project
git init
git add .
git commit -m "Initial commit - Django Food Nutrition API"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/foodapi-project.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway
1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Python project

### 3. Set Environment Variables
In Railway dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add these variables:
   - `SECRET_KEY`: `your-super-secret-key-here`
   - `DEBUG`: `False`
   - `DJANGO_SETTINGS_MODULE`: `foodapi.production_settings`

### 4. Custom Start Command (if needed)
In Railway dashboard:
1. Go to "Settings" tab
2. Set "Start Command": `gunicorn foodapi.wsgi:application --bind 0.0.0.0:$PORT`

### 5. Domain
Railway provides a free domain like: `your-app-name.railway.app`

## Your API Endpoints Will Be:
- Welcome: `https://your-app-name.railway.app/api/`
- Foods List: `https://your-app-name.railway.app/api/foods/`
- Food Data: `https://your-app-name.railway.app/api/food/Naan/`

## Advantages:
- ✅ Very fast deployments
- ✅ Automatic HTTPS
- ✅ Great developer experience
- ✅ No sleep mode (unlike Heroku free tier)

## Cost: 
- $5/month after free trial
- Free trial includes $5 credit
