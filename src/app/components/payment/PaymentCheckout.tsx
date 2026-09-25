import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CreditCard, Lock, Check, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'basic';
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingPeriod: 'annual' as 'monthly' | 'annual',
  });
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const planDetails: { [key: string]: { name: string; monthly: number; annual: number; annualTotal: number; savings: number } } = {
    basic: {
      name: 'Basic',
      monthly: 13,
      annual: 11,
      annualTotal: 132,
      savings: 24,
    },
    pro: {
      name: 'Pro',
      monthly: 17,
      annual: 15,
      annualTotal: 180,
      savings: 24,
    },
  };

  const currentPlan = planDetails[plan];
  const price = paymentData.billingPeriod === 'monthly' ? currentPlan.monthly : currentPlan.annual;
  const totalToday = paymentData.billingPeriod === 'annual' ? currentPlan.annualTotal : currentPlan.monthly;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setPaymentData({ ...paymentData, cardNumber: value });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setPaymentData({ ...paymentData, expiryDate: value });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPaymentData({ ...paymentData, cvv: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      toast.success('¡Pago procesado exitosamente!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/nutritionist/dashboard');
      }, 2000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              ¡Pago exitoso!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Tu suscripción al plan <span className="font-medium text-emerald-600 dark:text-emerald-400">{currentPlan.name}</span> ha sido activada.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Redirigiendo a tu panel...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Información de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Billing Period */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Periodo de facturación
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentData({ ...paymentData, billingPeriod: 'monthly' })}
                        className={`py-2 px-4 rounded-lg border transition-colors ${
                          paymentData.billingPeriod === 'monthly'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">Mensual</div>
                        <div className="text-xs">${currentPlan.monthly}/mes</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentData({ ...paymentData, billingPeriod: 'annual' })}
                        className={`py-2 px-4 rounded-lg border transition-colors ${
                          paymentData.billingPeriod === 'annual'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium">Anual</div>
                        <div className="text-xs">${currentPlan.annual}/mes</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">Ahorra ${currentPlan.savings}</div>
                      </button>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Número de tarjeta <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      required
                      value={formatCardNumber(paymentData.cardNumber)}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nombre del titular <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      required
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      placeholder="Ana García"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Vencimiento <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        required
                        value={paymentData.expiryDate}
                        onChange={handleExpiryChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        required
                        value={paymentData.cvv}
                        onChange={handleCvvChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Pago seguro encriptado con SSL</span>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Procesando...' : `Pagar $${totalToday} USD`}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Plan {currentPlan.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Facturación {paymentData.billingPeriod === 'monthly' ? 'mensual' : 'anual'}
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                    <span className="text-slate-900 dark:text-white">${totalToday} USD</span>
                  </div>
                  {paymentData.billingPeriod === 'annual' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 dark:text-emerald-400">Ahorro anual:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">-${currentPlan.savings} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white">Total hoy:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">${totalToday} USD</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    {paymentData.billingPeriod === 'monthly' 
                      ? `Se te cobrará $${currentPlan.monthly} USD cada mes.`
                      : `Pago único de $${currentPlan.annualTotal} USD por 12 meses (equivalente a $${currentPlan.annual} USD/mes).`
                    }
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    Puedes cancelar en cualquier momento desde tu panel.
                  </p>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Al completar este pago, aceptas nuestros Términos de Servicio y Política de Privacidad.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
