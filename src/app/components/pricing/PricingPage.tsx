import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, ArrowLeft, Check, Clipboard, Calendar, FileText, TrendingUp, DollarSign, Users, Bell, FileCheck, Search, UserCircle, Star, MessageCircle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import PricingSection from './PricingSection';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

export default function PricingPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'patient' | 'nutritionist'>('nutritionist');

  const nutritionistFeatures = [
    { icon: Clipboard, title: 'Expediente clínico digital', desc: 'Cumplimiento LFPDPPP incluido. Gestiona expedientes con seguridad y privacidad certificada.' },
    { icon: Calendar, title: 'Agenda inteligente', desc: 'Define tu disponibilidad y permite que pacientes agenden citas 24/7 sin intermediarios.' },
    { icon: FileText, title: 'Planes de dieta personalizados', desc: 'Crea plantillas reutilizables y personaliza planes nutricionales para cada paciente.' },
    { icon: TrendingUp, title: 'Seguimiento de progreso', desc: 'Monitorea peso, medidas y avances de tus pacientes con gráficas detalladas.' },
    { icon: DollarSign, title: 'Módulo de finanzas', desc: 'Visualiza ingresos, proyecciones y estadísticas de tu práctica en tiempo real.' },
    { icon: Users, title: 'Feed social para pacientes', desc: 'Publica recetas, consejos nutricionales y contenido educativo para tus pacientes.' },
    { icon: Bell, title: 'Notificaciones automáticas', desc: 'Recordatorios por SMS y WhatsApp para reducir ausencias a consultas.' },
    { icon: FileCheck, title: 'Reportes profesionales', desc: 'Genera PDFs firmados digitalmente con links seguros S3 para compartir con pacientes.' },
  ];

  const patientFeatures = [
    { icon: Search, title: 'Búsqueda por código postal', desc: 'Encuentra nutriólogos certificados cerca de ti con especialidades específicas.' },
    { icon: UserCircle, title: 'Perfiles verificados', desc: 'Consulta experiencia, especialidades, certificaciones y opiniones de otros pacientes.' },
    { icon: Calendar, title: 'Agenda en línea 24/7', desc: 'Reserva tu cita en segundos viendo disponibilidad en tiempo real del nutriólogo.' },
    { icon: FileText, title: 'Mi plan nutricional', desc: 'Accede a tu plan de dieta personalizado desde cualquier dispositivo en cualquier momento.' },
    { icon: TrendingUp, title: 'Registro de progreso', desc: 'Lleva el control de tu peso, medidas y avances para compartir con tu nutriólogo.' },
    { icon: Star, title: 'Sistema de reseñas', desc: 'Evalúa tu experiencia y ayuda a otros pacientes a encontrar al nutriólogo ideal.' },
    { icon: Bell, title: 'Recordatorios de citas', desc: 'Recibe notificaciones para no olvidar tus consultas y seguir tu plan.' },
    { icon: Lock, title: 'Privacidad garantizada', desc: 'Tus datos médicos protegidos con estándares LFPDPPP y encriptación de grado médico.' },
  ];

  const currentFeatures = userType === 'nutritionist' ? nutritionistFeatures : patientFeatures;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Planes y Precios
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Información de precios según tu perfil
          </p>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-8">
            <ToggleGroup
              type="single"
              value={userType}
              onValueChange={(value) => value && setUserType(value as 'patient' | 'nutritionist')}
              className="inline-flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-xl shadow-md border border-slate-300 dark:border-slate-700"
            >
              <ToggleGroupItem
                value="patient"
                className="px-8 py-3 rounded-lg font-medium transition-all data-[state=on]:bg-white data-[state=on]:dark:bg-slate-900 data-[state=on]:shadow-lg data-[state=on]:text-emerald-600 data-[state=on]:dark:text-emerald-400 data-[state=off]:text-slate-600 data-[state=off]:dark:text-slate-400"
              >
                👤 Soy paciente
              </ToggleGroupItem>
              <ToggleGroupItem
                value="nutritionist"
                className="px-8 py-3 rounded-lg font-medium transition-all data-[state=on]:bg-white data-[state=on]:dark:bg-slate-900 data-[state=on]:shadow-lg data-[state=on]:text-emerald-600 data-[state=on]:dark:text-emerald-400 data-[state=off]:text-slate-600 data-[state=off]:dark:text-slate-400"
              >
                🩺 Soy nutriólogo
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Features Carousel */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
              {userType === 'nutritionist' ? 'Funcionalidades para nutriólogos' : 'Funcionalidades para pacientes'}
            </h2>
            <div className="relative px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {currentFeatures.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <Card className="h-full border-2 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-xl flex items-center justify-center">
                                  <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                    {feature.title}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>
        </div>

        {/* Content based on user type */}
        {userType === 'patient' ? (
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-emerald-500 dark:border-emerald-400">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">100% Gratis para Pacientes</CardTitle>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Crear tu cuenta y buscar nutriólogos es completamente gratuito
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3 text-lg">
                    ¿Cómo funcionan los pagos?
                  </h3>
                  <p className="text-emerald-800 dark:text-emerald-200 mb-4">
                    El pago de las consultas es directo con tu nutriólogo. Tú decides cuándo y cómo pagar según los términos acordados con tu profesional.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 dark:text-emerald-200">Registro gratuito sin tarjeta de crédito</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 dark:text-emerald-200">Busca y compara nutriólogos cerca de ti</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 dark:text-emerald-200">Agenda citas en línea sin costo adicional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 dark:text-emerald-200">Paga la consulta directamente con tu nutriólogo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 dark:text-emerald-200">Acceso a tu expediente y plan nutricional</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => navigate('/buscar-nutriologo')}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-lg"
                  >
                    Buscar nutriólogo gratis
                  </button>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                    Sin cargos ocultos · Sin compromiso · Cancela cuando quieras
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <PricingSection showTitle={false} />
        )}
      </div>
    </div>
  );
}
