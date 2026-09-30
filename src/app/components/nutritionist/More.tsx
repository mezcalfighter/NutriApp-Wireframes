import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { DollarSign, Settings, Palette, User, ChevronRight, Calendar, Newspaper, CreditCard, Lock } from 'lucide-react';
import { useAuth } from '../../App';

export default function More() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';

  const allMenuItems = [
    {
      icon: Newspaper,
      title: 'Feed Social',
      description: 'Publica para tus pacientes',
      path: '/nutritionist/community',
      color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
      studentsDisabled: true,
    },
    {
      icon: Calendar,
      title: 'Gestión de Citas',
      description: 'Ver y administrar citas',
      path: '/nutritionist/appointments-manager',
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      studentsDisabled: true,
    },
    {
      icon: DollarSign,
      title: 'Finanzas',
      description: 'Ingresos y proyecciones',
      path: '/nutritionist/finances',
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      studentsDisabled: true,
    },
    {
      icon: CreditCard,
      title: 'Planes y Precios',
      description: isStudentsAccount ? 'Actualizar a plan completo' : 'Ver planes disponibles',
      path: '/pricing',
      color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      studentsDisabled: false,
    },
    {
      icon: Settings,
      title: 'Configuración',
      description: 'Métricas, cupones y precios',
      path: '/nutritionist/settings',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      studentsDisabled: false,
    },
    {
      icon: Palette,
      title: 'Branding',
      description: 'Logo y marca personal',
      path: '/nutritionist/branding',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      studentsDisabled: true,
    },
    {
      icon: User,
      title: 'Perfil',
      description: 'Información personal',
      path: '/nutritionist/profile',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      studentsDisabled: false,
    },
  ];

  // Filter out disabled items for Students accounts (hide completely)
  const menuItems = isStudentsAccount
    ? allMenuItems.filter(item => !item.studentsDisabled)
    : allMenuItems;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Más Opciones" showMenu />

      <div className="p-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
            </button>
          );
        })}
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}