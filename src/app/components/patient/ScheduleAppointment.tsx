import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Calendar, Clock, MessageSquare, DollarSign, Tag, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function ScheduleAppointment() {
  const navigate = useNavigate();
  const { nutritionistSettings, addAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedConsultationType, setSelectedConsultationType] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  // Get consultation types from settings or use defaults
  const consultationTypes = nutritionistSettings.consultationTypes || [
    { id: '1', name: 'Consulta Inicial', price: 1500, duration: 60 },
    { id: '2', name: 'Consulta de Seguimiento', price: 1000, duration: 45 },
    { id: '3', name: 'Revisión de Dieta', price: 800, duration: 30 },
    { id: '4', name: 'Valoración de Progreso', price: 1200, duration: 50 },
  ];

  // Get coupons from settings
  const availableCoupons = nutritionistSettings.coupons || [];

  const availableDates = [
    '2024-01-10',
    '2024-01-11',
    '2024-01-12',
    '2024-01-15',
    '2024-01-16',
    '2024-01-17',
    '2024-01-18',
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  const applyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase() && c.active);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Código de cupón no válido');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Calculate price
  const selectedType = consultationTypes.find((t) => t.id === selectedConsultationType);
  const basePrice = selectedType?.price || 0;
  let discount = 0;
  let finalPrice = basePrice;

  if (appliedCoupon && basePrice > 0) {
    if (appliedCoupon.type === 'percentage') {
      discount = (basePrice * appliedCoupon.discount) / 100;
    } else {
      discount = appliedCoupon.discount;
    }
    finalPrice = basePrice - discount;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) return;

    const appointment = {
      id: Date.now().toString(),
      patientId: 'patient-1', // TODO: Get from auth context
      patientName: 'Juan Pérez', // TODO: Get from auth context
      date: selectedDate,
      time: selectedTime,
      consultationType: {
        id: selectedType.id,
        name: selectedType.name,
        price: selectedType.price,
        duration: selectedType.duration,
      },
      basePrice: basePrice,
      couponCode: appliedCoupon?.code,
      discount: discount,
      finalPrice: finalPrice,
      status: 'pending' as const,
      isPaid: false,
      notes: notes,
      createdAt: new Date().toISOString(),
    };

    addAppointment(appointment);
    navigate('/patient/appointments/confirmation');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Agendar Cita" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Nutritionist Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Nutricionista</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <span className="text-emerald-700 dark:text-emerald-400">
                {nutritionistSettings.nutritionistName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white">
                {nutritionistSettings.academicDegree} {nutritionistSettings.nutritionistName}
              </p>
              <p className="text-slate-500 dark:text-slate-400">{nutritionistSettings.practiceName}</p>
            </div>
          </div>
        </div>

        {/* Appointment Type */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Tipo de Consulta</h3>
          <div className="grid grid-cols-1 gap-3">
            {consultationTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedConsultationType(type.id)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedConsultationType === type.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${
                      selectedConsultationType === type.id
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {type.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Duración: {type.duration} min
                    </p>
                  </div>
                  <p className={`text-xl font-bold ${
                    selectedConsultationType === type.id
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    ${type.price}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Select Date */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Seleccionar Fecha
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {availableDates.map((date) => {
              const dateObj = new Date(date);
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedDate === date
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700'
                  }`}
                >
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {dateObj.toLocaleDateString('es-MX', { weekday: 'short' })}
                  </p>
                  <p className={`${
                    selectedDate === date
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {dateObj.getDate()}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {dateObj.toLocaleDateString('es-MX', { month: 'short' })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Time */}
        {selectedDate && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <h3 className="text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Seleccionar Hora
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedTime === time
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-200 dark:hover:border-emerald-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Notas Adicionales (Opcional)
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Alguna preocupación o tema específico que quieras discutir..."
          />
        </div>

        {/* Coupon Code */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Código de Cupón (Opcional)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ingresa código..."
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Aplicar
            </button>
          </div>
          {couponError && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{couponError}</p>}
          {appliedCoupon && (
            <div className="mt-3 flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg">
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Cupón Aplicado: {appliedCoupon.code}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-500">
                  Descuento: {appliedCoupon.discount}{appliedCoupon.type === 'percentage' ? '%' : ' MXN'}
                </p>
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Price Summary */}
        {selectedConsultationType && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 shadow-lg text-white">
            <h3 className="mb-3 flex items-center gap-2 font-medium">
              <DollarSign className="w-5 h-5" />
              Resumen de Precio
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-emerald-50">Precio Base:</p>
                <p className="font-medium">${basePrice.toLocaleString('es-MX')} MXN</p>
              </div>
              {appliedCoupon && discount > 0 && (
                <div className="flex justify-between">
                  <p className="text-emerald-50">Descuento:</p>
                  <p className="font-medium text-yellow-300">-${discount.toLocaleString('es-MX')} MXN</p>
                </div>
              )}
              <div className="pt-2 border-t border-emerald-400 flex justify-between">
                <p className="text-lg font-bold">Total a Pagar:</p>
                <p className="text-2xl font-bold">${finalPrice.toLocaleString('es-MX')} MXN</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedDate || !selectedTime || !selectedConsultationType}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 px-4 rounded-lg transition-colors font-medium text-lg"
        >
          Solicitar Cita
        </button>
      </form>

      <MobileNav role="patient" />
    </div>
  );
}