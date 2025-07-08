import React, { useState } from 'react';
import { useCalorieTracker } from '../hooks/useCalorieTracker';
import FoodSearch from './FoodSearch';
import DailyProgress from './DailyProgress';
import MealLog from './MealLog';
import NutritionSummary from './NutritionSummary';

const CalorieTracker = () => {
  const {
    dailyLog,
    totalCalories,
    totalNutrition,
    calorieGoal,
    loading,
    error,
    addFood,
    removeFood,
    updateServings,
    updateCalorieGoal,
    getMealsByType,
    getProgress,
    getNutritionBreakdown,
    clearDailyLog
  } = useCalorieTracker();

  const [activeTab, setActiveTab] = useState('log');
  const [showGoalModal, setShowGoalModal] = useState(false);

  const progress = getProgress();
  const nutritionBreakdown = getNutritionBreakdown();

  const handleAddFood = async (dishName, servings, mealType) => {
    try {
      await addFood(dishName, servings, mealType);
    } catch (error) {
      console.error('Failed to add food:', error);
    }
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '15px'
    },
    title: {
      fontSize: '2.5em',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '1.1em',
      opacity: 0.9,
      margin: 0
    },
    tabs: {
      display: 'flex',
      marginBottom: '20px',
      borderBottom: '2px solid #e1e5e9'
    },
    tab: {
      padding: '12px 24px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      color: '#666',
      borderBottom: '3px solid transparent',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      color: '#667eea',
      borderBottomColor: '#667eea'
    },
    content: {
      minHeight: '400px'
    },
    quickActions: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '10px 20px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.3s ease'
    },
    dangerButton: {
      background: '#dc3545'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      maxWidth: '400px',
      width: '90%'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '15px'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #f5c6cb'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🍽️ Indian Food Calorie Tracker</h1>
        <p style={styles.subtitle}>
          Track your daily nutrition with authentic Indian dishes
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.quickActions}>
        <button 
          style={styles.button}
          onClick={() => setShowGoalModal(true)}
        >
          Set Goal ({calorieGoal} cal)
        </button>
        <button 
          style={{...styles.button, ...styles.dangerButton}}
          onClick={clearDailyLog}
        >
          Clear Today's Log
        </button>
        <div style={{marginLeft: 'auto', fontSize: '18px', fontWeight: 'bold'}}>
          Today: {totalCalories} / {calorieGoal} calories
        </div>
      </div>

      <DailyProgress 
        progress={progress}
        nutritionBreakdown={nutritionBreakdown}
      />

      <div style={styles.tabs}>
        {['log', 'add', 'nutrition', 'history'].map(tab => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 'log' && (
          <div>
            {mealTypes.map(mealType => (
              <MealLog
                key={mealType}
                mealType={mealType}
                entries={getMealsByType(mealType)}
                onRemoveFood={removeFood}
                onUpdateServings={updateServings}
              />
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <FoodSearch
            onAddFood={handleAddFood}
            loading={loading}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionSummary
            totalNutrition={totalNutrition}
            nutritionBreakdown={nutritionBreakdown}
            dailyLog={dailyLog}
          />
        )}

        {activeTab === 'history' && (
          <div style={{textAlign: 'center', padding: '50px'}}>
            <h3>History Feature</h3>
            <p>View your calorie tracking history over time</p>
            <p style={{color: '#666'}}>
              This feature would show weekly/monthly trends, 
              average daily intake, and progress towards goals.
            </p>
          </div>
        )}
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div style={styles.modal} onClick={() => setShowGoalModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Set Daily Calorie Goal</h3>
            <input
              type="number"
              placeholder="Enter calorie goal"
              defaultValue={calorieGoal}
              style={styles.input}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const newGoal = parseInt(e.target.value);
                  if (newGoal > 0) {
                    updateCalorieGoal(newGoal);
                    setShowGoalModal(false);
                  }
                }
              }}
            />
            <div style={{display: 'flex', gap: '10px'}}>
              <button
                style={styles.button}
                onClick={() => {
                  const input = document.querySelector('input[type="number"]');
                  const newGoal = parseInt(input.value);
                  if (newGoal > 0) {
                    updateCalorieGoal(newGoal);
                    setShowGoalModal(false);
                  }
                }}
              >
                Save Goal
              </button>
              <button
                style={{...styles.button, background: '#6c757d'}}
                onClick={() => setShowGoalModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieTracker;
