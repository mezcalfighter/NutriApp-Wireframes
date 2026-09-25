import { useNavigate } from 'react-router';
import { Star, Eye, MousePointer, CalendarCheck, Info } from 'lucide-react';
import Header from '../shared/Header';
import MobileNav from '../shared/MobileNav';
import { useAuth } from '../../App';

const featured = false;

const metrics = [
  { label: 'Impresiones', value: '1,240', icon: Eye, description: 'Veces que apareció tu perfil' },
  { label: 'Clics', value: '89', icon: MousePointer, description: 'Visitas a tu ficha' },
  { label: 'Solicitudes de cita', value: '12', icon: CalendarCheck, description: 'Nuevas solicitudes este mes' },
];

export default function FeaturedSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Ajustes de Destacado" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Estado del complemento */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Estado del complemento
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${featured ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`} />
                <p className="font-semibold text-slate-800 dark:text-slate-100">Destacado en el catálogo</p>
              </div>
              {featured ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                  Inactivo
                </span>
              )}
            </div>

            {featured && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Activo desde</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">1 de agosto de 2026</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Vence</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">31 de octubre de 2026</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA si inactivo */}
        {!featured && (
          <section>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                <Star className="w-7 h-7 text-slate-400 dark:text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">Tu perfil no tiene Destacado activo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Actívalo desde Suscripción y Pagos para aparecer en las primeras posiciones del catálogo.
                </p>
              </div>
              <button
                onClick={() => navigate('/nutritionist/subscription')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Gestionar suscripción
              </button>
            </div>
          </section>
        )}

        {/* Métricas si activo */}
        {featured && (
          <>
            <section>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                Configuración
              </h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ciudad</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Ciudad de México</p>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Especialidad</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nutrición clínica</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                Métricas del mes
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {metrics.map(({ label, value, icon: Icon, description }) => (
                  <div
                    key={label}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-tight">{label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight hidden sm:block">{description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Nota informativa (siempre visible) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Los destacados rotan entre sí de forma equitativa; pagar más no compra un lugar fijo.
          </p>
        </div>

      </main>

      <MobileNav role="nutritionist" />
    </div>
  );
}
