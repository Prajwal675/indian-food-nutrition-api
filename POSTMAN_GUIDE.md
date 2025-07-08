# 📮 Complete Postman Guide for Indian Food Nutrition API

## 🚀 Quick Setup

1. **Start the Django server:**
   ```bash
   cd foodapi_project
   python manage.py runserver
   ```

2. **Import the Postman collection:**
   - Open Postman
   - Click "Import" → "Upload Files"
   - Select `Indian_Food_Nutrition_API.postman_collection.json`

## 📋 API Endpoints

### 1. **Welcome Message**
- **URL**: `http://127.0.0.1:8000/api/`
- **Method**: `GET`
- **Response**: `{"message": "Welcome to Indian Food Nutrition API"}`

### 2. **List All Foods**
- **URL**: `http://127.0.0.1:8000/api/foods/`
- **Method**: `GET`
- **Response**: Array of 1,014 dish names

### 3. **Get Food Nutrition (Simple Names)**
- **URL**: `http://127.0.0.1:8000/api/food/{dish_name}/`
- **Method**: `GET`
- **Works for**: Simple dish names without special characters
- **Example**: `http://127.0.0.1:8000/api/food/Naan/`

### 4. **Search Food Nutrition (Recommended for Special Characters)**
- **URL**: `http://127.0.0.1:8000/api/search/`
- **Method**: `GET`
- **Query Parameter**: `dish={dish_name}`
- **Works for**: ALL dish names including those with special characters

## 🔧 Handling Special Characters

### ❌ **Problem Dishes (Use Search Endpoint)**
These dishes contain forward slashes or other special characters:
- `Chapati/Roti`
- `Sweet split chickpea roti (Sweet channa dal roti/Puranpoli)`
- Any dish with `/`, `(`, `)`, or other special characters

### ✅ **Solution: Use Search Endpoint**

#### **In Postman:**
1. **URL**: `http://127.0.0.1:8000/api/search/`
2. **Method**: `GET`
3. **Params Tab**:
   - Key: `dish`
   - Value: `Chapati/Roti` (exact dish name)

#### **Example URLs:**
```
GET http://127.0.0.1:8000/api/search/?dish=Chapati/Roti
GET http://127.0.0.1:8000/api/search/?dish=Makki ki roti
GET http://127.0.0.1:8000/api/search/?dish=Hot tea (Garam Chai)
```

## 📝 **Step-by-Step Postman Instructions**

### **Testing Chapati/Roti:**

1. **Create New Request**
   - Click "New" → "Request"
   - Name: "Search Chapati/Roti"

2. **Set URL and Method**
   - Method: `GET`
   - URL: `http://127.0.0.1:8000/api/search/`

3. **Add Query Parameter**
   - Click "Params" tab
   - Key: `dish`
   - Value: `Chapati/Roti`

4. **Send Request**
   - Click "Send"
   - Should return 200 OK with nutrition data

### **Expected Response:**
```json
{
  "Chapati/Roti": {
    "Calories (kcal)": 202.31,
    "Carbohydrates (g)": 35.65,
    "Protein (g)": 5.88,
    "Fats (g)": 3.56,
    "Free Sugar (g)": 1.0,
    "Fibre (g)": 6.31,
    "Sodium (mg)": 1.16,
    "Calcium (mg)": 17.22,
    "Iron (mg)": 2.28,
    "Vitamin C (mg)": 0.0,
    "Folate (µg)": 5.84
  }
}
```

## 🧪 **Test Cases to Try**

### **✅ Working Examples:**
```
GET /api/search/?dish=Chapati/Roti
GET /api/search/?dish=chapati/roti (case insensitive)
GET /api/search/?dish=Naan
GET /api/search/?dish=Masala dosa
GET /api/search/?dish=Hot tea (Garam Chai)
GET /api/search/?dish=Makki ki roti
```

### **❌ Error Cases:**
```
GET /api/search/ (missing dish parameter)
GET /api/search/?dish=nonexistent dish (404 error)
```

## 🔍 **Finding Dish Names**

1. **Get all dish names first:**
   ```
   GET http://127.0.0.1:8000/api/foods/
   ```

2. **Copy exact dish name from the response**

3. **Use in search endpoint:**
   ```
   GET http://127.0.0.1:8000/api/search/?dish={exact_dish_name}
   ```

## 💡 **Pro Tips**

1. **Always use the search endpoint** for dishes with special characters
2. **Case doesn't matter** - both endpoints are case-insensitive
3. **Copy-paste dish names** from the foods list to avoid typos
4. **Use Postman's Params tab** instead of manually typing query strings
5. **Check the status code** - 200 = success, 404 = not found, 400 = bad request

## 🚨 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| 404 for `Chapati/Roti` | Use search endpoint instead of food endpoint |
| 400 Bad Request | Make sure to include `dish` parameter |
| Server not responding | Check if Django server is running |
| Dish not found | Verify exact spelling from foods list |

## 📊 **API Summary**

| Endpoint | Use Case | Special Characters |
|----------|----------|-------------------|
| `/api/food/{name}/` | Simple dish names | ❌ No |
| `/api/search/?dish={name}` | All dish names | ✅ Yes |
| `/api/foods/` | Get all dish names | N/A |
| `/api/` | Welcome message | N/A |
