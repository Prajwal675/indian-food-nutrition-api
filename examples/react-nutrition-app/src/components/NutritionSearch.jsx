import React, { useState, useEffect } from 'react';
import { useNutritionAPI } from '../hooks/useNutritionAPI';
import NutritionDisplay from './NutritionDisplay';

const NutritionSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { loading, error, searchNutrition, getAllFoods } = useNutritionAPI();

  // Load all foods on component mount
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const foods = await getAllFoods();
        setAllFoods(foods);
      } catch (err) {
        console.error('Failed to load foods:', err);
      }
    };
    loadFoods();
  }, [getAllFoods]);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = allFoods
        .filter(food => 
          food.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10); // Limit to 10 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, allFoods]);

  const handleSearch = async (dishName = searchTerm) => {
    if (!dishName.trim()) return;

    try {
      const data = await searchNutrition(dishName);
      setNutritionData(data);
      setShowSuggestions(false);
    } catch (err) {
      setNutritionData(null);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularDishes = [
    'Naan', 'Chapati/Roti', 'Masala dosa', 'Idli', 'Biryani',
    'Sambar', 'Rajmah curry', 'Aloo gobhi', 'Hot tea (Garam Chai)'
  ];

  return (
    <div className="nutrition-search">
      <div className="search-container">
        <h1>🍛 Indian Food Nutrition Finder</h1>
        
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a dish (e.g., Naan, Chapati/Roti)..."
            className="search-input"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={loading || !searchTerm.trim()}
            className="search-button"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-container">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {/* Popular dishes */}
        <div className="popular-dishes">
          <h3>Popular Dishes:</h3>
          <div className="popular-dishes-grid">
            {popularDishes.map((dish, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(dish)}
                className="popular-dish-button"
                disabled={loading}
              >
                {dish}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="loading-message">
          <p>🔍 Searching for nutrition data...</p>
        </div>
      )}

      {/* Nutrition results */}
      {nutritionData && !loading && (
        <NutritionDisplay data={nutritionData} />
      )}
    </div>
  );
};

export default NutritionSearch;
