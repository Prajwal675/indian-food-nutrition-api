import React from 'react';

const NutritionDisplay = ({ data }) => {
  if (!data) return null;

  // Get the dish name and nutrition data
  const dishName = Object.keys(data)[0];
  const nutritionData = data[dishName];

  // Define nutrition categories with colors
  const nutritionCategories = {
    'Calories (kcal)': { color: '#ff6b6b', icon: '🔥' },
    'Carbohydrates (g)': { color: '#4ecdc4', icon: '🍞' },
    'Protein (g)': { color: '#45b7d1', icon: '💪' },
    'Fats (g)': { color: '#f9ca24', icon: '🥑' },
    'Free Sugar (g)': { color: '#f0932b', icon: '🍯' },
    'Fibre (g)': { color: '#6c5ce7', icon: '🌾' },
    'Sodium (mg)': { color: '#fd79a8', icon: '🧂' },
    'Calcium (mg)': { color: '#00b894', icon: '🦴' },
    'Iron (mg)': { color: '#e17055', icon: '⚡' },
    'Vitamin C (mg)': { color: '#fdcb6e', icon: '🍊' },
    'Folate (µg)': { color: '#a29bfe', icon: '🥬' },
  };

  const styles = {
    container: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    dishName: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2d3436',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '16px',
      color: '#636e72',
      margin: 0,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '20px',
    },
    nutritionCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    },
    nutritionCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    icon: {
      fontSize: '24px',
      marginBottom: '8px',
    },
    value: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '8px 0 4px 0',
    },
    label: {
      fontSize: '12px',
      color: '#636e72',
      fontWeight: '500',
    },
    summary: {
      backgroundColor: '#f1f2f6',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
      textAlign: 'center',
    },
    summaryText: {
      fontSize: '14px',
      color: '#2d3436',
      margin: 0,
    }
  };

  // Calculate total macronutrients
  const totalMacros = (nutritionData['Carbohydrates (g)'] || 0) + 
                     (nutritionData['Protein (g)'] || 0) + 
                     (nutritionData['Fats (g)'] || 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.dishName}>{dishName}</h2>
        <p style={styles.subtitle}>Nutritional Information per serving</p>
      </div>

      <div style={styles.grid}>
        {Object.entries(nutritionData).map(([key, value]) => {
          const category = nutritionCategories[key] || { color: '#74b9ff', icon: '📊' };
          
          return (
            <div
              key={key}
              style={{
                ...styles.nutritionCard,
                borderLeft: `4px solid ${category.color}`,
              }}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, styles.nutritionCardHover);
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={styles.icon}>{category.icon}</div>
              <div style={{ ...styles.value, color: category.color }}>
                {value || 'N/A'}
              </div>
              <div style={styles.label}>{key}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.summary}>
        <p style={styles.summaryText}>
          <strong>Quick Summary:</strong> This dish contains {nutritionData['Calories (kcal)'] || 'N/A'} calories
          {totalMacros > 0 && ` with ${totalMacros.toFixed(1)}g total macronutrients`}
        </p>
      </div>
    </div>
  );
};

export default NutritionDisplay;
