import { useNavigate, useParams } from 'react-router';
import Header from '../shared/Header';
import { Calendar, TrendingDown } from 'lucide-react';

export default function ViewPatientDiet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentDiet = {
    name: 'Weight Loss - Low Carb',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    calories: 1500,
  };

  const meals = [
    {
      name: '🍳 Breakfast',
      time: '08:00',
      foods: [
        { name: '🥣 Oatmeal', quantity: '100g', calories: 350 },
        { name: '🍌 Banana', quantity: '1 medium', calories: 105 },
      ],
    },
    {
      name: '🍽️ Lunch',
      time: '13:00',
      foods: [
        { name: '🍗 Grilled Chicken', quantity: '150g', calories: 250 },
        { name: '🥗 Mixed Vegetables', quantity: '200g', calories: 100 },
      ],
    },
  ];

  const progress = [
    { date: '2024-01-01', weight: 70.5 },
    { date: '2024-01-03', weight: 70.0 },
    { date: '2024-01-05', weight: 69.5 },
    { date: '2024-01-07', weight: 69.0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      <Header title="Current Diet Plan" showBack />

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <h2 className="text-white mb-2">{currentDiet.name}</h2>
          <div className="flex items-center gap-2 text-emerald-100 mb-4">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(currentDiet.startDate).toLocaleDateString()} -{' '}
              {new Date(currentDiet.endDate).toLocaleDateString()}
            </span>
          </div>
          <p className="text-white">{currentDiet.calories} cal/day</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">Weight Progress</h3>
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-2">
            {progress.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-slate-600">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-slate-900">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 mb-4">Daily Meal Plan</h3>
          <div className="space-y-4">
            {meals.map((meal, idx) => (
              <div key={idx} className="pb-4 last:pb-0 last:border-0 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-slate-900">{meal.name}</h4>
                  <span className="text-slate-500">{meal.time}</span>
                </div>
                <div className="space-y-2">
                  {meal.foods.map((food, foodIdx) => (
                    <div
                      key={foodIdx}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="text-slate-900">{food.name}</p>
                        <p className="text-slate-500">{food.quantity}</p>
                      </div>
                      <span className="text-emerald-600">{food.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(`/nutritionist/patients/${id}/assign-diet`)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          Update Diet Plan
        </button>
      </div>
    </div>
  );
}