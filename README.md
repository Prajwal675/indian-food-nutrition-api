# Indian Food Nutrition API

A Django REST API that serves nutritional information for Indian food dishes. The API loads data from a CSV file containing over 1000 Indian dishes with their nutritional values including calories, proteins, carbohydrates, fats, vitamins, and minerals.

## Features

- **Fast Data Loading**: CSV data is loaded once at server startup using pandas for optimal performance
- **Case-Insensitive Search**: Find dishes regardless of case sensitivity
- **Comprehensive Nutrition Data**: Includes calories, macronutrients, vitamins, and minerals
- **RESTful API**: Clean, simple endpoints following REST conventions
- **Error Handling**: Proper HTTP status codes and error messages

## API Endpoints

### 1. Welcome Message
```
GET /api/
```
Returns a welcome message.

**Response:**
```json
{
  "message": "Welcome to Indian Food Nutrition API"
}
```

### 2. List All Foods
```
GET /api/foods/
```
Returns a list of all available dish names.

**Response:**
```json
{
  "foods": [
    "Hot tea (Garam Chai)",
    "Instant coffee",
    "Espreso coffee",
    "..."
  ]
}
```

### 3. Get Nutrition Data for a Specific Dish
```
GET /api/food/<dish_name>/
```
Returns detailed nutritional information for the specified dish. The search is case-insensitive.

**Example Request:**
```
GET /api/food/Hot tea (Garam Chai)/
```

**Response:**
```json
{
  "Hot tea (Garam Chai)": {
    "Calories (kcal)": 16.14,
    "Carbohydrates (g)": 2.58,
    "Protein (g)": 0.39,
    "Fats (g)": 0.53,
    "Free Sugar (g)": 2.58,
    "Fibre (g)": 0.0,
    "Sodium (mg)": 3.12,
    "Calcium (mg)": 14.2,
    "Iron (mg)": 0.02,
    "Vitamin C (mg)": 0.5,
    "Folate (µg)": 1.8
  }
}
```

**Error Response (404):**
```json
{
  "error": "Dish not found"
}
```

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd foodapi_project
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

4. **Start the development server**
   ```bash
   python manage.py runserver
   ```

5. **Access the API**
   The API will be available at `http://127.0.0.1:8000/api/`

## Project Structure

```
foodapi_project/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── README.md                # This file
├── foodapi/                 # Main Django project
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── wsgi.py              # WSGI configuration
│   └── asgi.py              # ASGI configuration
└── nutrition/               # Django app for nutrition data
    ├── __init__.py
    ├── apps.py              # App configuration
    ├── views.py             # API views
    ├── urls.py              # App URL patterns
    └── static/              # Static files
        └── Indian_Food_Nutrition_Processed.csv
```

## Dependencies

- **Django 5.2.4**: Web framework
- **Django REST Framework 3.16.0**: REST API toolkit
- **pandas 2.3.0**: Data manipulation and CSV processing

## Technical Details

- **Data Loading**: The CSV file is loaded once at module import time using pandas
- **Data Structure**: Data is converted to a dictionary for O(1) lookup performance
- **Case Sensitivity**: Dish name matching is case-insensitive
- **Error Handling**: Returns appropriate HTTP status codes (200, 404)
- **Static Files**: CSV file is served from Django's static files system

## Example Usage

### Using curl
```bash
# Get welcome message
curl http://127.0.0.1:8000/api/

# Get all foods
curl http://127.0.0.1:8000/api/foods/

# Get nutrition data for a specific dish
curl "http://127.0.0.1:8000/api/food/Hot tea (Garam Chai)/"

# Case-insensitive search
curl "http://127.0.0.1:8000/api/food/hot tea (garam chai)/"
```

### Using Python requests
```python
import requests

# Get welcome message
response = requests.get('http://127.0.0.1:8000/api/')
print(response.json())

# Get all foods
response = requests.get('http://127.0.0.1:8000/api/foods/')
foods = response.json()['foods']
print(f"Total dishes: {len(foods)}")

# Get nutrition data
response = requests.get('http://127.0.0.1:8000/api/food/Hot tea (Garam Chai)/')
nutrition = response.json()
print(nutrition)
```

## Data Source

The API serves data from `Indian_Food_Nutrition_Processed.csv` which contains nutritional information for over 1000 Indian dishes including:

- Calories (kcal)
- Carbohydrates (g)
- Protein (g)
- Fats (g)
- Free Sugar (g)
- Fibre (g)
- Sodium (mg)
- Calcium (mg)
- Iron (mg)
- Vitamin C (mg)
- Folate (µg)

## Development

To extend this API:

1. **Add new endpoints**: Create new views in `nutrition/views.py` and add URL patterns in `nutrition/urls.py`
2. **Modify data processing**: Update the data loading logic in `nutrition/views.py`
3. **Add filtering**: Implement query parameters for filtering by nutritional values
4. **Add pagination**: Implement pagination for the foods list endpoint

## License

This project is for educational and demonstration purposes.
