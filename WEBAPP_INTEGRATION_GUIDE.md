# 🌐 Complete Webapp Integration Guide

## 🚀 Quick Start

### 1. **Start Your Django API Server**
```bash
cd foodapi_project
python manage.py runserver
```
Your API will be available at: `http://127.0.0.1:8000/api/`

### 2. **API Endpoints Overview**
| Endpoint | Method | Description | Example |
|----------|--------|-------------|---------|
| `/api/` | GET | Welcome message | `http://127.0.0.1:8000/api/` |
| `/api/foods/` | GET | List all foods | `http://127.0.0.1:8000/api/foods/` |
| `/api/food/{name}/` | GET | Get nutrition (simple names) | `http://127.0.0.1:8000/api/food/Naan/` |
| `/api/search/?dish={name}` | GET | Search nutrition (all names) | `http://127.0.0.1:8000/api/search/?dish=Chapati/Roti` |

## 📱 Integration Examples

### 🟨 **JavaScript/HTML (Vanilla)**

**File**: `examples/vanilla-js-example.html`

```javascript
// Basic API call
async function searchFood(dishName) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/search/?dish=${encodeURIComponent(dishName)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
    }
}

// Usage
searchFood('Chapati/Roti').then(data => console.log(data));
```

**To run:**
1. Open `examples/vanilla-js-example.html` in your browser
2. Make sure Django server is running
3. Search for any dish!

### ⚛️ **React Integration**

**Files**: `examples/react-nutrition-app/`

**Custom Hook** (`useNutritionAPI.js`):
```javascript
import { useState, useCallback } from 'react';

export const useNutritionAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchNutrition = useCallback(async (dishName) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search/?dish=${encodeURIComponent(dishName)}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, searchNutrition };
};
```

**Component Usage**:
```javascript
import { useNutritionAPI } from './hooks/useNutritionAPI';

function NutritionSearch() {
  const { loading, error, searchNutrition } = useNutritionAPI();
  const [nutritionData, setNutritionData] = useState(null);

  const handleSearch = async (dishName) => {
    try {
      const data = await searchNutrition(dishName);
      setNutritionData(data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div>
      {/* Your search UI here */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {nutritionData && <NutritionDisplay data={nutritionData} />}
    </div>
  );
}
```

**To run React app:**
```bash
cd examples/react-nutrition-app
npm install
npm start
```

### 🐍 **Python/Flask Integration**

**File**: `examples/flask-nutrition-app/app.py`

```python
import requests

class NutritionAPIClient:
    def __init__(self, base_url='http://127.0.0.1:8000/api'):
        self.base_url = base_url
    
    def search_nutrition(self, dish_name):
        response = requests.get(f"{self.base_url}/search/", params={'dish': dish_name})
        response.raise_for_status()
        return response.json()
    
    def get_all_foods(self):
        response = requests.get(f"{self.base_url}/foods/")
        response.raise_for_status()
        return response.json()['foods']

# Usage in Flask route
@app.route('/search')
def search():
    dish_name = request.args.get('dish')
    client = NutritionAPIClient()
    try:
        data = client.search_nutrition(dish_name)
        return render_template('nutrition.html', data=data)
    except Exception as e:
        return render_template('error.html', error=str(e))
```

**To run Flask app:**
```bash
cd examples/flask-nutrition-app
pip install -r requirements.txt
python app.py
```

## 🔧 **Configuration & Setup**

### **CORS Configuration (Already Done)**
The Django API is configured to accept requests from:
- `http://localhost:3000` (React)
- `http://localhost:8080` (Vue.js)
- `http://localhost:5000` (Flask)
- All origins (for development)

### **Environment Variables**
Create `.env` file in your frontend project:
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
# or for production:
REACT_APP_API_URL=https://your-deployed-api.herokuapp.com/api
```

## 🌍 **Production Deployment**

### **1. Deploy Django API**
Choose one of these platforms:

#### **Heroku** (Free tier available):
```bash
# See DEPLOY_HEROKU.md for complete instructions
heroku create your-food-api
git push heroku main
```

#### **Railway** (Modern platform):
```bash
# See DEPLOY_RAILWAY.md for complete instructions
# Connect GitHub repo to Railway
```

#### **Render** (Free tier):
1. Connect GitHub repo
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn foodapi.wsgi:application`

