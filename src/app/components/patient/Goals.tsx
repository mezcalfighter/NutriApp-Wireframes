import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Target, Plus, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  completed: boolean;
  category: 'weight' | 'habits' | 'nutrition' | 'exercise' | 'other';
}

export default function PatientGoals() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Perder Peso',
      targetValue: 75,
      currentValue: 82,
      unit: 'kg',
      deadline: '2026-04-30',
      completed: false,
      category: 'weight',
    },
    {
      id: '2',
      title: 'Tomar 2L de Agua Diario',
      targetValue: 7,
      currentValue: 4,
      unit: 'días/semana',
      deadline: '2026-03-01',
      completed: false,
      category: 'habits',
    },
    {
      id: '3',
      title: 'Comer 5 Porciones de Verduras',
      targetValue: 5,
      currentValue: 5,
      unit: 'días/semana',
      deadline: '2026-02-15',
      completed: true,
      category: 'nutrition',
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetValue: '',
    currentValue: '',
    unit: 'kg',
    deadline: '',
    category: 'weight' as Goal['category'],
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: parseFloat(newGoal.currentValue),
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      completed: false,
      category: newGoal.category,
    };
    setGoals([goal, ...goals]);
    setNewGoal({
      title: '',
      targetValue: '',
      currentValue: '',
      unit: 'kg',
      deadline: '',
      category: 'weight',
    });
    setShowAddModal(false);
  };

  const toggleComplete = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateProgress = (id: string, value: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, currentValue: value } : g));
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'weight':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'habits':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'nutrition':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'exercise':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  const getCategoryLabel = (category: Goal['category']) => {
    switch (category) {
      case 'weight': return 'Peso';
      case 'habits': return 'Hábitos';
      case 'nutrition': return 'Nutrición';
      case 'exercise': return 'Ejercicio';
      default: return 'Otro';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Mis Metas" showBack showMenu />

      <div className="p-4 space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{activeGoals.length}</h2>
              <p className="text-emerald-100">Metas Activas</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{completedGoals.length}</h2>
              <p className="text-emerald-100">Completadas</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 bg-white rounded-full transition-all"
              style={{
                width: `${goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Add Goal Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Nueva Meta
        </button>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <h3 className="text-slate-900 dark:text-white mb-3">Metas Activas</h3>
            <div className="space-y-3">
              {activeGoals.map((goal) => {
                const progress = goal.category === 'weight' 
                  ? ((goal.currentValue - goal.targetValue) / (goal.currentValue - goal.targetValue)) * 100
                  : (goal.currentValue / goal.targetValue) * 100;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={goal.id}
                    className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                              goal.category
                            )}`}
                          >
                            {getCategoryLabel(goal.category)}
                          </span>
                        </div>
                        <h4 className="text-slate-900 dark:text-white mb-1">{goal.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Meta: {goal.targetValue}{goal.unit} • {daysLeft} días restantes
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleComplete(goal.id)}
                          className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={goal.currentValue}
                          onChange={(e) => updateProgress(goal.id, parseFloat(e.target.value))}
                          step="0.1"
                          className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          de {goal.targetValue}{goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h3 className="text-slate-900 dark:text-white mb-3">Metas Completadas</h3>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-slate-900 dark:text-white line-through">
                          {goal.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {goal.targetValue}{goal.unit} alcanzado
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleComplete(goal.id)}
                      className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Circle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm text-center">
            <Target className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-2">No tienes metas creadas</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Agrega tus primeras metas para comenzar tu viaje
            </p>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-slate-900 dark:text-white mb-4">Nueva Meta</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">
                  Categoría
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="weight">Peso</option>
                  <option value="habits">Hábitos</option>
                  <option value="nutrition">Nutrición</option>
                  <option value="exercise">Ejercicio</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">
                  Título de la Meta
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  placeholder="ej: Perder 5kg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-2">
                    Valor Actual
                  </label>
                  <input
                    type="number"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-2">
                    Valor Meta
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">Unidad</label>
                <select
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="días/semana">Días por semana</option>
                  <option value="litros">Litros</option>
                  <option value="porciones">Porciones</option>
                  <option value="minutos">Minutos</option>
                  <option value="veces/semana">Veces por semana</option>
                  <option value="%">Porcentaje (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">
                  Fecha Límite
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Crear Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MobileNav role="patient" />
    </div>
  );
}
