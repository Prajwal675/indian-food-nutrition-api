import { useState, useEffect, useCallback } from 'react';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const useCalorieTracker = () => {
  const [dailyLog, setDailyLog] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalNutrition, setTotalNutrition] = useState({});
  const [calorieGoal, setCalorieGoal] = useState(2000); // Default goal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load daily log from localStorage on component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedLog = localStorage.getItem(`calorie-log-${today}`);
    if (savedLog) {
      const log = JSON.parse(savedLog);
      setDailyLog(log);
      calculateTotals(log);
    }

    const savedGoal = localStorage.getItem('calorie-goal');
    if (savedGoal) {
      setCalorieGoal(parseInt(savedGoal));
    }
  }, []);

  // Save to localStorage whenever dailyLog changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`calorie-log-${today}`, JSON.stringify(dailyLog));
    calculateTotals(dailyLog);
  }, [dailyLog]);

  // Calculate total calories and nutrition
  const calculateTotals = useCallback((log) => {
    const totals = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fats: 0,
      fiber: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      folate: 0
    };

    log.forEach(entry => {
      const nutrition = entry.nutrition;
      const servings = entry.servings || 1;
      
      totals.calories += (nutrition['Calories (kcal)'] || 0) * servings;
      totals.carbs += (nutrition['Carbohydrates (g)'] || 0) * servings;
      totals.protein += (nutrition['Protein (g)'] || 0) * servings;
      totals.fats += (nutrition['Fats (g)'] || 0) * servings;
      totals.fiber += (nutrition['Fibre (g)'] || 0) * servings;
      totals.sodium += (nutrition['Sodium (mg)'] || 0) * servings;
      totals.calcium += (nutrition['Calcium (mg)'] || 0) * servings;
      totals.iron += (nutrition['Iron (mg)'] || 0) * servings;
      totals.vitaminC += (nutrition['Vitamin C (mg)'] || 0) * servings;
      totals.folate += (nutrition['Folate (µg)'] || 0) * servings;
    });

    setTotalCalories(Math.round(totals.calories));
    setTotalNutrition(totals);
  }, []);

  // Search for food nutrition
  const searchFood = useCallback(async (dishName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/search/?dish=${encodeURIComponent(dishName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Food "${dishName}" not found`);
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add food to daily log
  const addFood = useCallback(async (dishName, servings = 1, mealType = 'breakfast') => {
    try {
      const nutritionData = await searchFood(dishName);
      const actualDishName = Object.keys(nutritionData)[0];
      const nutrition = nutritionData[actualDishName];

      const logEntry = {
        id: Date.now(), // Simple ID generation
        dishName: actualDishName,
        servings: servings,
        mealType: mealType,
        nutrition: nutrition,
        timestamp: new Date().toISOString(),
        calories: (nutrition['Calories (kcal)'] || 0) * servings
      };

      setDailyLog(prev => [...prev, logEntry]);
      return logEntry;
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  }, [searchFood]);

  // Remove food from daily log
  const removeFood = useCallback((entryId) => {
    setDailyLog(prev => prev.filter(entry => entry.id !== entryId));
  }, []);

  // Update servings for an entry
  const updateServings = useCallback((entryId, newServings) => {
    setDailyLog(prev => prev.map(entry => 
      entry.id === entryId 
        ? { 
            ...entry, 
            servings: newServings,
            calories: (entry.nutrition['Calories (kcal)'] || 0) * newServings
          }
        : entry
    ));
  }, []);

  // Update calorie goal
  const updateCalorieGoal = useCallback((newGoal) => {
    setCalorieGoal(newGoal);
    localStorage.setItem('calorie-goal', newGoal.toString());
  }, []);

  // Get meals by type
  const getMealsByType = useCallback((mealType) => {
    return dailyLog.filter(entry => entry.mealType === mealType);
  }, [dailyLog]);

  // Get calorie progress
  const getProgress = useCallback(() => {
    const percentage = (totalCalories / calorieGoal) * 100;
    const remaining = calorieGoal - totalCalories;
    
    return {
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      exceeded: totalCalories > calorieGoal,
      onTrack: percentage >= 80 && percentage <= 110
    };
  }, [totalCalories, calorieGoal]);

  // Clear daily log
  const clearDailyLog = useCallback(() => {
    setDailyLog([]);
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`calorie-log-${today}`);
  }, []);

  // Get nutrition breakdown percentages
  const getNutritionBreakdown = useCallback(() => {
    const totalMacros = totalNutrition.carbs + totalNutrition.protein + totalNutrition.fats;
    
    if (totalMacros === 0) return { carbs: 0, protein: 0, fats: 0 };
    
    return {
      carbs: Math.round((totalNutrition.carbs / totalMacros) * 100),
      protein: Math.round((totalNutrition.protein / totalMacros) * 100),
      fats: Math.round((totalNutrition.fats / totalMacros) * 100)
    };
  }, [totalNutrition]);

  return {
    // State
    dailyLog,
    totalCalories,
    totalNutrition,
    calorieGoal,
    loading,
    error,
    
    // Actions
    searchFood,
    addFood,
    removeFood,
    updateServings,
    updateCalorieGoal,
    clearDailyLog,
    
    // Computed values
    getMealsByType,
    getProgress,
    getNutritionBreakdown
  };
};
