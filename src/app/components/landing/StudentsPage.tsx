import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Menu, X, Check, GraduationCap, AlertCircle, X as XIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import StudentsConfirmDialog from '../shared/StudentsConfirmDialog';

export default function StudentsPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStudentsDialog, setShowStudentsDialog] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <Heart className="w-6 h-6" />
                <span className="font-bold text-xl">NutriApp</span>
              </button>
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => navigate('/funcionalidades')}
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Funcionalidades
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Planes
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Comenzar
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => { navigate('/funcionalidades'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Planes
              </button>
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}
                className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-center"
              >
                Comenzar
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 mb-4 text-lg px-4 py-1">
            <GraduationCap className="w-5 h-5 inline mr-2" />
            NutriApp Students
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Practica con seguridad desde la universidad
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Cuenta de práctica GRATUITA con correo institucional (.edu, .edu.mx, .ipn.mx y similares). Incluye 10 pacientes ficticios con datos realistas generados automáticamente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* What's Included */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              ¿Qué incluye?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 dark:text-white font-semibold">10 pacientes ficticios</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Generados automáticamente con datos realistas para practicar</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Hasta 15 consultas/mes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">10 SMS + 10 WhatsApp/mes (simulados)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">100 MB almacenamiento temporal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Expediente clínico digital completo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Formularios de consentimiento LFPDPPP</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Módulo de Derechos ARCO</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">1 plantilla nutricional reutilizable</span>
              </li>
            </ul>
          </div>

          {/* Important Conditions */}
          <div className="space-y-4">
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                <h4 className="font-semibold mb-2">⚠️ Cuenta de Práctica - Datos Ficticios</h4>
                <p className="text-sm mb-2">
                  Los 10 pacientes son <strong>completamente ficticios</strong> con datos realistas generados automáticamente (edades 18-85 años, pesos y alturas realistas, alergias, condiciones médicas, etc.).
                </p>
                <p className="text-sm mb-2">
                  <strong>No puedes agregar más pacientes</strong> ni modificar los datos de los pacientes ficticios. Esta limitación te permite practicar en un entorno seguro sin comprometer datos personales reales.
                </p>
                <h4 className="font-semibold mt-3 mb-1">Vigencia: el semestre de tu institución</h4>
                <p className="text-sm">
                  Recibirás aviso por email 24 horas antes del vencimiento. Si no migras a un plan de pago, tu cuenta y todos los datos de práctica serán eliminados automáticamente conforme a NOM-004-SSA3-2012.
                </p>
              </AlertDescription>
            </Alert>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">¿Qué NO incluye?</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <XIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Agenda de citas (no disponible)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Feed social para pacientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <XIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Branding personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <XIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Módulo de finanzas</span>
                </li>
                <li className="flex items-start gap-2">
                  <XIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Reportes PDF firmados digitalmente</span>
                </li>
                <li className="flex items-start gap-2">
                  <XIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>Agregar pacientes reales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits for Students */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            ¿Por qué usar NutriApp Students?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Aprende sin riesgos</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Practica con datos ficticios sin preocuparte por la privacidad de pacientes reales
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Cumplimiento legal</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Familiarízate con LFPDPPP, NOM-004 y derechos ARCO desde la universidad
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Preparación profesional</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Domina la plataforma antes de trabajar con pacientes reales
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setShowStudentsDialog(true)}
            className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold rounded-lg transition-colors"
          >
            Activar con correo institucional
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            Válido con correos .edu, .edu.mx, .ipn.mx, .unam.mx y similares
          </p>
        </div>
      </div>

      {/* Students Confirm Dialog */}
      <StudentsConfirmDialog
        open={showStudentsDialog}
        onOpenChange={setShowStudentsDialog}
      />
    </div>
  );
}
