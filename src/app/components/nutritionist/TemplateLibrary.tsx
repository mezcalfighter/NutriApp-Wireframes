import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Search, Plus, Edit, Copy, Trash2 } from 'lucide-react';
import { useAuth } from '../../App';

export default function TemplateLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';

  const templates = [
    {
      id: '1',
      name: 'Weight Loss - Low Carb',
      description: 'High protein, low carbohydrate diet for weight loss',
      calories: 1500,
      duration: '14 days',
      meals: 5,
    },
    {
      id: '2',
      name: 'Diabetes Management',
      description: 'Balanced diet for blood sugar control',
      calories: 1800,
      duration: '14 days',
      meals: 6,
    },
    {
      id: '3',
      name: 'Muscle Gain',
      description: 'High protein and calorie diet for muscle building',
      calories: 2500,
      duration: '14 days',
      meals: 6,
    },
    {
      id: '4',
      name: 'Mediterranean Diet',
      description: 'Heart-healthy Mediterranean-style eating plan',
      calories: 2000,
      duration: '14 days',
      meals: 5,
    },
  ];

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Diet Templates" showNotifications showMenu role="nutritionist" isStudentsAccount={isStudentsAccount} />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Create New Template Button */}
        <button
          onClick={() => navigate('/nutritionist/templates/create')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Template
        </button>

        {/* Templates Count */}
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Templates List */}
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="text-slate-900 dark:text-white mb-1">{template.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{template.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Calories</p>
                  <p className="text-slate-900 dark:text-white">{template.calories}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="text-slate-900 dark:text-white">{template.duration}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Meals/day</p>
                  <p className="text-slate-900 dark:text-white">{template.meals}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/nutritionist/templates/${template.id}/edit`)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No templates found</p>
          </div>
        )}
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}