### **2. Update Frontend API URLs**
Once deployed, update your frontend to use the production API URL:

```javascript
// Instead of localhost
const API_BASE_URL = 'https://your-food-api.herokuapp.com/api';

// Or use environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
```

## 🛠️ **Advanced Usage**

### **Error Handling**
```javascript
async function robustAPICall(dishName) {
    try {
        const response = await fetch(`${API_BASE_URL}/search/?dish=${encodeURIComponent(dishName)}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Dish "${dishName}" not found`);
            }
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('Network error - check if API server is running');
        }
        throw error;
    }
}
```

### **Caching**
```javascript
// Simple in-memory cache
const nutritionCache = new Map();

async function getCachedNutrition(dishName) {
    if (nutritionCache.has(dishName)) {
        return nutritionCache.get(dishName);
    }
    
    const data = await searchNutrition(dishName);
    nutritionCache.set(dishName, data);
    return data;
}
```

### **Batch Requests**
```javascript
async function getNutritionForMultipleDishes(dishNames) {
    const promises = dishNames.map(dish => searchNutrition(dish));
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
        dish: dishNames[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
    }));
}
```

## 🔍 **Testing Your Integration**

### **1. Test API Connectivity**
```javascript
// Health check
fetch('http://127.0.0.1:8000/api/')
  .then(response => response.json())
  .then(data => console.log('API Status:', data.message))
  .catch(error => console.error('API not reachable:', error));
```

### **2. Test Special Characters**
```javascript
// Test dishes with special characters
const testDishes = ['Chapati/Roti', 'Hot tea (Garam Chai)', 'Naan'];
testDishes.forEach(dish => {
    searchNutrition(dish)
        .then(data => console.log(`✅ ${dish}:`, data))
        .catch(error => console.error(`❌ ${dish}:`, error));
});
```

## 📊 **Common Use Cases**

### **1. Nutrition Calculator**
```javascript
function calculateTotalNutrition(dishes) {
    // Get nutrition for multiple dishes and sum up values
    return Promise.all(dishes.map(dish => searchNutrition(dish)))
        .then(results => {
            const totals = {};
            results.forEach(result => {
                const dishData = Object.values(result)[0];
                Object.entries(dishData).forEach(([key, value]) => {
                    totals[key] = (totals[key] || 0) + (value || 0);
                });
            });
            return totals;
        });
}
```

### **2. Meal Planner**
```javascript
class MealPlanner {
    constructor() {
        this.meals = [];
    }
    
    async addDish(dishName, servings = 1) {
        const nutrition = await searchNutrition(dishName);
        this.meals.push({ dishName, nutrition, servings });
    }
    
    getTotalCalories() {
        return this.meals.reduce((total, meal) => {
            const dishData = Object.values(meal.nutrition)[0];
            return total + (dishData['Calories (kcal)'] || 0) * meal.servings;
        }, 0);
    }
}
```

### **3. Food Comparison**
```javascript
async function compareFoods(dish1, dish2) {
    const [data1, data2] = await Promise.all([
        searchNutrition(dish1),
        searchNutrition(dish2)
    ]);
    
    const nutrition1 = Object.values(data1)[0];
    const nutrition2 = Object.values(data2)[0];
    
    const comparison = {};
    Object.keys(nutrition1).forEach(key => {
        comparison[key] = {
            [dish1]: nutrition1[key],
            [dish2]: nutrition2[key],
            difference: (nutrition1[key] || 0) - (nutrition2[key] || 0)
        };
    });
    
    return comparison;
}
```

## 🚨 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| CORS errors | Check Django CORS settings, ensure API server is running |
| 404 for special characters | Use `/api/search/?dish=` endpoint instead of `/api/food/` |
| Network errors | Verify API server is running on correct port |
| Slow responses | Implement caching, consider pagination for large datasets |
| Rate limiting | Add request throttling in your frontend |

## 📚 **Next Steps**

1. **Deploy your API** using the deployment guides
2. **Build your frontend** using the provided examples
3. **Add authentication** if needed for production
4. **Implement caching** for better performance
5. **Add analytics** to track API usage
6. **Scale horizontally** as your user base grows

Your Indian Food Nutrition API is now ready to power any webapp! 🚀
