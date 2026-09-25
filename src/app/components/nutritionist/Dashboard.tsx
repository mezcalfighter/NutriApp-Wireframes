import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../App';
import { Calendar, Users, Clock, TrendingUp, Plus, Settings, GraduationCap } from 'lucide-react';
import { calculateAllMetrics, AVAILABLE_METRICS, getMetricValue } from '../../utils/metricsCalculations';
import { useEffect, useState } from 'react';

export default function NutritionistDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nutritionistSettings, appointments, addNotification, notifications } = useApp();
  const [calculatedMetrics, setCalculatedMetrics] = useState<any>(null);
  const isStudentsAccount = user?.planType === 'students';

  // Calculate metrics from appointments data
  useEffect(() => {
    const metrics = calculateAllMetrics(appointments);
    setCalculatedMetrics(metrics);
  }, [appointments]);

  // Auto-generate notifications based on appointments
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Check for new pending appointments
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    pendingAppointments.forEach(apt => {
      const alreadyNotified = notifications.some(
        notif => notif.appointmentId === apt.id && notif.type === 'appointment'
      );
      
      if (!alreadyNotified) {
        addNotification({
          title: 'Nueva cita pendiente',
          message: `${apt.patientName} ha solicitado una cita para el ${new Date(apt.date).toLocaleDateString('es-MX')}`,
          type: 'appointment',
          appointmentId: apt.id,
        });
      }
    });

    // Check for unpaid completed appointments
    const unpaidAppointments = appointments.filter(apt => apt.status === 'completed' && !apt.isPaid);
    unpaidAppointments.forEach(apt => {
      const alreadyNotified = notifications.some(
        notif => notif.appointmentId === apt.id && notif.type === 'payment'
      );
      
      if (!alreadyNotified) {
        addNotification({
          title: 'Pago pendiente',
          message: `La consulta de ${apt.patientName} ($${apt.finalPrice} MXN) está pendiente de pago`,
          type: 'payment',
          appointmentId: apt.id,
        });
      }
    });

    // Reminders for upcoming appointments today
    const todayAppointments = appointments.filter(apt => apt.date === today && apt.status === 'confirmed');
    todayAppointments.forEach(apt => {
      const alreadyNotified = notifications.some(
        notif => notif.appointmentId === apt.id && notif.type === 'reminder'
      );
      
      if (!alreadyNotified) {
        addNotification({
          title: 'Recordatorio de cita',
          message: `Tienes una cita con ${apt.patientName} hoy a las ${apt.time}`,
          type: 'reminder',
          appointmentId: apt.id,
        });
      }
    });
  }, [appointments, notifications]);

  // Get visible metrics with their definitions and calculated values
  const visibleMetrics = nutritionistSettings.metrics
    .filter(config => config.visible)
    .map(config => {
      const definition = AVAILABLE_METRICS.find(m => m.id === config.metricId);
      if (!definition) return null;
      
      const currentValue = calculatedMetrics ? calculatedMetrics[config.metricId] : 0;
      
      return {
        ...definition,
        targetValue: config.targetValue,
        currentValue: currentValue,
      };
    })
    .filter(m => m !== null);

  // Students accounts don't have appointments or recent patient activity
  const todaysAppointments = isStudentsAccount ? [] : [
    {
      id: '1',
      patient: 'María Rodríguez',
      time: '09:00',
      endTime: '09:30',
      type: 'Seguimiento',
      status: 'confirmed',
    },
    {
      id: '2',
      patient: 'Carlos Hernández',
      time: '10:00',
      endTime: '10:45',
      type: 'Consulta Inicial',
      status: 'confirmed',
    },
    {
      id: '3',
      patient: 'Ana López',
      time: '11:30',
      endTime: '12:00',
      type: 'Revisión de Dieta',
      status: 'confirmed',
    },
    {
      id: '4',
      patient: 'Roberto Sánchez',
      time: '14:00',
      endTime: '14:30',
      type: 'Seguimiento',
      status: 'pending',
    },
    {
      id: '5',
      patient: 'Patricia Gómez',
      time: '15:30',
      endTime: '16:15',
      type: 'Consulta Inicial',
      status: 'confirmed',
    },
  ];

  const recentPatients = isStudentsAccount ? [] : [
    {
      id: '1',
      name: 'María Rodríguez',
      lastVisit: 'hace 2 días',
      progress: '-1.5kg',
      status: 'goodProgress',
      statusText: 'Buen progreso',
    },
    {
      id: '2',
      name: 'Carlos Hernández',
      lastVisit: 'hace 1 semana',
      progress: '-2.2kg',
      status: 'goodProgress',
      statusText: 'Buen progreso',
    },
    {
      id: '3',
      name: 'Ana López',
      lastVisit: 'hace 3 días',
      progress: '+0.5kg',
      status: 'onTrack',
      statusText: 'En progreso',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header 
        title="Inicio" 
        showNotifications 
        showMenu 
        role="nutritionist"
      />

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        {isStudentsAccount ? (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-6 h-6" />
              <h2>¡Hola, {user?.name || 'Estudiante'}!</h2>
            </div>
            <p className="text-purple-50">Cuenta de práctica • Trabaja con tus 10 pacientes ficticios</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
            <h2 className="mb-2">¡Bienvenido de vuelta, {user?.name || 'Doctor'}!</h2>
            <p className="text-emerald-50">Revisa tu agenda y pacientes del día</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {isStudentsAccount ? (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl text-slate-900 dark:text-white mb-1">
                  {user?.demoDataGenerated ? '10' : '0'}/10
                </p>
                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm">Pacientes Ficticios</p>
                <p className="text-purple-600 dark:text-purple-400 text-sm">
                  {user?.demoDataGenerated ? 'Generados' : 'Sin generar'}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl text-slate-900 dark:text-white mb-1">0/15</p>
                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm">Consultas Simuladas</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm">Este mes</p>
              </div>
            </>
          ) : visibleMetrics.length > 0 ? (
            visibleMetrics.slice(0, 4).map((metric, index) => {
              const progress = (metric.currentValue / metric.targetValue) * 100;
              const colors = [
                { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
                { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
                { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
                { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
              ];
              const color = colors[index % colors.length];

              // Format value based on unit
              let displayValue = metric.currentValue;
              if (metric.unit === 'MXN') {
                displayValue = `$${displayValue.toLocaleString()}`;
              } else if (metric.unit === '%') {
                displayValue = `${displayValue}`;
              }

              return (
                <div key={metric.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                  <div className={`w-10 h-10 ${color.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl text-slate-900 dark:text-white mb-1">
                    {displayValue}
                    {metric.unit !== 'MXN' && metric.unit !== '%' && <span className="text-sm">{metric.unit}</span>}
                    {metric.unit === '%' && <span className="text-sm">%</span>}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm">{metric.name}</p>
                  <p className={`${color.text} text-sm`}>
                    Meta: {metric.unit === 'MXN' ? `$${metric.targetValue.toLocaleString()}` : metric.targetValue}{metric.unit !== 'MXN' && metric.unit}
                  </p>
                </div>
              );
            })
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl text-slate-900 dark:text-white mb-1">{calculatedMetrics?.totalPatients || 0}</p>
                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm">Total de Pacientes</p>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">+{calculatedMetrics?.newPatientsThisMonth || 0} nuevos este mes</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl text-slate-900 dark:text-white mb-1">{calculatedMetrics?.appointmentsThisWeek || 0}</p>
                <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm">Citas Esta Semana</p>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">{calculatedMetrics?.completionRate || 0}% completadas</p>
              </div>
            </>
          )}
        </div>

        {/* Configure Metrics Button */}
        {visibleMetrics.length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-100 text-sm mb-3">
              💡 No has configurado métricas visibles. Personaliza tu dashboard en Configuración.
            </p>
            <button
              onClick={() => navigate('/nutritionist/settings')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurar Métricas
            </button>
          </div>
        )}

        {/* Performance Insights - Only for regular nutritionists */}
        {!isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <h3 className="text-slate-900 dark:text-white mb-4">Resumen de Desempeño</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div>
                  <p className="text-slate-900 dark:text-white">Pacientes Activos</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Con citas en últimos 30 días</p>
                </div>
                <div className="text-2xl text-emerald-600 dark:text-emerald-400">{calculatedMetrics?.activePatients || 0}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-slate-900 dark:text-white">Citas Completadas</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Tasa de completación</p>
                </div>
                <div className="text-2xl text-blue-600 dark:text-blue-400">{calculatedMetrics?.completionRate || 0}%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-slate-900 dark:text-white">Ingresos Esta Semana</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Solo citas pagadas</p>
                </div>
                <div className="text-2xl text-purple-600 dark:text-purple-400">${(calculatedMetrics?.weeklyIncome || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Students: Practice Overview */}
        {isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <h3 className="text-slate-900 dark:text-white mb-4">Tu Entorno de Práctica</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-slate-900 dark:text-white">Pacientes Ficticios</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Máximo permitido</p>
                </div>
                <div className="text-2xl text-purple-600 dark:text-purple-400">10</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-slate-900 dark:text-white">Plantillas Permitidas</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Planes nutricionales</p>
                </div>
                <div className="text-2xl text-blue-600 dark:text-blue-400">1</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div>
                  <p className="text-slate-900 dark:text-white">Vigencia de Cuenta</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Tiempo restante</p>
                </div>
                <div className="text-2xl text-amber-600 dark:text-amber-400">6 meses</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <h3 className="text-slate-900 dark:text-white mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/nutritionist/patients/add')}
                className="bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                <span>Agregar Paciente</span>
              </button>
              <button
                onClick={() => navigate('/nutritionist/templates/create')}
                className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                <span>Nueva Plantilla</span>
              </button>
            </div>
          </div>
        )}

        {/* Students: Getting Started Card */}
        {isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <h3 className="text-slate-900 dark:text-white mb-4">Comienza a Practicar</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/nutritionist/patients')}
                className="w-full bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 p-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>Ver tus pacientes ficticios</span>
                </div>
                <span className="text-sm">→</span>
              </button>
              <button
                onClick={() => navigate('/nutritionist/templates/create')}
                className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  <span>Crear plantilla nutricional</span>
                </div>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Today's Appointments - Only for regular nutritionists */}
        {!isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white">Citas de Hoy</h3>
              <button
                onClick={() => navigate('/nutritionist/appointments')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                Ver Todas
              </button>
            </div>
            <div className="space-y-3">
              {todaysAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate(`/nutritionist/appointments/${apt.id}`)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-900 dark:text-white">{apt.patient}</p>
                    <span className="text-slate-600 dark:text-slate-400">{apt.time} - {apt.endTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{apt.type}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}>
                      {apt.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Patients - Only for regular nutritionists */}
        {!isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white">Pacientes Recientes</h3>
              <button
                onClick={() => navigate('/nutritionist/patients')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                Ver Todos
              </button>
            </div>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/nutritionist/patients/${patient.id}`)}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 dark:text-emerald-400">{patient.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white">{patient.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">Última visita: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 dark:text-white">{patient.progress}</p>
                    <p className={`${
                      patient.status === 'onTrack'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : patient.status === 'goodProgress'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {patient.statusText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}