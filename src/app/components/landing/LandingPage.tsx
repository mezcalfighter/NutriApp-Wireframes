import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Menu, X, Clipboard, User as UserIcon, Calendar, TrendingUp, FileText, DollarSign, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import UserTypeDialog from '../shared/UserTypeDialog';
import ContactTicket from '../shared/ContactTicket';

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNavbarSolid, setIsNavbarSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Auto-rotate carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 8);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarSolid(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slides = [
    {
      title: 'Digitaliza tu práctica nutricional',
      subtitle: 'Expediente clínico digital con cumplimiento LFPDPPP automático',
      emoji: '📋',
      gradient: 'from-emerald-500 to-teal-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-emerald-200 dark:border-emerald-800 pb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Clipboard className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Expediente Clínico</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 text-sm">Consentimiento LFPDPPP</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✓</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 text-sm">Derechos ARCO</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✓</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 text-sm">Cifrado AES-256</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✓</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Agenda inteligente 24/7',
      subtitle: 'Tus pacientes agendan online automáticamente, tú solo ves tu calendario lleno',
      emoji: '📅',
      gradient: 'from-blue-500 to-cyan-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-300 dark:border-blue-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-blue-200 dark:border-blue-800 pb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Esta Semana</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-3 text-center shadow-md">
              <div className="text-blue-700 dark:text-blue-300 font-bold text-base">10:00 AM</div>
              <div className="text-slate-700 dark:text-slate-300 text-xs mt-1">M. García</div>
              <div className="text-blue-600 dark:text-blue-400 text-[10px] mt-1">✓ Confirmada</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg p-3 text-center shadow-md">
              <div className="text-emerald-700 dark:text-emerald-300 font-bold text-base">2:00 PM</div>
              <div className="text-slate-700 dark:text-slate-300 text-xs mt-1">J. López</div>
              <div className="text-emerald-600 dark:text-emerald-400 text-[10px] mt-1">✓ Confirmada</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-3 text-center shadow-md">
              <div className="text-purple-700 dark:text-purple-300 font-bold text-base">4:30 PM</div>
              <div className="text-slate-700 dark:text-slate-300 text-xs mt-1">A. Martínez</div>
              <div className="text-purple-600 dark:text-purple-400 text-[10px] mt-1">Nueva</div>
            </div>
            <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center shadow-md flex items-center justify-center">
              <div className="text-slate-400 text-xs">+ Disponible</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Resultados visibles',
      subtitle: 'Gráficas en tiempo real que motivan a tus pacientes',
      emoji: '📊',
      gradient: 'from-purple-500 to-pink-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-300 dark:border-purple-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-purple-200 dark:border-purple-800 pb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Progreso</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Peso perdido</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">-4.3 kg</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-lg p-3 text-center border-2 border-emerald-300 dark:border-emerald-700">
                <div className="text-emerald-700 dark:text-emerald-300 font-bold text-2xl">82.5</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs">Inicial</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg p-3 text-center border-2 border-purple-300 dark:border-purple-700">
                <div className="text-purple-700 dark:text-purple-300 font-bold text-2xl">78.2</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs">Actual</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Legal sin complicaciones',
      subtitle: 'Protege tu práctica: LFPDPPP y NOM-004 automáticos',
      emoji: '🔒',
      gradient: 'from-amber-500 to-orange-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-300 dark:border-amber-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-amber-200 dark:border-amber-800 pb-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Cumplimiento</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">LFPDPPP completo</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">NOM-004-SSA3-2012</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Cifrado AES-256</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Audit log completo</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Finanzas claras',
      subtitle: 'Visualiza ingresos, proyecciones y consultas en un dashboard',
      emoji: '💰',
      gradient: 'from-teal-500 to-emerald-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-teal-300 dark:border-teal-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-teal-200 dark:border-teal-800 pb-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Este Mes</span>
          </div>
          <div className="bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-800 dark:to-emerald-800 rounded-xl p-4 border-2 border-teal-300 dark:border-teal-700 shadow-md">
            <div className="text-teal-700 dark:text-teal-300 text-sm mb-1">Ingresos totales</div>
            <div className="text-slate-900 dark:text-white font-bold text-3xl">$12,450</div>
            <div className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">↗ +23% vs mes pasado</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">38</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs mt-1">Consultas</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$328</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs mt-1">Promedio</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Notificaciones inteligentes',
      subtitle: 'SMS y WhatsApp automáticos reducen ausencias hasta 80%',
      emoji: '📱',
      gradient: 'from-indigo-500 to-purple-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-indigo-200 dark:border-indigo-800 pb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Recordatorios</span>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-lg p-3 border-2 border-emerald-300 dark:border-emerald-700 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💬</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">WhatsApp</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-xs">
                "Tu cita es mañana a las 10:00 AM con Dra. González"
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-lg p-3 border-2 border-blue-300 dark:border-blue-700 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💬</span>
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">SMS</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-xs">
                "Recordatorio: Cita en 2 horas"
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-xs">Tasa de asistencia</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">92%</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Plantillas reutilizables',
      subtitle: 'Crea una vez, usa infinitas veces. Ahorra horas cada semana',
      emoji: '📝',
      gradient: 'from-rose-500 to-pink-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-rose-300 dark:border-rose-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-rose-200 dark:border-rose-800 pb-3">
            <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Mis Plantillas</span>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-800 dark:to-pink-800 rounded-lg p-3 border-2 border-rose-300 dark:border-rose-700 shadow-md">
              <div className="text-rose-700 dark:text-rose-300 font-semibold text-sm mb-1">Plan Pérdida Peso</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">Usada 24 veces este mes</div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg p-3 border-2 border-purple-300 dark:border-purple-700 shadow-md">
              <div className="text-purple-700 dark:text-purple-300 font-semibold text-sm mb-1">Diabetes tipo 2</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">Usada 18 veces este mes</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-lg p-3 border-2 border-emerald-300 dark:border-emerald-700 shadow-md">
              <div className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-1">Ganancia muscular</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">Usada 12 veces este mes</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Reportes profesionales',
      subtitle: 'PDFs con firma digital y links seguros para tus pacientes',
      emoji: '📄',
      gradient: 'from-cyan-500 to-blue-500',
      dashboardImage: (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-cyan-300 dark:border-cyan-700 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b-2 border-cyan-200 dark:border-cyan-800 pb-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Reportes</span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-2 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-800 dark:to-blue-800 rounded-lg flex items-center justify-center border-2 border-cyan-300 dark:border-cyan-700">
                <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-slate-900 dark:text-white font-semibold text-sm">Plan Nutricional</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">María García • 08/05/2026</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg p-2 border border-emerald-300 dark:border-emerald-700">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">✓ Firmado digitalmente</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-800 dark:to-blue-800 rounded-lg p-3 border-2 border-cyan-300 dark:border-cyan-700 text-center">
            <div className="text-cyan-700 dark:text-cyan-300 font-semibold text-sm">🔗 Link S3 seguro</div>
            <div className="text-slate-600 dark:text-slate-400 text-xs mt-1">Expira en 7 días</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Sticky Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isNavbarSolid
            ? 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">NutriApp</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/funcionalidades')}
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Planes
              </button>
              <button
                onClick={() => navigate('/buscar-nutriologo')}
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Buscar nutriólogo
              </button>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setShowUserTypeDialog(true)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Comenzar gratis
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300"
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
                onClick={() => { navigate('/funcionalidades'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Planes
              </button>
              <button
                onClick={() => { navigate('/buscar-nutriologo'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Buscar nutriólogo
              </button>
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setShowUserTypeDialog(true); setMobileMenuOpen(false); }}
                className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-center"
              >
                Comenzar gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
                <span className="text-2xl">{slides[currentSlide].emoji}</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                  Slide {currentSlide + 1} de {slides.length}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                {slides[currentSlide].title}
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400">
                {slides[currentSlide].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setShowUserTypeDialog(true)}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg transition-colors"
                >
                  Comenzar gratis
                </button>
                <button
                  onClick={() => navigate('/funcionalidades')}
                  className="px-8 py-4 border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-900 dark:text-white text-lg font-semibold rounded-lg transition-colors"
                >
                  Ver funcionalidades
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="flex gap-2 pt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-emerald-500 w-8'
                        : 'bg-slate-300 dark:bg-slate-700 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto">
                {slides[currentSlide].dashboardImage}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Confiado por nutriólogos en todo México
            </h2>
            <p className="text-emerald-100 text-lg">
              Únete a la plataforma que está transformando la nutrición digital
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">2,500+</div>
              <div className="text-emerald-100">Nutriólogos activos</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-emerald-100">Pacientes atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">92%</div>
              <div className="text-emerald-100">Tasa de asistencia</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-emerald-100">LFPDPPP compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Empieza en 3 pasos
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              De registro a primera consulta en menos de 10 minutos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Crea tu cuenta</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Regístrate gratis con tu correo. Para nutriólogos: verifica tu cédula profesional automáticamente.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Configura tu perfil</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Agrega tu disponibilidad, especialidades y precios. Todo queda listo en minutos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Recibe pacientes</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Tus pacientes agendan online. Tú solo consultas tu calendario lleno y atiendes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Lo que dicen nuestros nutriólogos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                "NutriApp me ahorró 10 horas semanales en papeleo. El cumplimiento LFPDPPP es automático y me da tranquilidad total."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">MG</span>
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold">Dra. María González</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">Lic. en Nutrición</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                "Mis ausencias bajaron de 35% a solo 8% con los recordatorios automáticos de WhatsApp. Mis ingresos aumentaron 40%."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 dark:text-blue-400 font-semibold">JL</span>
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold">Dr. Jorge López</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">Nutriólogo Deportivo</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-yellow-500 text-xl">⭐</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                "La agenda online cambió mi vida. Pacientes reservan 24/7 y yo solo veo mi calendario lleno. Increíble."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 dark:text-purple-400 font-semibold">AR</span>
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold">Dra. Ana Ramírez</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">Nutrióloga Clínica</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-shadow">
              <UserIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">Para pacientes</h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Encuentra al nutriólogo ideal cerca de ti, agenda fácilmente y lleva control de tu progreso sin complicaciones.
              </p>
              <button
                onClick={() => navigate('/buscar-nutriologo')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Buscar nutriólogo →
              </button>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-shadow">
              <Clipboard className="w-12 h-12 text-teal-600 dark:text-teal-400 mb-4" />
              <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-100 mb-3">Para nutriólogos</h3>
              <p className="text-teal-800 dark:text-teal-200 mb-4">
                Digitaliza tu práctica con cumplimiento legal automático, gestiona expedientes de forma segura y haz crecer tu consulta.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Ver planes →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transforma tu práctica hoy
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Miles de nutriólogos ya digitalizaron su consulta. Tú puedes ser el siguiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowUserTypeDialog(true)}
              className="px-10 py-5 bg-white text-emerald-600 text-lg font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-xl"
            >
              Comenzar gratis
            </button>
            <button
              onClick={() => navigate('/funcionalidades')}
              className="px-10 py-5 border-2 border-white text-white text-lg font-bold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Ver funcionalidades
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <span className="text-xl font-bold">NutriApp</span>
              </div>
              <p className="text-slate-400 text-sm">
                © 2026 NutriApp. Todos los derechos reservados.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/aviso-privacidad')}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Aviso de Privacidad
              </button>
              <button
                onClick={() => navigate('/terminos-uso')}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Términos de Uso
              </button>
              <button
                onClick={() => navigate('/students')}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Students Program
              </button>
              <button
                onClick={() => setShowContactDialog(true)}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Contacto
              </button>
              <button
                onClick={() => navigate('/buscar-nutriologo')}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Encontrar Nutriólogo
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold mb-3">Síguenos</h4>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/nutriapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 dark:bg-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" strokeWidth={2} />
                </a>
                <a
                  href="https://linkedin.com/company/nutriapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 dark:bg-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" strokeWidth={2} />
                </a>
                <a
                  href="https://instagram.com/nutriapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 dark:bg-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" strokeWidth={2} />
                </a>
                <a
                  href="mailto:contacto@nutriapp.com"
                  className="w-10 h-10 bg-slate-800 dark:bg-slate-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-white" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <UserTypeDialog
        open={showUserTypeDialog}
        onOpenChange={setShowUserTypeDialog}
      />
      <ContactTicket
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
      />
    </div>
  );
}
