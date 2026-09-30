import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { CheckCircle, Calendar, Clock, User, Home } from 'lucide-react';

export default function AppointmentConfirmation() {
  const navigate = useNavigate();

  const appointment = {
    nutritionist: 'Lic. Andrea Martínez',
    date: '2024-01-22',
    time: '2:00 PM',
    type: 'Diet Review',
    notes: 'Want to discuss progress and adjust meal plan',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-emerald-900 mb-2">Appointment Requested!</h1>
            <p className="text-slate-600">
              Your appointment request has been sent to Dr. Johnson
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <h3 className="text-emerald-900 mb-3">Appointment Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-emerald-800">{appointment.nutritionist}</p>
                  <p className="text-emerald-600 text-sm">{appointment.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-800">
                  {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-800">{appointment.time}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-blue-900 mb-2">What's Next?</h4>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Your nutritionist will review your request</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>You'll receive a confirmation notification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Check your appointments for updates</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              View My Appointments
            </button>
            
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}