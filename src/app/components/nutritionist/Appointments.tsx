import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Calendar, Clock, Settings, Lock } from 'lucide-react';
import { useAuth } from '../../App';

export default function Appointments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const [filter, setFilter] = useState('upcoming');

  // Students accounts don't have access to appointments
  const appointments = isStudentsAccount ? [] : [
    {
      id: '1',
      patient: 'María Rodríguez',
      date: '2024-01-08',
      time: '10:00 AM',
      type: 'Seguimiento',
      status: 'confirmed',
    },
    {
      id: '2',
      patient: 'Carlos Hernández',
      date: '2024-01-08',
      time: '11:30 AM',
      type: 'Consulta Inicial',
      status: 'confirmed',
    },
    {
      id: '3',
      patient: 'Ana López',
      date: '2024-01-08',
      time: '2:00 PM',
      type: 'Revisión de Dieta',
      status: 'pending',
    },
    {
      id: '4',
      patient: 'Roberto Sánchez',
      date: '2024-01-09',
      time: '9:00 AM',
      type: 'Seguimiento',
      status: 'confirmed',
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'pending') return apt.status === 'pending';
    if (filter === 'confirmed') return apt.status === 'confirmed';
    return true;
  });

  if (isStudentsAccount) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
        <Header title="Agenda" showNotifications showMenu role="nutritionist" />
        <div className="p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Módulo No Disponible en Plan Students
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              La gestión de citas no está incluida en el plan de práctica Students. Este módulo permite agendar consultas con pacientes reales.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Actualiza a un plan Basic o Pro para acceder a esta funcionalidad.
            </p>
          </div>
        </div>
        <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Citas" showNotifications showMenu role="nutritionist" />

      <div className="p-4 space-y-4">
        <button
          onClick={() => navigate('/nutritionist/availability')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Gestionar Disponibilidad
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              filter === 'upcoming'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              filter === 'confirmed'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Confirmed
          </button>
        </div>

        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => navigate(`/nutritionist/appointments/${appointment.id}`)}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-slate-900 dark:text-white mb-1">{appointment.patient}</p>
                  <p className="text-slate-500 dark:text-slate-400">{appointment.type}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    appointment.status === 'confirmed'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No appointments found</p>
          </div>
        )}
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}