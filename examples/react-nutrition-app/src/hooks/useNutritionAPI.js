// Custom React hook for Indian Food Nutrition API
import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const useNutritionAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search for nutrition data
  const searchNutrition = useCallback(async (dishName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/search/?dish=${encodeURIComponent(dishName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Dish "${dishName}" not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
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

  // Get all foods
  const getAllFoods = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/foods/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.foods;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get nutrition by exact dish name (for simple names without special characters)
  const getNutritionByName = useCallback(async (dishName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/food/${encodeURIComponent(dishName)}/`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Dish "${dishName}" not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
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

  return {
    loading,
    error,
    searchNutrition,
    getAllFoods,
    getNutritionByName,
  };
};
