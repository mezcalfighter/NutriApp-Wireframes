import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../App';
import {Target, Tag, DollarSign, Clock, Eye, EyeOff, Save, Trash2, Edit2, Settings as SettingsIcon, TrendingUp, Plus, X } from 'lucide-react';
import { AVAILABLE_METRICS, MetricDefinition } from '../../utils/metricsCalculations';

interface MetricConfig {
  metricId: string;
  visible: boolean;
  targetValue: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  usageCount: number;
  maxUsage?: number;
}

interface ConsultationType {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nutritionistSettings, updateNutritionistSettings } = useApp();
  const isStudentsAccount = user?.planType === 'students';
  const [activeTab, setActiveTab] = useState<'metrics' | 'coupons' | 'pricing'>('metrics');
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [showEditMetricModal, setShowEditMetricModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<{metric: MetricDefinition; config: MetricConfig} | null>(null);

  const [metricConfigs, setMetricConfigs] = useState<MetricConfig[]>(nutritionistSettings.metrics || []);
  
  // Initialize metrics config if not exists
  useEffect(() => {
    if (nutritionistSettings.metrics.length === 0) {
      // Initialize with default configs for some metrics
      const defaultConfigs: MetricConfig[] = [
        { metricId: 'weeklyIncome', visible: true, targetValue: 15000 },
        { metricId: 'totalPatients', visible: true, targetValue: 50 },
        { metricId: 'newPatientsThisMonth', visible: true, targetValue: 10 },
        { metricId: 'appointmentsThisWeek', visible: true, targetValue: 25 },
      ];
      setMetricConfigs(defaultConfigs);
      updateNutritionistSettings({ metrics: defaultConfigs });
    } else {
      setMetricConfigs(nutritionistSettings.metrics);
    }
  }, []);

  // Save metrics to context whenever they change
  useEffect(() => {
    updateNutritionistSettings({ metrics: metricConfigs });
  }, [metricConfigs]);

  const [coupons, setCoupons] = useState<Coupon[]>(nutritionistSettings.coupons || [
    {
      id: '1',
      code: 'BIENVENIDA30',
      discount: 30,
      type: 'percentage',
      active: true,
      usageCount: 12,
      maxUsage: 50,
    },
    {
      id: '2',
      code: 'REFERIDO15',
      discount: 15,
      type: 'percentage',
      active: true,
      usageCount: 8,
    },
  ]);

  // Save coupons to context whenever they change
  useEffect(() => {
    updateNutritionistSettings({ coupons });
  }, [coupons]);

  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>(nutritionistSettings.consultationTypes || [
    {
      id: '1',
      name: 'Consulta Inicial',
      price: 1500,
      duration: 60,
    },
    {
      id: '2',
      name: 'Consulta Seguimiento',
      price: 1000,
      duration: 45,
    },
  ]);

  // Save consultation types to context whenever they change
  useEffect(() => {
    updateNutritionistSettings({ consultationTypes });
  }, [consultationTypes]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'fixed',
    maxUsage: '',
  });

  const [newConsultationType, setNewConsultationType] = useState({
    name: '',
    price: '',
    duration: '',
  });

  const [newMetric, setNewMetric] = useState({
    metricId: '',
    targetValue: '',
  });

  const [targetValueInput, setTargetValueInput] = useState('');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      discount: parseFloat(newCoupon.discount),
      type: newCoupon.type,
      active: true,
      usageCount: 0,
      maxUsage: newCoupon.maxUsage ? parseInt(newCoupon.maxUsage) : undefined,
    };
    setCoupons([...coupons, coupon]);
    setNewCoupon({ code: '', discount: '', type: 'percentage', maxUsage: '' });
    setShowAddCouponModal(false);
  };

  const handleAddPricing = (e: React.FormEvent) => {
    e.preventDefault();
    const consultationType: ConsultationType = {
      id: Date.now().toString(),
      name: newConsultationType.name,
      price: parseFloat(newConsultationType.price),
      duration: parseInt(newConsultationType.duration),
    };
    setConsultationTypes([...consultationTypes, consultationType]);
    setNewConsultationType({ name: '', price: '', duration: '' });
    setShowAddPricingModal(false);
  };

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetric.metricId || !newMetric.targetValue) return;

    const metric: MetricConfig = {
      metricId: newMetric.metricId,
      visible: true,
      targetValue: parseFloat(newMetric.targetValue),
    };
    
    setMetricConfigs([...metricConfigs, metric]);
    setNewMetric({ metricId: '', targetValue: '' });
    setShowAddMetricModal(false);
  };

  const toggleMetricVisibility = (metricId: string) => {
    setMetricConfigs(metricConfigs.map(config => 
      config.metricId === metricId ? { ...config, visible: !config.visible } : config
    ));
  };

  const openEditMetric = (metric: MetricDefinition) => {
    const config = metricConfigs.find(c => c.metricId === metric.id);
    if (config) {
      setEditingMetric({ metric, config });
      setTargetValueInput(config.targetValue.toString());
      setShowEditMetricModal(true);
    }
  };

  const handleSaveMetricTarget = () => {
    if (editingMetric && targetValueInput) {
      setMetricConfigs(metricConfigs.map(config => 
        config.metricId === editingMetric.metric.id 
          ? { ...config, targetValue: parseFloat(targetValueInput) } 
          : config
      ));
      setShowEditMetricModal(false);
      setEditingMetric(null);
      setTargetValueInput('');
    }
  };

  const deleteMetric = (metricId: string) => {
    setMetricConfigs(metricConfigs.filter(config => config.metricId !== metricId));
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const deleteConsultationType = (id: string) => {
    setConsultationTypes(consultationTypes.filter(ct => ct.id !== id));
  };

  // Get available metrics (not yet added)
  const availableMetricsToAdd = AVAILABLE_METRICS.filter(
    metric => !metricConfigs.some(config => config.metricId === metric.id)
  );

  // Get added metrics with their definitions
  const addedMetrics = metricConfigs.map(config => {
    const definition = AVAILABLE_METRICS.find(m => m.id === config.metricId);
    return { config, definition };
  }).filter(item => item.definition !== undefined);

  // Group by category
  const metricsByCategory = addedMetrics.reduce((acc, item) => {
    const category = item.definition!.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof addedMetrics>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return <DollarSign className="w-5 h-5" />;
      case 'patients': return <Target className="w-5 h-5" />;
      case 'appointments': return <Clock className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      default: return <SettingsIcon className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'financial': return 'Métricas Financieras';
      case 'patients': return 'Métricas de Pacientes';
      case 'appointments': return 'Métricas de Citas';
      case 'performance': return 'Métricas de Desempeño';
      default: return 'Otras Métricas';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Configuración" showBack showMenu />

      <div className="p-4 space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm flex gap-1">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'metrics'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Métricas
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'coupons'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cupones
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'pricing'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Precios
          </button>
        </div>

        {activeTab === 'metrics' ? (
          <>
            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-900 dark:text-blue-100 text-sm">
                💡 Las métricas se calculan automáticamente desde tus citas. Agrega las que quieras monitorear y define sus metas.
              </p>
            </div>

            {/* Add Metric Button */}
            {availableMetricsToAdd.length > 0 && (
              <button
                onClick={() => setShowAddMetricModal(true)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar Métrica
              </button>
            )}

            {/* Added Metrics by Category */}
            {Object.keys(metricsByCategory).length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-900 dark:text-white mb-2">No hay métricas agregadas</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Agrega métricas para monitorear el desempeño de tu práctica
                </p>
              </div>
            ) : (
              (Object.keys(metricsByCategory) as Array<keyof typeof metricsByCategory>).map((category) => {
                const metrics = metricsByCategory[category];
                if (!metrics || metrics.length === 0) return null;

                return (
                  <div key={category} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        {getCategoryIcon(category)}
                      </div>
                      <h3 className="text-slate-900 dark:text-white">{getCategoryLabel(category)}</h3>
                    </div>

                    <div className="space-y-3">
                      {metrics.map(({ config, definition }) => {
                        if (!definition) return null;
                        const isVisible = config.visible;

                        return (
                          <div
                            key={config.metricId}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-slate-900 dark:text-white">{definition.name}</p>
                              <p className="text-slate-600 dark:text-slate-400 text-sm">{definition.description}</p>
                              <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
                                Meta: {definition.unit === 'MXN' ? `$${config.targetValue.toLocaleString()}` : config.targetValue}{definition.unit !== 'MXN' && definition.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditMetric(definition)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Editar meta"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleMetricVisibility(definition.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isVisible
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                }`}
                                title={isVisible ? 'Ocultar en dashboard' : 'Mostrar en dashboard'}
                              >
                                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => deleteMetric(definition.id)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Eliminar métrica"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            {/* Add Metric Modal */}
            {showAddMetricModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl text-slate-900 dark:text-white">Agregar Métrica</h3>
                    <button
                      onClick={() => {
                        setShowAddMetricModal(false);
                        setNewMetric({ metricId: '', targetValue: '' });
                      }}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddMetric} className="space-y-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Métrica</label>
                      <select
                        value={newMetric.metricId}
                        onChange={(e) => {
                          const metric = AVAILABLE_METRICS.find(m => m.id === e.target.value);
                          setNewMetric({ 
                            metricId: e.target.value, 
                            targetValue: metric ? metric.defaultTarget.toString() : '' 
                          });
                        }}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      >
                        <option value="">Selecciona una métrica</option>
                        {availableMetricsToAdd.map((metric) => (
                          <option key={metric.id} value={metric.id}>
                            {metric.name} ({metric.unit})
                          </option>
                        ))}
                      </select>
                      {newMetric.metricId && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                          {AVAILABLE_METRICS.find(m => m.id === newMetric.metricId)?.description}
                        </p>
                      )}
                    </div>
                    
                    {newMetric.metricId && (
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2">Valor Objetivo</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newMetric.targetValue}
                            onChange={(e) => setNewMetric({ ...newMetric, targetValue: e.target.value })}
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Ingresa el valor objetivo"
                            required
                          />
                          <span className="text-slate-600 dark:text-slate-400">
                            {AVAILABLE_METRICS.find(m => m.id === newMetric.metricId)?.unit}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                          {AVAILABLE_METRICS.find(m => m.id === newMetric.metricId)?.higherIsBetter 
                            ? '📈 Meta: alcanzar o superar este valor' 
                            : '📉 Meta: mantener por debajo de este valor'}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMetricModal(false);
                          setNewMetric({ metricId: '', targetValue: '' });
                        }}
                        className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!newMetric.metricId || !newMetric.targetValue}
                        className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Agregar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Metric Target Modal */}
            {showEditMetricModal && editingMetric && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl text-slate-900 dark:text-white mb-4">Editar Meta</h3>
                  <div className="mb-4">
                    <p className="text-slate-900 dark:text-white font-medium">{editingMetric.metric.name}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{editingMetric.metric.description}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Valor Objetivo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={targetValueInput}
                          onChange={(e) => setTargetValueInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder={editingMetric.metric.defaultTarget.toString()}
                          required
                        />
                        <span className="text-slate-600 dark:text-slate-400">{editingMetric.metric.unit}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        {editingMetric.metric.higherIsBetter 
                          ? '📈 Meta: alcanzar o superar este valor' 
                          : '📉 Meta: mantener por debajo de este valor'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowEditMetricModal(false);
                          setEditingMetric(null);
                          setTargetValueInput('');
                        }}
                        className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveMetricTarget}
                        className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'coupons' ? (
          <>
            {/* Coupons Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 dark:text-white">Cupones de Descuento</h3>
                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                >
                  + Agregar Cupón
                </button>
              </div>

              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <p className="text-slate-900 dark:text-white font-mono">{coupon.code}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {coupon.type === 'percentage' ? `${coupon.discount}% descuento` : `$${coupon.discount} MXN`}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                        Usado {coupon.usageCount} {coupon.maxUsage ? `/ ${coupon.maxUsage}` : ''} veces
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          coupon.active
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {coupon.active ? 'Activo' : 'Inactivo'}
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Coupon Modal */}
            {showAddCouponModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl text-slate-900 dark:text-white mb-4">Agregar Cupón</h3>
                  <form onSubmit={handleAddCoupon} className="space-y-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Código</label>
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="BIENVENIDA30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Tipo</label>
                      <select
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as 'percentage' | 'fixed' })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="percentage">Porcentaje (%)</option>
                        <option value="fixed">Fijo (MXN)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Descuento</label>
                      <input
                        type="number"
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder={newCoupon.type === 'percentage' ? '30' : '500'}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Máximo de usos (opcional)</label>
                      <input
                        type="number"
                        value={newCoupon.maxUsage}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxUsage: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="50"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddCouponModal(false)}
                        className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Pricing Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 dark:text-white">Tipos de Consulta</h3>
                <button
                  onClick={() => setShowAddPricingModal(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                >
                  + Agregar Tipo
                </button>
              </div>

              <div className="space-y-3">
                {consultationTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <p className="text-slate-900 dark:text-white">{type.name}</p>
                      <p className="text-emerald-600 dark:text-emerald-400">${type.price} MXN</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{type.duration} minutos</p>
                    </div>
                    <button
                      onClick={() => deleteConsultationType(type.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Pricing Modal */}
            {showAddPricingModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl text-slate-900 dark:text-white mb-4">Agregar Tipo de Consulta</h3>
                  <form onSubmit={handleAddPricing} className="space-y-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={newConsultationType.name}
                        onChange={(e) => setNewConsultationType({ ...newConsultationType, name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="Consulta Inicial"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Precio (MXN)</label>
                      <input
                        type="number"
                        value={newConsultationType.price}
                        onChange={(e) => setNewConsultationType({ ...newConsultationType, price: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="1500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2">Duración (minutos)</label>
                      <input
                        type="number"
                        value={newConsultationType.duration}
                        onChange={(e) => setNewConsultationType({ ...newConsultationType, duration: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="60"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddPricingModal(false)}
                        className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}
