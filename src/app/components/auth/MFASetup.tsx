import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Smartphone, Copy, CheckCircle, Moon, Sun } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function MFASetup() {
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useApp();
  const secretKey = 'JBSWY3DPEHPK3PXP';

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate('/mfa-verify');
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-emerald-900 dark:text-white mb-2">Configurar Autenticador</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Escanea el código QR con tu app de autenticación
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-6">
            <div className="bg-white dark:bg-slate-700 p-4 rounded-lg inline-block w-full">
              <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-white border-4 border-slate-900 dark:border-slate-300 rounded-lg mb-2 flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-1 p-2">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${
                            Math.random() > 0.5 ? 'bg-slate-900 dark:bg-slate-900' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">Código QR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="mb-6">
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              ¿No puedes escanear? Ingresa esta clave manualmente:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={secretKey}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-slate-900 dark:text-white font-mono text-lg"
              />
              <button
                onClick={handleCopy}
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
            <h3 className="text-emerald-900 dark:text-emerald-400 mb-2">Instrucciones de Configuración</h3>
            <ol className="text-emerald-800 dark:text-emerald-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">1.</span>
                <span>Instala Google Authenticator o app similar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">2.</span>
                <span>Escanea el código QR o ingresa la clave manualmente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">3.</span>
                <span>Ingresa el código de 6 dígitos para verificar</span>
              </li>
            </ol>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Continuar a Verificación
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Omitir por ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
