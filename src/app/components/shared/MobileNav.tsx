import { useNavigate, useLocation } from 'react-router';
import { Home, Calendar, Users, Folder, User, Activity, FileText, Palette, MoreHorizontal, Lock } from 'lucide-react';

interface MobileNavProps {
  role: 'nutritionist' | 'patient';
  isStudentsAccount?: boolean;
}

export default function MobileNav({ role, isStudentsAccount = false }: MobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Features not available in Students plan
  const studentsDisabledPaths = [
    '/nutritionist/appointments',
  ];

  const nutritionistNav = [
    { icon: Home, label: 'Inicio', path: '/nutritionist/dashboard', disabled: false },
    { icon: Users, label: 'Pacientes', path: '/nutritionist/patients', disabled: false },
    { icon: Calendar, label: 'Agenda', path: '/nutritionist/appointments', disabled: isStudentsAccount },
    { icon: Folder, label: 'Plantillas', path: '/nutritionist/templates', disabled: false },
    { icon: MoreHorizontal, label: 'Más', path: '/nutritionist/more', disabled: false },
  ];

  const patientNav = [
    { icon: Home, label: 'Inicio', path: '/patient/dashboard', disabled: false },
    { icon: FileText, label: 'Dieta', path: '/patient/diet', disabled: false },
    { icon: Activity, label: 'Progreso', path: '/patient/progress', disabled: false },
    { icon: Calendar, label: 'Citas', path: '/patient/appointments', disabled: false },
    { icon: User, label: 'Perfil', path: '/patient/profile', disabled: false },
  ];

  const navItems = role === 'nutritionist' ? nutritionistNav : patientNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 safe-area-inset-bottom z-50">
      <div className="max-w-screen-xl mx-auto px-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.path}
                onClick={() => !isDisabled && navigate(item.path)}
                disabled={isDisabled}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors relative ${
                  isDisabled
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                    : isActive
                    ? 'text-emerald-500'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isDisabled && (
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-slate-400 dark:text-slate-600" />
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}