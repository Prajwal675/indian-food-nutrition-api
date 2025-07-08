/**
 * Data models and utilities for Calorie Tracker integration
 * with Indian Food Nutrition API
 */

// Food Entry Model
export class FoodEntry {
  constructor(data) {
    this.id = data.id || Date.now();
    this.dishName = data.dishName;
    this.servings = data.servings || 1;
    this.mealType = data.mealType || 'breakfast'; // breakfast, lunch, dinner, snack
    this.nutrition = data.nutrition;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.calories = this.calculateCalories();
  }

  calculateCalories() {
    return (this.nutrition['Calories (kcal)'] || 0) * this.servings;
  }

  updateServings(newServings) {
    this.servings = newServings;
    this.calories = this.calculateCalories();
  }

  getNutritionValue(key) {
    return (this.nutrition[key] || 0) * this.servings;
  }

  toJSON() {
    return {
      id: this.id,
      dishName: this.dishName,
      servings: this.servings,
      mealType: this.mealType,
      nutrition: this.nutrition,
      timestamp: this.timestamp,
      calories: this.calories
    };
  }
}

// Daily Log Model
export class DailyLog {
  constructor(date = new Date()) {
    this.date = date.toISOString().split('T')[0];
    this.entries = [];
    this.calorieGoal = 2000;
    this.loadFromStorage();
  }

  addEntry(foodEntry) {
    this.entries.push(foodEntry);
    this.saveToStorage();
  }

  removeEntry(entryId) {
    this.entries = this.entries.filter(entry => entry.id !== entryId);
    this.saveToStorage();
  }

  updateEntry(entryId, updates) {
    const entryIndex = this.entries.findIndex(entry => entry.id === entryId);
    if (entryIndex !== -1) {
      Object.assign(this.entries[entryIndex], updates);
      if (updates.servings) {
        this.entries[entryIndex].updateServings(updates.servings);
      }
      this.saveToStorage();
    }
  }

  getEntriesByMeal(mealType) {
    return this.entries.filter(entry => entry.mealType === mealType);
  }

  getTotalCalories() {
    return this.entries.reduce((total, entry) => total + entry.calories, 0);
  }

  getTotalNutrition() {
    const totals = {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fats: 0,
      freeSugar: 0,
      fiber: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      folate: 0
    };

    this.entries.forEach(entry => {
      totals.calories += entry.calories;
      totals.carbohydrates += entry.getNutritionValue('Carbohydrates (g)');
      totals.protein += entry.getNutritionValue('Protein (g)');
      totals.fats += entry.getNutritionValue('Fats (g)');
      totals.freeSugar += entry.getNutritionValue('Free Sugar (g)');
      totals.fiber += entry.getNutritionValue('Fibre (g)');
      totals.sodium += entry.getNutritionValue('Sodium (mg)');
      totals.calcium += entry.getNutritionValue('Calcium (mg)');
      totals.iron += entry.getNutritionValue('Iron (mg)');
      totals.vitaminC += entry.getNutritionValue('Vitamin C (mg)');
      totals.folate += entry.getNutritionValue('Folate (µg)');
    });

    return totals;
  }

  getProgress() {
    const totalCalories = this.getTotalCalories();
    const percentage = (totalCalories / this.calorieGoal) * 100;
    
    return {
      totalCalories,
      calorieGoal: this.calorieGoal,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(this.calorieGoal - totalCalories, 0),
      exceeded: totalCalories > this.calorieGoal,
      status: this.getProgressStatus(percentage)
    };
  }

  getProgressStatus(percentage) {
    if (percentage < 50) return 'low';
    if (percentage < 80) return 'moderate';
    if (percentage <= 110) return 'good';
    return 'exceeded';
  }

  getMacroBreakdown() {
    const nutrition = this.getTotalNutrition();
    const totalMacros = nutrition.carbohydrates + nutrition.protein + nutrition.fats;
    
    if (totalMacros === 0) {
      return { carbs: 0, protein: 0, fats: 0 };
    }
    
    return {
      carbs: Math.round((nutrition.carbohydrates / totalMacros) * 100),
      protein: Math.round((nutrition.protein / totalMacros) * 100),
      fats: Math.round((nutrition.fats / totalMacros) * 100)
    };
  }

