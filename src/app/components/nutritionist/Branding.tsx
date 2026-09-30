import { useState, useEffect } from 'react';
import Header from '../shared/Header';
import MobileNav from '../shared/MobileNav';
import { Upload, Building2, Palette, Droplet, Save, Tag } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../App';

const PASTEL_COLORS = [
  { name: 'Verde Menta', value: '#D1FAE5', preview: 'bg-emerald-100' },
  { name: 'Azul Cielo', value: '#DBEAFE', preview: 'bg-blue-100' },
  { name: 'Rosa Suave', value: '#FCE7F3', preview: 'bg-pink-100' },
  { name: 'Lavanda', value: '#EDE9FE', preview: 'bg-purple-100' },
  { name: 'Durazno', value: '#FED7AA', preview: 'bg-orange-100' },
  { name: 'Amarillo Claro', value: '#FEF3C7', preview: 'bg-amber-100' },
  { name: 'Coral', value: '#FEE2E2', preview: 'bg-red-100' },
  { name: 'Turquesa', value: '#CCFBF1', preview: 'bg-teal-100' },
];

export default function NutritionistBranding() {
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const { nutritionistSettings, updateNutritionistSettings } = useApp();

  const [logoPreview, setLogoPreview] = useState<string>(nutritionistSettings.logo);
  const [watermarkPreview, setWatermarkPreview] = useState<string>(nutritionistSettings.watermark);
  const [selectedColor, setSelectedColor] = useState(nutritionistSettings.pdfColor);
  const [pdfLabels, setPdfLabels] = useState(nutritionistSettings.pdfLabels);

  useEffect(() => {
    // Update previews when settings change
    setLogoPreview(nutritionistSettings.logo);
    setWatermarkPreview(nutritionistSettings.watermark);
    setPdfLabels(nutritionistSettings.pdfLabels);
  }, [nutritionistSettings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWatermarkPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLabelChange = (key: keyof typeof pdfLabels, value: string) => {
    setPdfLabels(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNutritionistSettings({
      logo: logoPreview,
      watermark: watermarkPreview,
      pdfColor: selectedColor,
      pdfLabels,
    });
    alert('Configuración de branding guardada exitosamente');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Branding" showBack showMenu role="nutritionist" />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Logo Upload */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Logo del Consultorio
          </h3>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-400 dark:text-slate-500" />
              )}
            </div>
            
            <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Subir Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
              Este logo aparecerá en los PDFs de las dietas
            </p>
          </div>
        </div>

        {/* Watermark Upload */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
            <Droplet className="w-5 h-5" />
            Marca de Agua
          </h3>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              {watermarkPreview ? (
                <img src={watermarkPreview} alt="Marca de agua" className="w-full h-full object-contain opacity-20" />
              ) : (
                <Droplet className="w-12 h-12 text-slate-400 dark:text-slate-500" />
              )}
            </div>
            
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Subir Marca de Agua
              <input
                type="file"
                accept="image/*"
                onChange={handleWatermarkUpload}
                className="hidden"
              />
            </label>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
              La marca de agua aparecerá de fondo en los PDFs
            </p>
          </div>
        </div>

        {/* PDF Color Palette */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color del PDF
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Selecciona un color pastel para el tema del PDF
          </p>

          <div className="grid grid-cols-4 gap-3">
            {PASTEL_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`relative h-16 rounded-lg transition-all ${color.preview} ${
                  selectedColor === color.value
                    ? 'ring-4 ring-emerald-500 scale-105'
                    : 'hover:scale-105'
                }`}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center">
            Color seleccionado: <span className="font-semibold">{PASTEL_COLORS.find(c => c.value === selectedColor)?.name}</span>
          </p>
        </div>

        {/* PDF Labels Customization */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Etiquetas Personalizadas del PDF
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Personaliza los nombres de las secciones que aparecen en el PDF
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Desayuno
              </label>
              <input
                type="text"
                value={pdfLabels.breakfast}
                onChange={(e) => handleLabelChange('breakfast', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Colación Mañana
              </label>
              <input
                type="text"
                value={pdfLabels.morningSnack}
                onChange={(e) => handleLabelChange('morningSnack', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Comida
              </label>
              <input
                type="text"
                value={pdfLabels.lunch}
                onChange={(e) => handleLabelChange('lunch', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Colación Tarde
              </label>
              <input
                type="text"
                value={pdfLabels.afternoonSnack}
                onChange={(e) => handleLabelChange('afternoonSnack', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Cena
              </label>
              <input
                type="text"
                value={pdfLabels.dinner}
                onChange={(e) => handleLabelChange('dinner', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Colación Noche
              </label>
              <input
                type="text"
                value={pdfLabels.eveningSnack}
                onChange={(e) => handleLabelChange('eveningSnack', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Plan de Dieta
              </label>
              <input
                type="text"
                value={pdfLabels.dietPlan}
                onChange={(e) => handleLabelChange('dietPlan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Resumen Nutricional
              </label>
              <input
                type="text"
                value={pdfLabels.nutritionalSummary}
                onChange={(e) => handleLabelChange('nutritionalSummary', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Calorías
              </label>
              <input
                type="text"
                value={pdfLabels.calories}
                onChange={(e) => handleLabelChange('calories', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Proteínas
              </label>
              <input
                type="text"
                value={pdfLabels.protein}
                onChange={(e) => handleLabelChange('protein', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Carbohidratos
              </label>
              <input
                type="text"
                value={pdfLabels.carbs}
                onChange={(e) => handleLabelChange('carbs', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Grasas
              </label>
              <input
                type="text"
                value={pdfLabels.fats}
                onChange={(e) => handleLabelChange('fats', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Paciente
              </label>
              <input
                type="text"
                value={pdfLabels.patient}
                onChange={(e) => handleLabelChange('patient', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Nutricionista
              </label>
              <input
                type="text"
                value={pdfLabels.nutritionist}
                onChange={(e) => handleLabelChange('nutritionist', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Fecha de Inicio
              </label>
              <input
                type="text"
                value={pdfLabels.startDate}
                onChange={(e) => handleLabelChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Fecha de Fin
              </label>
              <input
                type="text"
                value={pdfLabels.endDate}
                onChange={(e) => handleLabelChange('endDate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Notas
              </label>
              <input
                type="text"
                value={pdfLabels.notes}
                onChange={(e) => handleLabelChange('notes', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm">
                Plan de Comidas
              </label>
              <input
                type="text"
                value={pdfLabels.mealPlan}
                onChange={(e) => handleLabelChange('mealPlan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Guardar Configuración de Branding
        </button>
      </form>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}
