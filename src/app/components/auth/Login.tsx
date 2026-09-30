import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../App';
import { useApp } from '../../contexts/AppContext';
import { Heart, Eye, EyeOff, AlertCircle, Moon, Sun, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { isDarkMode, toggleDarkMode } = useApp();

  // Get nutritionist booking context from URL
  const nutriologoId = searchParams.get('nutriologo');
  const slot = searchParams.get('slot');
  const redirectPath = searchParams.get('redirect');

  // Mock nutritionist data (would come from API)
  const mockNutritionists: { [key: string]: { name: string; initials: string } } = {
    '1': { name: 'Lic. Ana García', initials: 'AG' },
    '2': { name: 'Dr. Carlos López', initials: 'CL' },
    '3': { name: 'Lic. María González', initials: 'MG' },
    '4': { name: 'Dra. Patricia Ruiz', initials: 'PR' },
  };

  const selectedNutritionist = nutriologoId ? mockNutritionists[nutriologoId] : null;
  const formatSlot = (slotString: string) => {
    try {
      const [date, time] = slotString.split('T');
      const dateObj = new Date(date);
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      return `${days[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]} a las ${time}`;
    } catch {
      return slotString;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock validation
    if (!email || !password) {
      setError('Credenciales inválidas');
      return;
    }

    // Demo: fail on invalid credentials
    if (password.length < 6 && email !== 'demo@patient.com' && email !== 'demo@nutritionist.com') {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        navigate('/account-locked');
        return;
      }
      
      setError(`Credenciales inválidas. ${5 - newAttempts} intentos restantes.`);
      return;
    }

    // Success - check if admin, student, nutritionist or patient
    login(email, password);

    const isStudent = email.includes('.edu') || email.includes('student');
    const isAdmin = email.includes('admin');
    const isNutritionist = email.includes('nutritionist');

    if (isAdmin) {
      navigate('/admin/dashboard');
    } else if (isStudent || isNutritionist) {
      // Students and Nutritionists go through MFA
      const queryString = searchParams.toString();
      navigate(`/mfa-verify${queryString ? `?${queryString}` : ''}`);
    } else {
      // Patient login - check if coming from booking flow
      if (redirectPath === 'confirmar-cita' && nutriologoId && slot) {
        navigate(`/confirmar-cita?nutriologo=${nutriologoId}&slot=${encodeURIComponent(slot)}`);
      } else {
        navigate('/patient/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
            title={isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-slate-700" />
            ) : (
              <Sun className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-emerald-900 dark:text-white mb-2">Bienvenido</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Inicia sesión</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs">
              Gestión clínica segura para nutriólogos · Cumplimiento LFPDPPP incluido
            </p>
          </div>

          {/* Nutritionist Context Banner */}
          {selectedNutritionist && slot && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-emerald-500 text-white">
                      {selectedNutritionist.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed m-0">
                    Inicia sesión para confirmar tu cita con <span className="font-medium">{selectedNutritionist.name}</span> el {formatSlot(slot)}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-slate-700 dark:text-slate-300 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-700 dark:text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12 text-slate-900 dark:text-white"
                  placeholder="Contraseña"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Recuérdame</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/password-reset')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                Olvidé mi contraseña
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Registration Section */}
          <div className="mt-6">
            {/* Separator */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            {/* Registration Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                Soy nutriólogo
              </button>
              <button
                type="button"
                onClick={() => navigate('/buscar-nutriologo')}
                className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                Soy paciente
              </button>
            </div>

            {/* Info Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                ¿Buscas información? Ver inicio →
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-3 font-semibold">Credenciales de demostración</p>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-sm">
              <button
                type="button"
                onClick={() => {
                  setEmail('estudiante@unam.edu.mx');
                  setPassword('demo123');
                }}
                className="w-full text-left p-2 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
              >
                <span className="block font-medium text-purple-700 dark:text-purple-400">🎓 Estudiante (Students)</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">estudiante@unam.edu.mx</span>
                <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">10 pacientes ficticios • Features limitados</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('nutritionist@nutriapp.com');
                  setPassword('demo123');
                }}
                className="w-full text-left p-2 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <span className="block font-medium text-emerald-700 dark:text-emerald-400">🍎 Nutriólogo (Plan Basic)</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">nutritionist@nutriapp.com</span>
                <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">Todos los features disponibles</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('patient@email.com');
                  setPassword('demo123');
                }}
                className="w-full text-left p-2 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-blue-300 dark:hover:border-blue-700"
              >
                <span className="block font-medium text-blue-700 dark:text-blue-400">👤 Paciente</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">patient@email.com</span>
                <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">100% gratis • Buscar nutriólogos</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@nutriapp.com');
                  setPassword('demo123');
                }}
                className="w-full text-left p-2 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-amber-300 dark:hover:border-amber-700"
              >
                <span className="block font-medium text-amber-700 dark:text-amber-400">🛡️ Admin</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">admin@nutriapp.com</span>
                <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">Solicitudes ARCO • Sin datos sensibles</span>
              </button>
            </div>
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
              Click en cualquier credencial para auto-llenar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}