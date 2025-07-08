from flask import Flask, render_template, request, jsonify
import requests
import os
from functools import lru_cache

app = Flask(__name__)

# Configuration
API_BASE_URL = os.getenv('NUTRITION_API_URL', 'http://127.0.0.1:8000/api')

class NutritionAPIClient:
    """Client for interacting with the Indian Food Nutrition API"""
    
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        # Set timeout for all requests
        self.session.timeout = 10
    
    def search_nutrition(self, dish_name):
        """Search for nutrition data by dish name"""
        try:
            response = self.session.get(
                f"{self.base_url}/search/",
                params={'dish': dish_name}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    def get_nutrition_by_name(self, dish_name):
        """Get nutrition data using the direct endpoint (for simple names)"""
        try:
            response = self.session.get(f"{self.base_url}/food/{dish_name}/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    @lru_cache(maxsize=1)
    def get_all_foods(self):
        """Get list of all available foods (cached)"""
        try:
            response = self.session.get(f"{self.base_url}/foods/")
            response.raise_for_status()
            return response.json()['foods']
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    def get_welcome_message(self):
        """Get API welcome message"""
        try:
            response = self.session.get(f"{self.base_url}/")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")

# Initialize API client
nutrition_client = NutritionAPIClient(API_BASE_URL)

@app.route('/')
def index():
    """Home page with search form"""
    try:
        # Get some popular dishes for the dropdown
        all_foods = nutrition_client.get_all_foods()
        popular_dishes = [
            'Naan', 'Chapati/Roti', 'Masala dosa', 'Idli', 'Biryani',
            'Sambar', 'Rajmah curry', 'Aloo gobhi', 'Hot tea (Garam Chai)'
        ]
        # Filter to only include dishes that exist in the API
        popular_dishes = [dish for dish in popular_dishes if dish in all_foods]
        
        return render_template('index.html', popular_dishes=popular_dishes)
    except Exception as e:
        return render_template('error.html', error=str(e))

@app.route('/search')
def search():
    """Search for nutrition data"""
    dish_name = request.args.get('dish', '').strip()
    
    if not dish_name:
        return render_template('error.html', error="Please provide a dish name")
    
    try:
        # Use search endpoint for better compatibility
        nutrition_data = nutrition_client.search_nutrition(dish_name)
        
        # Extract dish name and data
        actual_dish_name = list(nutrition_data.keys())[0]
        data = nutrition_data[actual_dish_name]
        
        return render_template('nutrition.html', 
                             dish_name=actual_dish_name, 
                             nutrition_data=data)
    
    except Exception as e:
        error_message = str(e)
        if "404" in error_message:
            error_message = f"Dish '{dish_name}' not found. Please check the spelling."
        return render_template('error.html', error=error_message)

@app.route('/api/search')
def api_search():
    """API endpoint for AJAX requests"""
    dish_name = request.args.get('dish', '').strip()
    
    if not dish_name:
        return jsonify({'error': 'Please provide a dish name'}), 400
    
    try:
        nutrition_data = nutrition_client.search_nutrition(dish_name)
        return jsonify(nutrition_data)
    except Exception as e:
        error_message = str(e)
        if "404" in error_message:
            return jsonify({'error': f"Dish '{dish_name}' not found"}), 404
        return jsonify({'error': error_message}), 500

@app.route('/api/foods')
def api_foods():
    """API endpoint to get all foods"""
    try:
        foods = nutrition_client.get_all_foods()
        return jsonify({'foods': foods})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/suggestions')
def api_suggestions():
    """API endpoint for autocomplete suggestions"""
    query = request.args.get('q', '').strip().lower()
    
    if len(query) < 2:
        return jsonify({'suggestions': []})
    
    try:
        all_foods = nutrition_client.get_all_foods()
        suggestions = [
            food for food in all_foods 
            if query in food.lower()
        ][:10]  # Limit to 10 suggestions
        
        return jsonify({'suggestions': suggestions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        welcome = nutrition_client.get_welcome_message()
        return jsonify({
            'status': 'healthy',
            'api_status': 'connected',
            'api_message': welcome.get('message', 'Unknown')
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'api_status': 'disconnected',
            'error': str(e)
        }), 503

@app.errorhandler(404)
def not_found(error):
    return render_template('error.html', error="Page not found"), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('error.html', error="Internal server error"), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
