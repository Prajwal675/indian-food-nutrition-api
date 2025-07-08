import React, { useState, useEffect } from 'react';

const FoodSearch = ({ onAddFood, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState('breakfast');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Popular Indian dishes for quick access
  const popularDishes = [
    'Naan', 'Chapati/Roti', 'Masala dosa', 'Idli', 'Sambar',
    'Rajmah curry', 'Aloo gobhi', 'Biryani', 'Hot tea (Garam Chai)',
    'Makki ki roti', 'Instant coffee', 'Paratha'
  ];

  // Fetch suggestions from API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/foods/`);
        const data = await response.json();
        
        const filtered = data.foods
          .filter(food => food.toLowerCase().includes(searchTerm.toLowerCase()))
          .slice(0, 8);
        
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      await onAddFood(searchTerm, servings, mealType);
      setSearchTerm('');
      setServings(1);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleQuickAdd = async (dishName) => {
    try {
      await onAddFood(dishName, 1, mealType);
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const styles = {
    container: {
      background: '#f8f9fa',
      padding: '30px',
      borderRadius: '15px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    title: {
      fontSize: '1.8em',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center'
    },
    form: {
      marginBottom: '30px'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease'
    },
    inputFocus: {
      borderColor: '#667eea',
      outline: 'none'
    },
    searchContainer: {
      position: 'relative'
    },
    suggestions: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'white',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    suggestion: {
      padding: '12px',
      cursor: 'pointer',
      borderBottom: '1px solid #f1f3f4',
      transition: 'background-color 0.2s ease'
    },
    suggestionHover: {
      backgroundColor: '#f8f9fa'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr auto',
      gap: '15px',
      alignItems: 'end'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: 'white'
    },
    button: {
      padding: '12px 24px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background 0.3s ease',
      whiteSpace: 'nowrap'
    },
    buttonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed'
    },
    popularSection: {
      marginTop: '30px'
    },
    popularGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '10px',
      marginTop: '15px'
    },
    popularButton: {
      padding: '12px',
      background: 'white',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    popularButtonHover: {
      borderColor: '#667eea',
      background: '#f8f9ff'
    },
    loading: {
      textAlign: 'center',
      color: '#667eea',
      fontStyle: 'italic',
      padding: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Add Food to Your Log</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Search for a dish:</label>
          <div style={styles.searchContainer}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type dish name (e.g., Naan, Chapati/Roti, Masala dosa)"
              style={styles.input}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div style={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={styles.suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            
            {searchLoading && (
              <div style={styles.loading}>Searching...</div>
            )}
          </div>
        </div>

        <div style={styles.formRow}>
          <div>
            <label style={styles.label}>Servings:</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={servings}
              onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
              style={styles.input}
            />
          </div>
          
          <div>
            <label style={styles.label}>Meal:</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              style={styles.select}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              style={{
                ...styles.button,
                ...(loading || !searchTerm.trim() ? styles.buttonDisabled : {})
              }}
            >
              {loading ? 'Adding...' : 'Add Food'}
            </button>
          </div>
        </div>
      </form>

      <div style={styles.popularSection}>
        <h3 style={{...styles.label, fontSize: '1.2em', marginBottom: '15px'}}>
          🌟 Popular Indian Dishes:
        </h3>
        <div style={styles.popularGrid}>
          {popularDishes.map((dish, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd(dish)}
              disabled={loading}
              style={{
                ...styles.popularButton,
                ...(loading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#f8f9ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.background = 'white';
                }
              }}
            >
              {dish}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;
