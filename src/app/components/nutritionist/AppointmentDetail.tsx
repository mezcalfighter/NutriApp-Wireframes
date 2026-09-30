import { useNavigate, useParams } from 'react-router';
import Header from '../shared/Header';
import { Calendar, Clock, MapPin, Phone, Mail, Check, X, Lock } from 'lucide-react';
import { useAuth } from '../../App';

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';

  // Students don't have access to appointments
  if (isStudentsAccount) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
        <Header title="Detalle de Cita" showBack />
        <div className="p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center">
            <Lock className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Acceso No Disponible
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Las cuentas Students no tienen acceso al módulo de Agenda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const appointment = {
    patient: 'Maria Rodriguez',
    patientId: '1',
    date: '2024-01-08',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'pending',
    notes: 'Patient wants to discuss progress and adjust meal plan',
    email: 'maria@example.com',
    phone: '+1 (555) 123-4567',
  };

  const handleApprove = () => {
    alert('Appointment approved!');
    navigate('/nutritionist/appointments');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      navigate('/nutritionist/appointments');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      <Header title="Appointment Details" showBack />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">Status</h3>
            <span
              className={`px-3 py-1 rounded-full ${
                appointment.status === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        <div
          onClick={() => navigate(`/nutritionist/patients/${appointment.patientId}`)}
          className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <h3 className="text-slate-900 mb-3">Patient</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-700">{appointment.patient.charAt(0)}</span>
            </div>
            <div>
              <p className="text-slate-900">{appointment.patient}</p>
              <p className="text-slate-500">View patient details →</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900">Appointment Details</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-slate-500">Date</p>
                <p className="text-slate-900">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-slate-500">Time</p>
                <p className="text-slate-900">{appointment.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900">{appointment.type}</p>
              </div>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-slate-900 mb-2">Notes</h3>
            <p className="text-slate-600">{appointment.notes}</p>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="text-slate-900">Contact Information</h3>

          <a
            href={`mailto:${appointment.email}`}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Mail className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-slate-500">Email</p>
              <p className="text-emerald-600">{appointment.email}</p>
            </div>
          </a>

          <a
            href={`tel:${appointment.phone}`}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Phone className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-slate-500">Phone</p>
              <p className="text-emerald-600">{appointment.phone}</p>
            </div>
          </a>
        </div>

        {appointment.status === 'pending' && (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Decline
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Approve
            </button>
          </div>
        )}

        {appointment.status === 'confirmed' && (
          <button
            onClick={handleCancel}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
}