import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, X, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';

interface PricingSectionProps {
  showTitle?: boolean;
  className?: string;
}

export default function PricingSection({ showTitle = true, className = '' }: PricingSectionProps) {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    patientCount: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `TKT-${Math.floor(10000000 + Math.random() * 90000000)}`;
    toast.success(`Ticket #${ticketId} enviado. Nuestro equipo te contactará en menos de 24 horas.`);
    setShowContactModal(false);
    setContactForm({ name: '', email: '', patientCount: '', message: '' });
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      badge: { text: 'Basic', variant: 'secondary' as const },
      price: { monthly: 199, annual: 1990 },
      priceAnnualTotal: 1990,
      savingsAnnual: 398,
      subtitle: 'Para nutriólogos titulados en Lic. Nutrición o Lic. Nutriología',
      caps: {
        pacientes: 30,
        consultas: 100,
        sms: { limit: 20, used: 0 },
        whatsapp: { limit: 20, used: 0 },
        storage: '1 GB',
      },
      sectionHeader: 'Todo lo de Students +',
      features: [
        'Agenda de citas',
        'Plantillas ilimitadas',
        'Feed social',
        'Notificaciones SMS/WhatsApp',
      ],
      excludedFeatures: [
        'Branding',
        'Finanzas',
        'Reportes PDF',
      ],
      cta: {
        text: 'Comenzar con Basic',
        action: () => navigate('/registro?plan=basic'),
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: { text: 'Más popular', variant: 'default' as const },
      price: { monthly: 349, annual: 3490 },
      priceAnnualTotal: 3490,
      savingsAnnual: 698,
      caps: {
        pacientes: 80,
        consultas: 300,
        sms: { limit: 300, used: 0 },
        whatsapp: { limit: 300, used: 0 },
        storage: '5 GB',
      },
      sectionHeader: 'Todo lo de Basic +',
      features: [
        'Branding personalizado',
        'Módulo de finanzas',
        'Reportes PDF + links firmados S3',
        'Sin límite de tiempo',
      ],
      cta: {
        text: 'Comenzar prueba 14 días',
        action: () => navigate('/registro?plan=pro'),
      },
      featured: true,
    },
  ];

  return (
    <div className={className}>
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Planes para cada etapa de tu carrera
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu práctica nutricional
          </p>
        </div>
      )}

      {/* Billing Period Toggle */}
      <div className="flex justify-center items-center gap-4 mb-12">
        <ToggleGroup
          type="single"
          value={billingPeriod}
          onValueChange={(value) => value && setBillingPeriod(value as 'monthly' | 'annual')}
          className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"
        >
          <ToggleGroupItem
            value="monthly"
            className="px-6 py-2 rounded-md data-[state=on]:bg-white data-[state=on]:dark:bg-slate-900 data-[state=on]:shadow-sm"
          >
            Mensual
          </ToggleGroupItem>
          <ToggleGroupItem
            value="annual"
            className="px-6 py-2 rounded-md data-[state=on]:bg-white data-[state=on]:dark:bg-slate-900 data-[state=on]:shadow-sm"
          >
            Anual
          </ToggleGroupItem>
        </ToggleGroup>
        {billingPeriod === 'annual' && (
          <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            Ahorra hasta 44%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.featured
                ? 'border-2 border-blue-500 dark:border-blue-400 shadow-lg relative'
                : ''
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-500 text-white border-blue-600">
                  {plan.badge.text}
                </Badge>
              </div>
            )}

            <CardHeader>
              {!plan.featured && (
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={plan.badge.variant}
                    className={
                      plan.id === 'students'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                        : ''
                    }
                  >
                    {plan.badge.text}
                  </Badge>
                  {plan.requiresInstitutionalEmail && (
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                      Correo institucional requerido
                    </span>
                  )}
                </div>
              )}
              <CardTitle className="text-2xl text-slate-900 dark:text-white">
                {plan.name}
              </CardTitle>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${typeof plan.price === 'number'
                      ? plan.price
                      : billingPeriod === 'annual' && plan.priceAnnualTotal
                        ? plan.priceAnnualTotal
                        : plan.price.monthly}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">MXN</span>
                  {(typeof plan.price === 'object' || plan.price > 0) && (
                    <span className="text-slate-600 dark:text-slate-400">
                      {billingPeriod === 'annual' && plan.priceAnnualTotal ? '/año' : '/mes'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  IVA incluido
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {plan.subtitle}
                </p>
                {typeof plan.price === 'object' && billingPeriod === 'annual' && plan.savingsAnnual && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Ahorras ${plan.savingsAnnual} MXN al año
                  </p>
                )}
                {plan.duration && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded">
                      <Calendar className="w-3 h-3" />
                      {plan.duration}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
              {/* Alert for Students plan */}
              {plan.showAlert && (
                <>
                  <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-900 dark:text-amber-100 text-xs">
                      Recibirás un email 24 horas antes del vencimiento. Si no migras al plan Basic con tu cédula profesional, tu cuenta y todos sus datos se eliminan automáticamente conforme a NOM-004.
                    </AlertDescription>
                  </Alert>
                  {plan.showUpgradeButton && (
                    <button
                      onClick={() => navigate('/registro?plan=basic&upgrade=students')}
                      className="w-full text-sm py-2 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Ya me titulé — migrar a Basic →
                    </button>
                  )}
                </>
              )}

              {/* Caps Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Pacientes activos
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {plan.caps.pacientes}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Consultas/mes
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {plan.caps.consultas}
                    </p>
                  </div>
                </div>

                {/* SMS Progress */}
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">SMS/mes</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {plan.caps.sms.used}/{plan.caps.sms.limit}
                    </p>
                  </div>
                  <Progress value={(plan.caps.sms.used / plan.caps.sms.limit) * 100} />
                </div>

                {/* WhatsApp Progress */}
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">WhatsApp/mes</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {plan.caps.whatsapp.used}/{plan.caps.whatsapp.limit}
                    </p>
                  </div>
                  <Progress value={(plan.caps.whatsapp.used / plan.caps.whatsapp.limit) * 100} />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Almacenamiento
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {plan.caps.storage}
                  </p>
                </div>
              </div>

              {/* Features Section */}
              <div>
                {plan.sectionHeader && (
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    {plan.sectionHeader}
                  </p>
                )}
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded Features */}
              {plan.excludedFeatures && plan.excludedFeatures.length > 0 && (
                <ul className="space-y-2">
                  {plan.excludedFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <X className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <button
                onClick={plan.cta.action}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.featured
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : plan.cta.isPurple
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {plan.cta.text}
              </button>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                Pago procesado por Mercado Pago
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Need More Block */}
      <div className="mb-12">
        <Card className="bg-slate-50 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              ¿Necesitas más capacidad?
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Si tus necesidades superan el plan Pro, nuestro equipo puede diseñar una solución para ti.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">
                  Caps personalizados
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">
                  Almacenamiento extendido
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">
                  Soporte dedicado
                </span>
              </li>
            </ul>
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Abrir ticket
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Students requiere correo institucional y tiene vigencia de el semestre de tu institución. Basic y Pro requieren cédula profesional en Lic. Nutrición o Lic. Nutriología. <span className="font-medium">Todos los planes son para un nutriólogo por cuenta</span> e incluyen: cifrado AES-256 · MFA obligatoria · Aviso de privacidad LFPDPPP · Módulo ARCO · Audit log · Eliminación segura NOM-004. SMS y WhatsApp se contabilizan por separado. <span className="font-medium">Pacientes activos:</span> Un paciente cuenta hacia tu límite al aceptar su primera cita y permanece en tu cuenta aunque canceles citas posteriores.
          </p>
        </div>
      </div>

      {/* Contact Ticket Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Cuéntanos qué necesitas</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email de contacto <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="patientCount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Número de pacientes aproximado <span className="text-red-500">*</span>
              </label>
              <input
                id="patientCount"
                type="number"
                required
                min="1"
                value={contactForm.patientCount}
                onChange={(e) => setContactForm({ ...contactForm, patientCount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Describe brevemente tus necesidades"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No compartimos tu información con terceros.
            </p>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Enviar ticket
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
