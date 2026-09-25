import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { useApp } from '../../contexts/AppContext';
import { DollarSign, TrendingUp, Calendar, Tag, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../App';

export default function Finances() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const { appointments } = useApp();
  const [view, setView] = useState<'actual' | 'projected'>('actual');

  // Calcular ingresos de citas completadas y pagadas
  const completedPaidAppointments = appointments.filter(
    (apt) => apt.status === 'completed' && apt.isPaid
  );

  const completedUnpaidAppointments = appointments.filter(
    (apt) => apt.status === 'completed' && !apt.isPaid
  );

  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );

  // Ingresos reales (completadas y pagadas)
  const actualIncome = completedPaidAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);

  // Ingresos pendientes de cobro (completadas pero no pagadas)
  const pendingIncome = completedUnpaidAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);

  // Proyección de ingresos (citas confirmadas + pendientes)
  const projectedIncome = confirmedAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);

  // Total potencial
  const totalPotential = actualIncome + pendingIncome + projectedIncome;

  // Calcular promedio por consulta
  const avgPerConsultation =
    completedPaidAppointments.length > 0
      ? actualIncome / completedPaidAppointments.length
      : 0;

  // Agrupar ingresos por fecha
  const incomeByDate = completedPaidAppointments.reduce((acc, apt) => {
    const date = apt.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(apt);
    return acc;
  }, {} as Record<string, typeof appointments>);

  const sortedDates = Object.keys(incomeByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Finanzas" showBack showMenu />

      <div className="p-4 space-y-6">
        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-900 dark:text-blue-100 text-sm">
            💡 Los ingresos se calculan automáticamente desde las citas completadas y marcadas como pagadas.
            Gestiona tus citas en "Gestión de Citas".
          </p>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => navigate('/nutritionist/appointments-manager')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Gestionar Citas
        </button>

        {/* View Toggle */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm flex gap-1">
          <button
            onClick={() => setView('actual')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              view === 'actual'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Ingresos Reales
          </button>
          <button
            onClick={() => setView('projected')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              view === 'projected'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Proyecciones
          </button>
        </div>

        {view === 'actual' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <p className="text-emerald-100">Ingresos Totales (Pagados)</p>
                </div>
                <p className="text-3xl font-bold">${actualIncome.toLocaleString('es-MX')} MXN</p>
                <p className="text-emerald-100 text-sm mt-2">
                  {completedPaidAppointments.length} citas completadas y pagadas
                </p>
              </div>

              {pendingIncome > 0 && (
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 shadow-lg text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-amber-100">Pendiente de Cobro</p>
                  </div>
                  <p className="text-3xl font-bold">${pendingIncome.toLocaleString('es-MX')} MXN</p>
                  <p className="text-amber-100 text-sm mt-2">
                    {completedUnpaidAppointments.length} citas completadas sin pagar
                  </p>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-400">
                  <TrendingUp className="w-5 h-5" />
                  <p className="text-sm">Promedio por Consulta</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${avgPerConsultation.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
                </p>
              </div>
            </div>

            {/* Income History */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-medium mb-3">Historial de Ingresos</h3>
              <div className="space-y-3">
                {sortedDates.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm text-center">
                    <DollarSign className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 mb-2">
                      No hay ingresos registrados
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      Los ingresos aparecerán cuando completes y marques citas como pagadas
                    </p>
                  </div>
                ) : (
                  sortedDates.map((date) => {
                    const dayAppointments = incomeByDate[date];
                    const dayTotal = dayAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);

                    return (
                      <div
                        key={date}
                        className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <p className="text-slate-900 dark:text-white font-medium">
                              {new Date(date).toLocaleDateString('es-MX', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            ${dayTotal.toLocaleString('es-MX')} MXN
                          </p>
                        </div>

                        <div className="space-y-2">
                          {dayAppointments.map((apt) => (
                            <div
                              key={apt.id}
                              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-slate-900 dark:text-white text-sm font-medium">
                                  {apt.consultationType.name}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-xs">
                                  {apt.patientName} • {apt.time}
                                </p>
                                {apt.couponCode && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                      Cupón: {apt.couponCode} (-${apt.discount})
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                {apt.discount > 0 && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 line-through">
                                    ${apt.basePrice}
                                  </p>
                                )}
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  ${apt.finalPrice.toLocaleString('es-MX')} MXN
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Projected Stats */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <p className="text-blue-100">Proyección de Ingresos</p>
                </div>
                <p className="text-3xl font-bold">${projectedIncome.toLocaleString('es-MX')} MXN</p>
                <p className="text-blue-100 text-sm mt-2">
                  Basado en {confirmedAppointments.length} citas confirmadas/pendientes
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <p className="text-purple-100">Potencial Total</p>
                </div>
                <p className="text-3xl font-bold">${totalPotential.toLocaleString('es-MX')} MXN</p>
                <p className="text-purple-100 text-sm mt-2">
                  Ingresos pagados + pendientes + proyectados
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
              <h3 className="text-slate-900 dark:text-white font-medium mb-4">Desglose</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-900 dark:text-white">Ya Cobrado</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ${actualIncome.toLocaleString('es-MX')}
                  </span>
                </div>

                {pendingIncome > 0 && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-slate-900 dark:text-white">Por Cobrar</span>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      ${pendingIncome.toLocaleString('es-MX')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-slate-900 dark:text-white">Citas Pendientes</span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    ${projectedIncome.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            {confirmedAppointments.length > 0 && (
              <div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-3">
                  Próximas Citas ({confirmedAppointments.length})
                </h3>
                <div className="space-y-2">
                  {confirmedAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="text-slate-900 dark:text-white text-sm font-medium">
                          {apt.patientName}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          {new Date(apt.date).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          • {apt.time}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        ${apt.finalPrice.toLocaleString('es-MX')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}
