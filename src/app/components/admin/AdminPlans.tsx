import { useState } from 'react';
import { Pencil, X, Check, Users, BookOpen, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

interface Plan {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  monthlyPrice: string | null;
  annualPrice: string | null;
  freeLabel: string | null;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

interface UniversityPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

const initialPlans: Plan[] = [
  {
    id: 'students',
    name: 'Students',
    badge: 'Gratuito',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    monthlyPrice: null,
    annualPrice: null,
    freeLabel: 'Gratuito',
    description: 'Vigencia semestral · Datos ficticios únicamente',
    features: [
      'Pacientes ficticios ilimitados',
      'Módulo LFPDPPP',
      'Acceso a plantillas básicas',
    ],
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'basic',
    name: 'Basic',
    badge: 'Más popular',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    monthlyPrice: '$199',
    annualPrice: '$1,990',
    freeLabel: null,
    description: 'MXN/mes · $1,990/año (IVA incluido)',
    features: [
      'Hasta 30 pacientes',
      'Agenda de citas',
      'Plantillas ilimitadas',
      'Solicitudes ARCO',
      'Soporte por correo',
    ],
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Pro',
    badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
    monthlyPrice: '$349',
    annualPrice: '$3,490',
    freeLabel: null,
    description: 'MXN/mes · $3,490/año (IVA incluido)',
    features: [
      'Pacientes ilimitados',
      'Todo lo de Basic',
      'Branding personalizado',
      'Finanzas avanzadas',
      'Soporte prioritario',
    ],
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: 'featured',
    name: 'Complemento Destacado',
    badge: 'Complemento',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    monthlyPrice: '$99',
    annualPrice: '$990',
    freeLabel: null,
    description: 'MXN/mes · $990/año (IVA incluido)',
    features: [
      'Aparecer destacado en catálogo',
      'Máx. 2 por búsqueda',
      'Métricas de impresiones y clics',
      'Requiere cédula verificada',
    ],
    icon: <Zap className="w-5 h-5" />,
  },
];

const initialUniversityPackages: UniversityPackage[] = [
  {
    id: 'aula',
    name: 'Aula',
    price: '$15,000',
    period: 'por semestre (IVA incluido)',
    features: ['Hasta 30 alumnos', 'Acceso Students para cada alumno', 'Panel de seguimiento docente'],
  },
  {
    id: 'formacion',
    name: 'Formación',
    price: '$50,000',
    period: 'por semestre (IVA incluido)',
    features: ['Hasta 150 alumnos', 'Módulos clínicos avanzados', 'Soporte dedicado', 'Reportes de progreso'],
  },
  {
    id: 'integral',
    name: 'Integral',
    price: '$75,000',
    period: 'por semestre (IVA incluido)',
    features: [
      'Alumnos ilimitados',
      'Acceso Pro para docentes',
      'Integración con sistema escolar',
      'Capacitación incluida',
      'Soporte prioritario',
    ],
  },
];

interface EditState {
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
}

interface UniEditState {
  price: string;
  features: string[];
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [uniPackages, setUniPackages] = useState<UniversityPackage[]>(initialUniversityPackages);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingUniId, setEditingUniId] = useState<string | null>(null);
  const [planEditState, setPlanEditState] = useState<EditState>({ monthlyPrice: '', annualPrice: '', features: [] });
  const [uniEditState, setUniEditState] = useState<UniEditState>({ price: '', features: [] });

  const stats = [
    { label: 'Students activos', value: 156, color: 'text-slate-700 dark:text-slate-300' },
    { label: 'Basic activos', value: 89, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Pro activos', value: 34, color: 'text-violet-600 dark:text-violet-400' },
  ];

  function startEditPlan(plan: Plan) {
    setEditingPlanId(plan.id);
    setPlanEditState({
      monthlyPrice: plan.monthlyPrice ?? '',
      annualPrice: plan.annualPrice ?? '',
      features: [...plan.features],
    });
  }

  function cancelEditPlan() {
    setEditingPlanId(null);
  }

  function savePlan(planId: string) {
    setPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? {
              ...p,
              monthlyPrice: planEditState.monthlyPrice || null,
              annualPrice: planEditState.annualPrice || null,
              features: planEditState.features.filter(f => f.trim() !== ''),
            }
          : p,
      ),
    );
    setEditingPlanId(null);
    toast.success('Plan actualizado correctamente.');
  }

  function updateFeature(index: number, value: string) {
    setPlanEditState(prev => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  }

  function addFeature() {
    setPlanEditState(prev => ({ ...prev, features: [...prev.features, ''] }));
  }

  function removeFeature(index: number) {
    setPlanEditState(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  }

  function startEditUni(pkg: UniversityPackage) {
    setEditingUniId(pkg.id);
    setUniEditState({ price: pkg.price, features: [...pkg.features] });
  }

  function cancelEditUni() {
    setEditingUniId(null);
  }

  function saveUni(pkgId: string) {
    setUniPackages(prev =>
      prev.map(p =>
        p.id === pkgId
          ? { ...p, price: uniEditState.price, features: uniEditState.features.filter(f => f.trim() !== '') }
          : p,
      ),
    );
    setEditingUniId(null);
    toast.success('Paquete actualizado correctamente.');
  }

  function updateUniFeature(index: number, value: string) {
    setUniEditState(prev => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  }

  function addUniFeature() {
    setUniEditState(prev => ({ ...prev, features: [...prev.features, ''] }));
  }

  function removeUniFeature(index: number) {
    setUniEditState(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Planes y Precios" showMenu />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Stats row */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-1"
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Plans section */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Planes de suscripción</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(plan => {
              const isEditing = editingPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400">{plan.icon}</span>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{plan.name}</h3>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Pricing */}
                  {!isEditing ? (
                    <div>
                      {plan.freeLabel ? (
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{plan.freeLabel}</p>
                      ) : (
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          {plan.monthlyPrice}{' '}
                          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                            {plan.description}
                          </span>
                        </p>
                      )}
                      {plan.freeLabel && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{plan.description}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Precio mensual (MXN)
                        </label>
                        <input
                          type="text"
                          value={planEditState.monthlyPrice}
                          onChange={e => setPlanEditState(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="$199"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Precio anual (MXN)
                        </label>
                        <input
                          type="text"
                          value={planEditState.annualPrice}
                          onChange={e => setPlanEditState(prev => ({ ...prev, annualPrice: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="$1,990"
                        />
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {!isEditing ? (
                    <ul className="space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Características</p>
                      {planEditState.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={f}
                            onChange={e => updateFeature(i, e.target.value)}
                            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => removeFeature(i)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addFeature}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        + Agregar característica
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {!isEditing ? (
                      <button
                        onClick={() => startEditPlan(plan)}
                        className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => savePlan(plan.id)}
                          className="flex items-center gap-1.5 text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Guardar
                        </button>
                        <button
                          onClick={cancelEditPlan}
                          className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* University packages */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Paquetes Universidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {uniPackages.map(pkg => {
              const isEditing = editingUniId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4"
                >
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{pkg.name}</h3>

                  {!isEditing ? (
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pkg.price}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{pkg.period}</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Precio (MXN)
                      </label>
                      <input
                        type="text"
                        value={uniEditState.price}
                        onChange={e => setUniEditState(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {!isEditing ? (
                    <ul className="space-y-2 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Características</p>
                      {uniEditState.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={f}
                            onChange={e => updateUniFeature(i, e.target.value)}
                            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => removeUniFeature(i)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addUniFeature}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        + Agregar característica
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {!isEditing ? (
                      <button
                        onClick={() => startEditUni(pkg)}
                        className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => saveUni(pkg.id)}
                          className="flex items-center gap-1.5 text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Guardar
                        </button>
                        <button
                          onClick={cancelEditUni}
                          className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center pb-4">
          Todos los precios incluyen IVA. Precios en pesos mexicanos (MXN). Los paquetes Universidad se facturan por
          semestre.
        </p>
      </main>
    </div>
  );
}
