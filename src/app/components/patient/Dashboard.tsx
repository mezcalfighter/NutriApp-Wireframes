import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { FileText, TrendingDown, Calendar, Target, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function PatientDashboard() {
  const navigate = useNavigate();

  const todaysMeals = [
    { name: '🍳 Desayuno', time: '08:00', completed: true },
    { name: '🍎 Colación Matutina', time: '10:30', completed: true },
    { name: '🍽️ Comida', time: '13:00', completed: false },
    { name: '🥤 Colación Vespertina', time: '16:00', completed: false },
    { name: '🍲 Cena', time: '19:00', completed: false },
  ];

  const accessLog = [
    { id: 1, nutritionist: 'Lic. Andrea Martínez', date: '2026-09-24', time: '10:30', action: 'Consulta' },
    { id: 2, nutritionist: 'Lic. Andrea Martínez', date: '2026-09-22', time: '09:15', action: 'Modificación' },
    { id: 3, nutritionist: 'Lic. Andrea Martínez', date: '2026-09-15', time: '16:45', action: 'Descarga' },
    { id: 4, nutritionist: 'Lic. Andrea Martínez', date: '2026-09-08', time: '11:00', action: 'Consulta' },
  ];

  const getActionChip = (action: string) => {
    if (action === 'Consulta') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {action}
        </span>
      );
    }
    if (action === 'Modificación') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {action}
        </span>
      );
    }
    if (action === 'Descarga') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
        {action}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Inicio" showNotifications showMenu />

      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <h2 className="mb-2">¡Hola, Paciente!</h2>
          <p className="text-emerald-50 mb-4">¡Sigue así con el buen trabajo!</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
              <p className="text-emerald-50 mb-1">Peso Actual</p>
              <p className="text-2xl">78.5 kg</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
              <p className="text-emerald-50 mb-1">Peso Objetivo</p>
              <p className="text-2xl">75 kg</p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl text-emerald-600 dark:text-emerald-400 mb-1">1800</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Meta Diaria de Calorías</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl text-blue-600 dark:text-blue-400 mb-1">21</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">Días en el Plan</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl text-purple-600 dark:text-purple-400 mb-1">7</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">días restantes</div>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white">Comidas de Hoy</h3>
            <button
              onClick={() => navigate('/patient/diet')}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm"
            >
              Ver Plan Completo
            </button>
          </div>
          <div className="space-y-3">
            {todaysMeals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      meal.completed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {meal.completed ? '✓' : '○'}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white">{meal.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{meal.time}</p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1 rounded-lg text-sm ${
                    meal.completed
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {meal.completed ? 'Completado' : 'Marcar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white">Tu Progreso</h3>
            <button
              onClick={() => navigate('/patient/progress')}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm"
            >
              Ver Detalles
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <TrendingDown className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-2xl text-slate-900 dark:text-white mb-1">-3.5 kg</p>
              <p className="text-slate-600 dark:text-slate-400">¡Has perdido 3.5 kg en los últimos 21 días!</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/patient/diet')}
            className="bg-white dark:bg-slate-900 hover:shadow-md rounded-xl p-4 shadow-sm transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-slate-900 dark:text-white">Mi Dieta</p>
          </button>
          <button
            onClick={() => navigate('/patient/goals')}
            className="bg-white dark:bg-slate-900 hover:shadow-md rounded-xl p-4 shadow-sm transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-slate-900 dark:text-white">Mis Metas</p>
          </button>
          <button
            onClick={() => navigate('/patient/progress')}
            className="bg-white dark:bg-slate-900 hover:shadow-md rounded-xl p-4 shadow-sm transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-slate-900 dark:text-white">Mi Progreso</p>
          </button>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="bg-white dark:bg-slate-900 hover:shadow-md rounded-xl p-4 shadow-sm transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-slate-900 dark:text-white">Agendar Cita</p>
          </button>
        </div>

        {/* Next Appointment */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-4">Próxima Cita</h3>
          <div className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-900 dark:text-white mb-1">Consulta de Seguimiento</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Viernes, 26 de Enero - 10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Quién ha visto mi expediente */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-slate-900 dark:text-white">Quién ha visto mi expediente</h3>
            </div>
          </div>

          <div className="space-y-3">
            {accessLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-medium">
                    {entry.nutritionist}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    {new Date(entry.date).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {entry.time}
                  </p>
                </div>
                {getActionChip(entry.action)}
              </div>
            ))}
          </div>

          <button
            onClick={() => toast.info('Esta función estará disponible próximamente')}
            className="w-full mt-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Ver historial completo
          </button>
        </div>
      </div>

      <MobileNav role="patient" />
    </div>
  );
}
