import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import PDFPreviewModal from '../shared/PDFPreviewModal';
import { Calendar, Download, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function CurrentDiet() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const dietPlan = {
    name: 'Weight Loss - Low Carb',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    totalCalories: 1500,
    nutritionist: 'Lic. Andrea Martínez',
    notes: 'Focus on protein-rich foods and avoid processed carbohydrates. Drink plenty of water throughout the day.',
  };

  const meals = [
    {
      name: '🍳 Breakfast',
      time: '08:00',
      foods: [
        { name: '🥣 Oatmeal with berries', quantity: '100g', calories: 350, protein: 10, carbs: 60, fats: 6 },
        { name: '☕ Green tea', quantity: '1 cup', calories: 0, protein: 0, carbs: 0, fats: 0 },
      ],
    },
    {
      name: '🍎 Morning Snack',
      time: '10:30',
      foods: [
        { name: '🥛 Greek yogurt', quantity: '150g', calories: 100, protein: 17, carbs: 6, fats: 0 },
        { name: '🌰 Almonds', quantity: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 },
      ],
    },
    {
      name: '🍽️ Lunch',
      time: '13:00',
      foods: [
        { name: '🍗 Grilled chicken breast', quantity: '150g', calories: 250, protein: 47, carbs: 0, fats: 5 },
        { name: '🥗 Mixed salad', quantity: '200g', calories: 50, protein: 2, carbs: 10, fats: 0 },
        { name: '🫒 Olive oil dressing', quantity: '1 tbsp', calories: 120, protein: 0, carbs: 0, fats: 14 },
      ],
    },
    {
      name: '🥤 Afternoon Snack',
      time: '16:00',
      foods: [
        { name: '🍏 Apple', quantity: '1 medium', calories: 95, protein: 0, carbs: 25, fats: 0 },
        { name: '🥜 Peanut butter', quantity: '1 tbsp', calories: 95, protein: 4, carbs: 3, fats: 8 },
      ],
    },
    {
      name: '🍲 Dinner',
      time: '19:00',
      foods: [
        { name: '🐟 Baked salmon', quantity: '150g', calories: 280, protein: 39, carbs: 0, fats: 13 },
        { name: '🥦 Steamed broccoli', quantity: '150g', calories: 50, protein: 4, carbs: 10, fats: 0 },
        { name: '🌾 Quinoa', quantity: '100g', calories: 120, protein: 4, carbs: 21, fats: 2 },
      ],
    },
  ];

  const totalNutrition = meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fats += food.fats;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="My Diet Plan" showMenu />

      <div className="p-4 space-y-4">
        {/* Diet Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <h2 className="text-white mb-2">{dietPlan.name}</h2>
          <div className="flex items-center gap-2 text-emerald-100 mb-4">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(dietPlan.startDate).toLocaleDateString()} -{' '}
              {new Date(dietPlan.endDate).toLocaleDateString()}
            </span>
          </div>
          <p className="text-emerald-100 mb-1">Prescribed by</p>
          <p className="text-white">{dietPlan.nutritionist}</p>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Daily Nutrition</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-1">Calories</p>
              <p className="text-emerald-600 dark:text-emerald-400">{totalNutrition.calories}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-1">Protein</p>
              <p className="text-emerald-600 dark:text-emerald-400">{totalNutrition.protein}g</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-1">Carbs</p>
              <p className="text-emerald-600 dark:text-emerald-400">{totalNutrition.carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-1">Fats</p>
              <p className="text-emerald-600 dark:text-emerald-400">{totalNutrition.fats}g</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {dietPlan.notes && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <h4 className="text-emerald-900 dark:text-emerald-100 mb-2">Nutritionist's Notes</h4>
            <p className="text-emerald-800 dark:text-emerald-200">{dietPlan.notes}</p>
          </div>
        )}

        {/* Day Selector */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Select Day</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-4">Meal Plan - Day {selectedDay}</h3>
          <div className="space-y-4">
            {meals.map((meal, idx) => (
              <div key={idx} className="pb-4 last:pb-0 last:border-0 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-slate-900 dark:text-white">{meal.name}</h4>
                  <span className="text-slate-500 dark:text-slate-400">{meal.time}</span>
                </div>
                <div className="space-y-2">
                  {meal.foods.map((food, foodIdx) => (
                    <div
                      key={foodIdx}
                      className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-slate-900 dark:text-white">{food.name}</p>
                          <p className="text-slate-500 dark:text-slate-400">{food.quantity}</p>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400">{food.calories} cal</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Protein: </span>
                          <span className="text-slate-700 dark:text-slate-300">{food.protein}g</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Carbs: </span>
                          <span className="text-slate-700 dark:text-slate-300">{food.carbs}g</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Fats: </span>
                          <span className="text-slate-700 dark:text-slate-300">{food.fats}g</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button
          className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          onClick={() => setShowPDFModal(true)}
        >
          <Download className="w-5 h-5" />
          Download Meal Plan
        </button>
      </div>

      <MobileNav role="patient" />

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        dietPlan={dietPlan}
        meals={meals}
      />
    </div>
  );
}