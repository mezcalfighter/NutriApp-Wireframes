import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { Users, UserCog, Shield, AlertTriangle, Activity, TrendingUp, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateNutritionists, generatePatients } from '../../utils/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [totalNutritionists, setTotalNutritionists] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [suspendedNutritionists, setSuspendedNutritionists] = useState(0);
  const [suspendedPatients, setSuspendedPatients] = useState(0);

  useEffect(() => {
    // Generate data to get accurate counts
    const nutritionists = generateNutritionists(15);
    const patients = generatePatients(120, nutritionists);

    setTotalNutritionists(nutritionists.length);
    setTotalPatients(patients.length);
    setSuspendedNutritionists(nutritionists.filter(n => n.status === 'suspended').length);
    setSuspendedPatients(patients.filter(p => p.status === 'suspended').length);
  }, []);

  const totalSuspended = suspendedNutritionists + suspendedPatients;
  const totalActive = (totalNutritionists - suspendedNutritionists) + (totalPatients - suspendedPatients);
  const activePercentage = totalActive > 0 ? Math.round((totalActive / (totalNutritionists + totalPatients)) * 100) : 0;

  const stats = [
    {
      id: 'nutritionists',
      label: 'Nutricionistas',
      value: totalNutritionists,
      change: '+2 este mes',
      icon: UserCog,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'patients',
      label: 'Pacientes',
      value: totalPatients,
      change: '+34 este mes',
      icon: Users,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'suspended',
      label: 'Cuentas Suspendidas',
      value: totalSuspended,
      change: `${suspendedNutritionists} nutricionistas, ${suspendedPatients} pacientes`,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      id: 'active',
      label: 'Usuarios Activos Hoy',
      value: totalActive,
      change: `${activePercentage}% del total`,
      icon: Activity,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'new_nutritionist',
      user: 'Dra. María González',
      action: 'Nueva nutricionista registrada',
      timestamp: 'Hace 2 horas',
      icon: UserCog,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: '2',
      type: 'suspended',
      user: 'Dr. Carlos Ramírez',
      action: 'Cuenta suspendida por múltiples reportes',
      timestamp: 'Hace 5 horas',
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      id: '3',
      type: 'password_reset',
      user: 'Juan Pérez (Paciente)',
      action: 'Contraseña reiniciada por administrador',
      timestamp: 'Hace 1 día',
      icon: Shield,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: '4',
      type: 'new_patient',
      user: 'Ana Martínez',
      action: 'Nuevo paciente registrado',
      timestamp: 'Hace 1 día',
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header 
        title="Panel de Administración" 
        showMenu 
        role="admin" 
      />

      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h2 className="text-2xl">Panel de Administración</h2>
          </div>
          <p className="text-blue-50">Gestiona usuarios, monitorea actividad y administra el sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl text-slate-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-slate-900 dark:text-white mb-1">{stat.label}</p>
                <p className={`text-sm ${stat.textColor}`}>{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-4 text-lg font-semibold">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/nutritionists')}
              className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-6 rounded-lg transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold mb-1">Gestionar Nutricionistas</p>
                <p className="text-sm opacity-80">Ver, suspender y administrar nutricionistas</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/admin/patients')}
              className="bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-6 rounded-lg transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold mb-1">Gestionar Pacientes</p>
                <p className="text-sm opacity-80">Ver, suspender y administrar pacientes</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/admin/moderation')}
              className="bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 p-6 rounded-lg transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold mb-1">Moderación de contenido</p>
                <p className="text-sm opacity-80">Revisar y moderar publicaciones</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-4 text-lg font-semibold">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className={`flex-shrink-0 ${activity.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-medium">{activity.user}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{activity.action}</p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-4 text-lg font-semibold">Estado del Sistema</h3>
          <div className="space-y-3">
            {/* AWS Status */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">AWS Services</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">EC2, RDS, S3 operando normalmente</p>
                </div>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Activo</span>
            </div>

            {/* Domain Status */}
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Dominio nutriapp.com</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Vence en 45 días (12 Mar 2026)</p>
                </div>
              </div>
              <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">Renovar Pronto</span>
            </div>

            {/* SSL Certificate */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Certificado SSL</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Válido hasta 15 Ago 2026 (201 días)</p>
                </div>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Válido</span>
            </div>

            {/* Database */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Base de Datos</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">PostgreSQL 15.2 • Uso: 2.4GB/10GB (24%)</p>
                </div>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Óptimo</span>
            </div>

            {/* Backup Status */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Último Backup</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">26 Ene 2026, 03:00 AM • Automático diario</p>
                </div>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Completado</span>
            </div>

            {/* API Health */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">API Server</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Tiempo de respuesta: 45ms • Uptime: 99.98%</p>
                </div>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Excelente</span>
            </div>

            {/* Storage */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Almacenamiento S3</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">148GB usados de 1TB (14.8%)</p>
                </div>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Normal</span>
            </div>

            {/* License Warning */}
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Licencia Twilio</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Vence en 8 días (3 Feb 2026) - Acción requerida</p>
                </div>
              </div>
              <span className="text-red-600 dark:text-red-400 font-semibold text-sm">Urgente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}