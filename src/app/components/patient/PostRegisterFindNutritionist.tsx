import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, MapPin, Star, Clock, Check, X as XIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export default function PostRegisterFindNutritionist() {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedAppointments, setBookedAppointments] = useState<Set<string>>(new Set());

  // Mock data from registration
  const patientName = 'María González';
  const postalCode = '06700';

  // Mock next 7 days
  const getNext7Days = () => {
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        id: `day-${i}`,
        dayName: dayNames[date.getDay()],
        dayNum: date.getDate(),
        month: monthNames[date.getMonth()],
        fullDate: date.toISOString().split('T')[0],
      });
    }
    return days;
  };

  const days = getNext7Days();

  // Mock time slots
  const timeSlots = [
    { id: 't1', time: '9:00', available: true },
    { id: 't2', time: '10:30', available: true },
    { id: 't3', time: '12:00', available: false },
    { id: 't4', time: '13:30', available: true },
    { id: 't5', time: '15:00', available: true },
    { id: 't6', time: '16:00', available: false },
    { id: 't7', time: '17:30', available: true },
    { id: 't8', time: '19:00', available: true },
  ];

  // Mock nutritionists
  const nutritionists = [
    {
      id: 'nut-1',
      name: 'Dra. Ana Martínez',
      credential: 'Lic. Nutrición',
      specialty: ['Nutrición Deportiva', 'Control de Peso'],
      rating: 4.8,
      reviews: 127,
      distance: 1.2,
      nextAvailable: 'Lun, 9:00',
      photo: null,
    },
    {
      id: 'nut-2',
      name: 'Dr. Carlos Ruiz',
      credential: 'Mtro. Nutrición Clínica',
      specialty: ['Diabetes', 'Nutrición Clínica'],
      rating: 4.9,
      reviews: 203,
      distance: 2.5,
      nextAvailable: 'Mar, 10:30',
      photo: null,
    },
    {
      id: 'nut-3',
      name: 'Lic. Patricia López',
      credential: 'Lic. Nutrición',
      specialty: ['Nutrición Familiar', 'Pediatría'],
      rating: 4.7,
      reviews: 89,
      distance: 3.1,
      nextAvailable: 'Mié, 15:00',
      photo: null,
    },
  ];

  const handleScheduleClick = (nutId: string) => {
    if (expandedCard === nutId) {
      setExpandedCard(null);
      setSelectedDay(null);
      setSelectedTime(null);
    } else {
      setExpandedCard(nutId);
      setSelectedDay(null);
      setSelectedTime(null);
    }
  };

  const handleConfirmAppointment = (nutId: string) => {
    const nutritionist = nutritionists.find(n => n.id === nutId);
    const day = days.find(d => d.id === selectedDay);
    const time = timeSlots.find(t => t.id === selectedTime);

    if (!nutritionist || !day || !time) return;

    // Show success state
    setBookedAppointments(new Set([...bookedAppointments, nutId]));
    toast.success('¡Cita agendada!');

    // Collapse card after 2 seconds
    setTimeout(() => {
      setExpandedCard(null);
      setSelectedDay(null);
      setSelectedTime(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Último paso — Conecta con tu nutriólogo
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm transition-colors"
          >
            Omitir por ahora →
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          ¡Bienvenido/a a NutriApp, {patientName}!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Encontramos nutriólogos cerca de tu zona (CP {postalCode}). Elige uno para comenzar tu seguimiento.
        </p>
      </div>

      {/* Mock Map */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="relative h-48 md:h-72 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-slate-400 dark:border-slate-600"></div>
              ))}
            </div>
          </div>
          {/* Mock pins */}
          <div className="absolute top-1/4 left-1/3">
            <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400 drop-shadow-lg" fill="currentColor" />
          </div>
          <div className="absolute top-1/2 right-1/3">
            <MapPin className="w-8 h-8 text-teal-600 dark:text-teal-400 drop-shadow-lg" fill="currentColor" />
          </div>
          <div className="absolute bottom-1/3 left-1/2">
            <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 drop-shadow-lg" fill="currentColor" />
          </div>
          {/* User location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
          Mapa ilustrativo. Ubicaciones aproximadas.
        </p>
      </div>

      {/* Nutritionist Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-8 space-y-4">
        {nutritionists.map((nut) => {
          const isExpanded = expandedCard === nut.id;
          const isBooked = bookedAppointments.has(nut.id);

          return (
            <div
              key={nut.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl text-emerald-700 dark:text-emerald-400">
                      {nut.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {nut.name}
                        </h3>
                        <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                          {nut.credential}
                        </Badge>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {nut.specialty.map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Rating & Distance */}
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium">{nut.rating}</span>
                        <span>({nut.reviews} reseñas)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>~{nut.distance} km de tu zona</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-sm px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded">
                        <Clock className="w-4 h-4" />
                        Próxima cita disponible: {nut.nextAvailable}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isBooked ? (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleScheduleClick(nut.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isExpanded
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {isExpanded ? 'Cancelar' : 'Agendar cita'}
                    </button>
                    <button
                      onClick={() => navigate(`/nutritionist-profile/${nut.id}`)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Ver perfil
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="font-medium text-emerald-900 dark:text-emerald-100">
                          ¡Cita agendada!
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          Recibirás una confirmación por SMS/WhatsApp
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/patient/my-appointments')}
                      className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Ver mis citas
                    </button>
                  </div>
                )}
              </div>

              {/* Inline Appointment Booking */}
              {isExpanded && !isBooked && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-800/50">
                  {/* Step A - Date Picker */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                      Selecciona un día
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                      {days.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => {
                            setSelectedDay(day.id);
                            setSelectedTime(null);
                          }}
                          className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                            selectedDay === day.id
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {day.dayName}
                          </div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {day.dayNum}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {day.month}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step B - Time Slots */}
                  {selectedDay && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                        Selecciona un horario
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && setSelectedTime(slot.id)}
                            disabled={!slot.available}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === slot.id
                                ? 'bg-emerald-500 text-white'
                                : slot.available
                                ? 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step C - Confirm Button */}
                  {selectedDay && selectedTime && (
                    <button
                      onClick={() => handleConfirmAppointment(nut.id)}
                      className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Confirmar cita
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-8 space-y-4">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            ¿No encuentras lo que buscas?
          </p>
          <button
            onClick={() => navigate('/buscar-nutriologo')}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            Explorar más nutriólogos →
          </button>
        </div>

        <button
          onClick={() => navigate('/patient/dashboard')}
          className="w-full px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
        >
          Ir a mi dashboard
        </button>
      </div>
    </div>
  );
}
