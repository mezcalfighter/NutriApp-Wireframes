import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { Plus, X, GripVertical, Save } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  time: string;
  notes?: string;
}

interface FoodOption {
  id: string;
  name: string;
  portion: string;
}

interface FoodItem {
  id: string;
  isCategory: boolean; // true = category with options, false = specific food
  categoryType: string;
  specificFood?: string; // only used when isCategory = false
  quantity: string;
  unit: string;
  options?: FoodOption[]; // only used when isCategory = true
}

// Food categories with emojis
const FOOD_CATEGORIES = [
  { value: 'vegetables', emoji: '🥬', label: 'Verduras' },
  { value: 'fruits', emoji: '🍎', label: 'Frutas' },
  { value: 'proteins', emoji: '🍗', label: 'Proteínas' },
  { value: 'grains', emoji: '🌾', label: 'Granos' },
  { value: 'dairy', emoji: '🥛', label: 'Lácteos' },
  { value: 'legumes', emoji: '🫘', label: 'Leguminosas' },
  { value: 'fats', emoji: '🫒', label: 'Grasas' },
  { value: 'beverages', emoji: '☕', label: 'Bebidas' },
];

const UNITS = [
  { value: 'portions', label: 'porciones' },
  { value: 'grams', label: 'gramos' },
  { value: 'pieces', label: 'piezas' },
  { value: 'cups', label: 'tazas' },
  { value: 'tablespoons', label: 'cucharadas' },
];

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('14');
  
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Desayuno', time: '08:00' },
    { id: '2', name: 'Colación Mañana', time: '10:30' },
    { id: '3', name: 'Comida', time: '13:00' },
    { id: '4', name: 'Colación Tarde', time: '16:00' },
    { id: '5', name: 'Cena', time: '19:00' },
  ]);

  const [selectedMeal, setSelectedMeal] = useState<string>('1');
  const [foodItems, setFoodItems] = useState<Record<string, FoodItem[]>>({
    '1': [
      { 
        id: '1', 
        isCategory: true, 
        categoryType: 'grains', 
        quantity: '2', 
        unit: 'portions',
        options: [
          { id: '1', name: 'Avena', portion: '1 taza' },
          { id: '2', name: 'Pan integral', portion: '2 rebanadas' },
        ]
      },
      { id: '2', isCategory: false, categoryType: 'fruits', specificFood: 'Manzana', quantity: '1', unit: 'pieces' },
    ],
  });

  const updateMeal = (mealId: string, field: keyof Meal, value: string) => {
    setMeals(meals.map(meal => 
      meal.id === mealId ? { ...meal, [field]: value } : meal
    ));
  };

  const addFoodItem = (mealId: string) => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      isCategory: true,
      categoryType: 'vegetables',
      quantity: '',
      unit: 'portions',
      options: [],
    };
    setFoodItems({
      ...foodItems,
      [mealId]: [...(foodItems[mealId] || []), newItem],
    });
  };

  const removeFoodItem = (mealId: string, itemId: string) => {
    setFoodItems({
      ...foodItems,
      [mealId]: foodItems[mealId].filter(f => f.id !== itemId),
    });
  };

  const updateFoodItem = (mealId: string, itemId: string, updates: Partial<FoodItem>) => {
    setFoodItems({
      ...foodItems,
      [mealId]: foodItems[mealId].map(f => 
        f.id === itemId ? { ...f, ...updates } : f
      ),
    });
  };

  const addOption = (mealId: string, itemId: string) => {
    const item = foodItems[mealId].find(f => f.id === itemId);
    if (!item) return;

    const newOption: FoodOption = {
      id: Date.now().toString(),
      name: '',
      portion: '',
    };

    updateFoodItem(mealId, itemId, {
      options: [...(item.options || []), newOption],
    });
  };

  const removeOption = (mealId: string, itemId: string, optionId: string) => {
    const item = foodItems[mealId].find(f => f.id === itemId);
    if (!item) return;

    updateFoodItem(mealId, itemId, {
      options: (item.options || []).filter(o => o.id !== optionId),
    });
  };

  const updateOption = (mealId: string, itemId: string, optionId: string, field: keyof FoodOption, value: string) => {
    const item = foodItems[mealId].find(f => f.id === itemId);
    if (!item) return;

    updateFoodItem(mealId, itemId, {
      options: (item.options || []).map(o => 
        o.id === optionId ? { ...o, [field]: value } : o
      ),
    });
  };

  const getCategoryEmoji = (type: string) => {
    return FOOD_CATEGORIES.find(cat => cat.value === type)?.emoji || '🍽️';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/nutritionist/templates');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
      <Header title="Crear Plantilla" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Template Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white">Información de la Plantilla</h3>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Nombre *</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              placeholder="Nombre de la Plantilla"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-slate-900 dark:text-white"
              placeholder="Descripción de la Plantilla"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Duración (días)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="14"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Meal Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Comidas Diarias</h3>
          
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {meals.map((meal) => (
              <button
                key={meal.id}
                type="button"
                onClick={() => setSelectedMeal(meal.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedMeal === meal.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {meal.name}
              </button>
            ))}
          </div>

          {/* Food Items for Selected Meal */}
          <div className="space-y-3">
            {/* Meal Time and Notes */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">Hora</label>
                  <input
                    type="time"
                    value={meals.find(m => m.id === selectedMeal)?.time || ''}
                    onChange={(e) => updateMeal(selectedMeal, 'time', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">Notas</label>
                  <textarea
                    value={meals.find(m => m.id === selectedMeal)?.notes || ''}
                    onChange={(e) => updateMeal(selectedMeal, 'notes', e.target.value)}
                    placeholder="Ej: Tomar con abundante agua..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {(foodItems[selectedMeal] || []).map((item) => (
              <div key={item.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <GripVertical className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-2" />
                  <div className="flex-1 space-y-3">
                    {/* Category/Food Type Selection */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryEmoji(item.categoryType)}</span>
                      <select
                        value={item.categoryType}
                        onChange={(e) => updateFoodItem(selectedMeal, item.id, { categoryType: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      >
                        {FOOD_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle: Category vs Specific Food */}
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!item.isCategory}
                          onChange={(e) => updateFoodItem(selectedMeal, item.id, { 
                            isCategory: !e.target.checked,
                            specificFood: e.target.checked ? '' : undefined,
                            options: e.target.checked ? undefined : []
                          })}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-slate-600 dark:text-slate-400">Alimento específico</span>
                      </label>
                    </div>

                    {/* Specific Food Input (only shown when not category) */}
                    {!item.isCategory && (
                      <>
                        <input
                          type="text"
                          value={item.specificFood || ''}
                          onChange={(e) => updateFoodItem(selectedMeal, item.id, { specificFood: e.target.value })}
                          placeholder="Ej: Manzana, Plátano, Pollo..."
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                        />

                        {/* Quantity and Unit for Specific Food */}
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => updateFoodItem(selectedMeal, item.id, { quantity: e.target.value })}
                            placeholder="Cantidad"
                            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                          />
                          <select
                            value={item.unit}
                            onChange={(e) => updateFoodItem(selectedMeal, item.id, { unit: e.target.value })}
                            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                          >
                            {UNITS.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* Options for Category Mode */}
                    {item.isCategory && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-700 dark:text-slate-300">Opciones:</label>
                          <button
                            type="button"
                            onClick={() => addOption(selectedMeal, item.id)}
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Agregar opción
                          </button>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                          {(item.options || []).map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option.name}
                                onChange={(e) => updateOption(selectedMeal, item.id, option.id, 'name', e.target.value)}
                                placeholder="Nombre (ej: Manzana)"
                                className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                              />
                              <input
                                type="text"
                                value={option.portion}
                                onChange={(e) => updateOption(selectedMeal, item.id, option.id, 'portion', e.target.value)}
                                placeholder="Porción (ej: 1 pieza)"
                                className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(selectedMeal, item.id, option.id)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          {(!item.options || item.options.length === 0) && (
                            <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                              No hay opciones. Haz clic en "Agregar opción" para añadir.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFoodItem(selectedMeal, item.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addFoodItem(selectedMeal)}
              className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-5 h-5" />
              Agregar Alimento
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Plantilla
          </button>
        </div>
      </form>
    </div>
  );
}