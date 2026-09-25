import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Heart, Eye, EyeOff, AlertCircle, Upload, ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function NutritionistRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useApp();
  
  const plan = searchParams.get('plan') || 'basic';
  const upgrade = searchParams.get('upgrade'); // For students upgrading to basic

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cedula: '',
    institutionalEmail: '', // For students plan
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const planNames: { [key: string]: string } = {
    students: 'Students',
    basic: 'Basic',
    pro: 'Pro',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (plan === 'students' && !formData.institutionalEmail) {
      setError('Debes proporcionar tu correo institucional');
      return;
    }

    if ((plan === 'basic' || plan === 'pro') && !formData.cedula) {
      setError('Debes proporcionar tu número de cédula profesional');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    // Students plan is free, redirect to dashboard
    if (plan === 'students') {
      navigate('/nutritionist/dashboard');
      return;
    }

    // Basic and Pro plans require payment
    navigate(`/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a planes
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 dark:text-white mb-2">
              Registro de Nutriólogo
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Plan seleccionado: <span className="font-medium text-emerald-600 dark:text-emerald-400">{planNames[plan]}</span>
            </p>
            {upgrade === 'students' && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Migrando desde plan Students
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                placeholder="Lic. Ana García"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                placeholder="ana@email.com"
              />
            </div>

            {plan === 'students' && (
              <div>
                <label htmlFor="institutionalEmail" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                  Correo institucional <span className="text-red-500">*</span>
                </label>
                <input
                  id="institutionalEmail"
                  type="email"
                  required={plan === 'students'}
                  value={formData.institutionalEmail}
                  onChange={(e) => setFormData({ ...formData, institutionalEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  placeholder="ana@universidad.edu.mx"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Debe terminar en .edu, .edu.mx, .ipn.mx o similar
                </p>
              </div>
            )}

            {(plan === 'basic' || plan === 'pro') && (
              <div>
                <label htmlFor="cedula" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                  Cédula profesional <span className="text-red-500">*</span>
                </label>
                <input
                  id="cedula"
                  type="text"
                  required={plan === 'basic' || plan === 'pro'}
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  placeholder="12345678"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Lic. Nutrición o Lic. Nutriología
                </p>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                placeholder="+52 55 1234 5678"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12 text-slate-900 dark:text-white"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-slate-700 dark:text-slate-300 mb-1 text-sm">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12 text-slate-900 dark:text-white"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-700 dark:text-slate-300">
                Acepto el Aviso de Privacidad y Términos de Uso. Entiendo que mis datos serán tratados conforme a la LFPDPPP.
              </label>
            </div>

            <button
              type="submit"
              disabled={!formData.termsAccepted}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {plan === 'students' ? 'Crear cuenta gratis' : 'Continuar al pago'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
