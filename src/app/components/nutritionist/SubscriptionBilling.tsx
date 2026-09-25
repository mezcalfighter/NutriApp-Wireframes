import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';
import MobileNav from '../shared/MobileNav';
import { useAuth } from '../../App';

const billingHistory = [
  { folio: 'MP-2026-00821', fecha: '25 sep 2026', monto: '$199 MXN', estado: 'Pagado' },
  { folio: 'MP-2026-00654', fecha: '25 ago 2026', monto: '$199 MXN', estado: 'Pagado' },
  { folio: 'MP-2026-00493', fecha: '25 jul 2026', monto: '$199 MXN', estado: 'Pagado' },
  { folio: 'MP-2026-00311', fecha: '25 jun 2026', monto: '$199 MXN', estado: 'Pagado' },
];

export default function SubscriptionBilling() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredActive, setFeaturedActive] = useState(false);
  const [cedulaVerified] = useState(false);

  const handleFeaturedToggle = () => {
    if (!featuredActive && !cedulaVerified) {
      setFeaturedActive(true);
      return;
    }
    if (!featuredActive && cedulaVerified) {
      setFeaturedActive(true);
      toast.success('Complemento Destacado activado.');
      return;
    }
    setFeaturedActive(false);
    toast('Complemento Destacado desactivado.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Suscripción y Pagos" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Plan actual */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Plan actual
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-l-4 border-emerald-500 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Basic</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">$199 <span className="text-base font-medium text-slate-500 dark:text-slate-400">MXN/mes</span></p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Activa
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Próxima renovación: <span className="font-medium text-slate-800 dark:text-slate-200">25 de octubre de 2026</span>
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-1 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              Cambiar de plan
            </button>
          </div>
        </section>

        {/* Historial de cobros */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Historial de cobros
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">Folio Mercado Pago</th>
                    <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">Fecha</th>
                    <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">Monto</th>
                    <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((row, i) => (
                    <tr
                      key={row.folio}
                      className={`border-b last:border-b-0 border-slate-100 dark:border-slate-800 ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}
                    >
                      <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{row.folio}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.fecha}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.monto}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          {row.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Complemento Destacado */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Complemento Destacado en el catálogo
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Destacado en el catálogo</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">$99 MXN/mes · $990/año</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={handleFeaturedToggle}
                aria-pressed={featuredActive}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  featuredActive
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                    featuredActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* State feedback */}
            {featuredActive && !cedulaVerified && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Para activar Destacado necesitas la insignia <span className="font-semibold">Perfil verificado</span>. Sube tu cédula en Perfil público.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/nutritionist/public-profile')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                >
                  Ir a Perfil público
                </button>
              </div>
            )}

            {featuredActive && cedulaVerified && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                  Destacado activo. Métricas en Ajustes de Destacado.
                </p>
              </div>
            )}

            <div className="flex items-start gap-2 pt-1">
              <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Serás dirigido a Mercado Pago para completar el pago. NutriApp no guarda datos de tu tarjeta.
              </p>
            </div>
          </div>
        </section>

      </main>

      <MobileNav role="nutritionist" />
    </div>
  );
}
