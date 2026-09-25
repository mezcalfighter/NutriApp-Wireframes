import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Clipboard, Menu, X, Heart, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

export default function FeaturesPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'nutritionist'>('nutritionist');

  const nutritionistFeatures = [
    { icon: Clipboard, title: 'Expediente clínico digital', desc: 'Cumplimiento LFPDPPP automático con formularios de consentimiento, derechos ARCO y eliminación segura conforme a NOM-004-SSA3-2012.' },
    { icon: '📅', title: 'Agenda y disponibilidad', desc: 'Gestiona tus citas en línea, establece horarios disponibles y evita conflictos de agenda. Los pacientes ven solo tus slots disponibles.' },
    { icon: '🍽️', title: 'Planes de dieta y plantillas', desc: 'Crea y reutiliza planes nutricionales con plantillas personalizables. Ahorra tiempo en cada consulta.' },
    { icon: '📊', title: 'Seguimiento de progreso', desc: 'Monitorea resultados de tus pacientes con gráficas de peso, medidas corporales y cumplimiento de planes.' },
    { icon: '💰', title: 'Módulo de finanzas', desc: 'Visualiza ingresos, proyecciones mensuales y estadísticas de tu práctica en tiempo real.' },
    { icon: '👥', title: 'Feed social para pacientes', desc: 'Publica recetas, consejos nutricionales y contenido educativo para tus pacientes.' },
    { icon: '📱', title: 'Notificaciones SMS y WhatsApp', desc: 'Recordatorios automáticos de citas para reducir ausencias. Los pacientes reciben avisos 24h antes.' },
    { icon: '📄', title: 'Reportes PDF firmados', desc: 'Genera reportes profesionales con firma digital y compártelos vía links S3 seguros.' },
  ];

  const patientFeatures = [
    { icon: '🔍', title: 'Búsqueda de nutriólogos por CP', desc: 'Encuentra profesionales certificados cerca de tu ubicación. Filtra por especialidad y disponibilidad.' },
    { icon: '👤', title: 'Perfil público del nutriólogo', desc: 'Conoce su experiencia, cédula profesional, especialidades y opiniones de otros pacientes.' },
    { icon: '📅', title: 'Agenda de citas online', desc: 'Reserva tu cita en minutos viendo los horarios disponibles en tiempo real. Sin llamadas.' },
    { icon: '🍴', title: 'Acceso a tu plan nutricional', desc: 'Consulta tu dieta, recetas y recomendaciones desde tu celular en cualquier momento.' },
    { icon: '📈', title: 'Registro de progreso', desc: 'Lleva el control de tu peso, medidas y avances. Comparte tu progreso con tu nutriólogo.' },
    { icon: '⭐', title: 'Evaluación de mi nutriólogo', desc: 'Comparte tu experiencia y ayuda a otros pacientes a encontrar al profesional ideal.' },
    { icon: '🔔', title: 'Recordatorios de citas', desc: 'Recibe notificaciones por email, SMS o WhatsApp para no olvidar tus consultas.' },
    { icon: '📱', title: 'App 100% gratuita', desc: 'Sin costos ocultos. Pagas solo la consulta directamente con tu nutriólogo.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
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
                  className="text-emerald-600 dark:text-emerald-400 font-semibold"
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
                className="w-full text-left px-4 py-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Todo lo que necesitas en un solo lugar
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Funcionalidades diseñadas específicamente para nutriólogos y pacientes
          </p>
        </div>

        {/* Toggle for User Type */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setUserType('nutritionist')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-medium transition-all ${
                userType === 'nutritionist'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🍎 Nutriólogos
            </button>
            <button
              onClick={() => setUserType('patient')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-medium transition-all ${
                userType === 'patient'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👤 Pacientes
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(userType === 'nutritionist' ? nutritionistFeatures : patientFeatures).map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {typeof feature.icon === 'string' ? (
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                ) : (
                  <feature.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/pricing')}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg transition-colors"
          >
            Ver Planes y Precios
          </button>
        </div>
      </div>
    </div>
  );
}