  clear() {
    this.entries = [];
    this.saveToStorage();
  }

  saveToStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`calorie-log-${this.date}`, JSON.stringify({
        entries: this.entries.map(entry => entry.toJSON()),
        calorieGoal: this.calorieGoal
      }));
    }
  }

  loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(`calorie-log-${this.date}`);
      if (saved) {
        const data = JSON.parse(saved);
        this.entries = data.entries.map(entryData => new FoodEntry(entryData));
        this.calorieGoal = data.calorieGoal || 2000;
      }
    }
  }

  setCalorieGoal(goal) {
    this.calorieGoal = goal;
    this.saveToStorage();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('calorie-goal', goal.toString());
    }
  }
}

// Nutrition API Client
export class NutritionAPIClient {
  constructor(baseURL = 'http://127.0.0.1:8000/api') {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  async searchFood(dishName) {
    // Check cache first
    const cacheKey = dishName.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/search/?dish=${encodeURIComponent(dishName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Food "${dishName}" not found`);
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Error searching food:', error);
      throw error;
    }
  }

  async getAllFoods() {
    try {
      const response = await fetch(`${this.baseURL}/foods/`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.foods;
    } catch (error) {
      console.error('Error getting all foods:', error);
      throw error;
    }
  }

  async getFoodSuggestions(query) {
    if (query.length < 2) return [];
    
    try {
      const allFoods = await this.getAllFoods();
      return allFoods
        .filter(food => food.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
}

// Meal Planning Utilities
export class MealPlanner {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.mealPlans = new Map();
  }

  async createMealPlan(targetCalories, preferences = {}) {
    const {
      mealCount = 3, // breakfast, lunch, dinner
      proteinRatio = 0.25,
      carbRatio = 0.45,
      fatRatio = 0.30
    } = preferences;

    const caloriesPerMeal = targetCalories / mealCount;
    const mealPlan = {
      targetCalories,
      meals: [],
      totalCalories: 0,
      totalNutrition: {}
    };

    // This is a simplified meal planning algorithm
    // In a real app, you'd have more sophisticated logic
    try {
      const allFoods = await this.apiClient.getAllFoods();
      const selectedFoods = this.selectBalancedFoods(allFoods, caloriesPerMeal, mealCount);
      
      mealPlan.meals = selectedFoods;
      mealPlan.totalCalories = selectedFoods.reduce((total, meal) => 
        total + meal.reduce((mealTotal, food) => mealTotal + food.calories, 0), 0
      );

      return mealPlan;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  }

  selectBalancedFoods(allFoods, caloriesPerMeal, mealCount) {
    // Simplified food selection logic
    // In a real app, you'd have more sophisticated algorithms
    const meals = [];
    const popularFoods = ['Naan', 'Chapati/Roti', 'Masala dosa', 'Idli', 'Sambar'];
    
    for (let i = 0; i < mealCount; i++) {
      meals.push([{
        name: popularFoods[i % popularFoods.length],
        calories: caloriesPerMeal,
        servings: 1
      }]);
    }
    
    return meals;
  }
}

// Export utility functions
export const CalorieTrackerUtils = {
  formatCalories: (calories) => Math.round(calories).toLocaleString(),
  
  formatNutrition: (value, unit) => `${Math.round(value * 10) / 10}${unit}`,
  
  getCalorieStatus: (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage < 50) return { status: 'low', color: '#ff6b6b' };
    if (percentage < 80) return { status: 'moderate', color: '#ffa500' };
    if (percentage <= 110) return { status: 'good', color: '#28a745' };
    return { status: 'exceeded', color: '#dc3545' };
  },
  
  calculateBMR: (weight, height, age, gender) => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  },
  
  calculateTDEE: (bmr, activityLevel) => {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  }
};
