import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Calendar, Clock, Plus } from 'lucide-react';

export default function MyAppointments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('upcoming');

  const appointments = [
    {
      id: '1',
      nutritionist: 'Lic. Andrea Martínez',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'confirmed',
    },
    {
      id: '2',
      nutritionist: 'Lic. Andrea Martínez',
      date: '2024-01-22',
      time: '2:00 PM',
      type: 'Diet Review',
      status: 'pending',
    },
    {
      id: '3',
      nutritionist: 'Lic. Andrea Martínez',
      date: '2024-01-08',
      time: '10:00 AM',
      type: 'Initial Consultation',
      status: 'completed',
    },
    {
      id: '4',
      nutritionist: 'Lic. Andrea Martínez',
      date: '2023-12-18',
      time: '2:00 PM',
      type: 'Follow-up',
      status: 'completed',
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    
    if (filter === 'upcoming') {
      return aptDate >= today && apt.status !== 'completed';
    }
    if (filter === 'past') {
      return aptDate < today || apt.status === 'completed';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header title="My Appointments" showNotifications showMenu />

      <div className="p-4 space-y-4">
        <button
          onClick={() => navigate('/patient/schedule')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Schedule New Appointment
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              filter === 'upcoming'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              filter === 'past'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Past
          </button>
        </div>

        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => navigate(`/patient/appointments/${appointment.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700">
                      {appointment.nutritionist.split(' ')[1].charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-900">{appointment.nutritionist}</p>
                    <p className="text-slate-500">{appointment.type}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    appointment.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : appointment.status === 'pending'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
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
            <p className="text-slate-500">No appointments found</p>
          </div>
        )}
      </div>

      <MobileNav role="patient" />
    </div>
  );
}