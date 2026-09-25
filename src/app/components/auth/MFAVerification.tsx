import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Shield, AlertCircle, Moon, Sun } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../App';

export default function MFAVerification() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode, toggleDarkMode } = useApp();
  const { user } = useAuth();

  // Get booking context from URL (if coming from patient booking flow)
  const nutriologoId = searchParams.get('nutriologo');
  const slot = searchParams.get('slot');
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = (codeToVerify: string) => {
    // Mock verification - accept 123456 as valid
    if (codeToVerify === '123456') {
      // Check user role and redirect accordingly
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'patient' && redirectPath === 'confirmar-cita' && nutriologoId && slot) {
        // Patient coming from booking flow - redirect to confirm appointment
        navigate(`/confirmar-cita?nutriologo=${nutriologoId}&slot=${encodeURIComponent(slot)}`);
      } else if (user?.role === 'student' || user?.role === 'nutritionist') {
        // Students and Nutritionists go to nutritionist dashboard
        navigate('/nutritionist/dashboard');
      } else {
        // Fallback
        navigate('/nutritionist/dashboard');
      }
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        navigate('/account-locked');
        return;
      }
      
      setError(`Código inválido. ${5 - newAttempts} intentos restantes.`);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-emerald-900 dark:text-white mb-2">Autenticación de Dos Factores</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Ingresa el código de 6 dígitos de tu app de autenticación
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Code Input */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white"
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleVerify(code.join(''))}
            disabled={code.some(digit => digit === '')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors"
          >
            Verificar Código
          </button>

          <div className="mt-6 text-center">
            <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              ¿No recibiste el código? Reenviar
            </button>
          </div>

          {/* Demo Info */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Código demo: <span className="text-emerald-600 dark:text-emerald-400 font-mono text-lg font-semibold">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}