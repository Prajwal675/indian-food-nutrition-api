# 🚀 Deploy to Heroku

## Prerequisites
1. Create a free Heroku account: https://signup.heroku.com/
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Install Git if not already installed

## Step-by-Step Deployment

### 1. Initialize Git Repository
```bash
cd foodapi_project
git init
git add .
git commit -m "Initial commit - Django Food Nutrition API"
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
heroku create your-food-api-name
# Replace 'your-food-api-name' with your preferred app name
# Example: heroku create indian-food-nutrition-api
```

### 4. Set Environment Variables
```bash
heroku config:set SECRET_KEY="your-super-secret-key-here"
heroku config:set DEBUG=False
```

### 5. Deploy to Heroku
```bash
git push heroku main
```

### 6. Run Migrations
```bash
heroku run python manage.py migrate
```

### 7. Open Your App
```bash
heroku open
```

## Your API Endpoints Will Be:
- Welcome: `https://your-app-name.herokuapp.com/api/`
- Foods List: `https://your-app-name.herokuapp.com/api/foods/`
- Food Data: `https://your-app-name.herokuapp.com/api/food/Naan/`

## Troubleshooting
- Check logs: `heroku logs --tail`
- Restart app: `heroku restart`
- Check config: `heroku config`

## Cost: FREE (with limitations)
- 550-1000 dyno hours per month
- App sleeps after 30 minutes of inactivity
- Wakes up automatically when accessed
