import { X, Download, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietPlan: any;
  meals: any[];
  patientName?: string;
}

export default function PDFPreviewModal({ 
  isOpen, 
  onClose, 
  dietPlan, 
  meals,
  patientName = 'Paciente'
}: PDFPreviewModalProps) {
  const { nutritionistSettings } = useApp();
  
  if (!isOpen) return null;

  const totalNutrition = meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((food: any) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fats += food.fats;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const handleDownload = () => {
    // In a real app, this would generate a PDF using a library like jsPDF or react-pdf
    alert('La funcionalidad de descarga de PDF se implementaría aquí usando una librería como jsPDF o react-pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  // Get abbreviated degree
  const getAbbreviatedDegree = () => {
    const { academicDegree } = nutritionistSettings;
    if (academicDegree === 'Licenciado' || academicDegree === 'Licenciada') return 'Lic.';
    if (academicDegree === 'Maestro' || academicDegree === 'Maestra') return academicDegree === 'Maestro' ? 'Mtro.' : 'Mtra.';
    return academicDegree === 'Doctor' ? 'Dr.' : 'Dra.';
  };

  const today = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Vista Previa del Plan de Dieta
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* PDF Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950">
          <div 
            id="pdf-content" 
            className="relative bg-white max-w-[210mm] mx-auto p-8 rounded-lg shadow-lg print:shadow-none overflow-hidden"
            style={{ backgroundColor: nutritionistSettings.pdfColor }}
          >
            {/* Watermark */}
            {nutritionistSettings.watermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <img 
                  src={nutritionistSettings.watermark} 
                  alt="Marca de agua" 
                  className="w-96 h-96 object-contain"
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10">
              {/* Top Left - Doctor Name */}
              <div className="absolute top-0 left-0 text-sm text-slate-700 font-semibold">
                {getAbbreviatedDegree()} {nutritionistSettings.nutritionistName}
              </div>

              {/* Header with Logo */}
              <div className="flex items-center justify-between mb-8 pt-8 pb-4 border-b-2 border-emerald-600">
                <div className="flex items-center gap-4">
                  {nutritionistSettings.logo ? (
                    <img 
                      src={nutritionistSettings.logo} 
                      alt="Logo" 
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                      <FileText className="w-10 h-10" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl text-slate-900 font-bold">{nutritionistSettings.pdfLabels.dietPlan}</h1>
                    <p className="text-slate-700 font-medium">{nutritionistSettings.practiceName}</p>
                  </div>
                </div>
              </div>

              {/* Diet Plan Info */}
              <div className="mb-6 bg-white/70 rounded-lg p-4">
                <h2 className="text-xl text-slate-900 font-semibold mb-3">{dietPlan.name}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 font-medium">{nutritionistSettings.pdfLabels.patient}:</p>
                    <p className="text-slate-900">{patientName}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">{nutritionistSettings.pdfLabels.nutritionist}:</p>
                    <p className="text-slate-900">{getAbbreviatedDegree()} {nutritionistSettings.nutritionistName}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">{nutritionistSettings.pdfLabels.startDate}:</p>
                    <p className="text-slate-900">
                      {new Date(dietPlan.startDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">{nutritionistSettings.pdfLabels.endDate}:</p>
                    <p className="text-slate-900">
                      {new Date(dietPlan.endDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutritional Summary */}
              <div className="bg-emerald-100 rounded-lg p-4 mb-6">
                <h3 className="text-lg text-slate-900 font-semibold mb-3">{nutritionistSettings.pdfLabels.nutritionalSummary}</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{nutritionistSettings.pdfLabels.calories}</p>
                    <p className="text-2xl text-emerald-700 font-bold">{totalNutrition.calories}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{nutritionistSettings.pdfLabels.protein}</p>
                    <p className="text-2xl text-emerald-700 font-bold">{totalNutrition.protein}g</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{nutritionistSettings.pdfLabels.carbs}</p>
                    <p className="text-2xl text-emerald-700 font-bold">{totalNutrition.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{nutritionistSettings.pdfLabels.fats}</p>
                    <p className="text-2xl text-emerald-700 font-bold">{totalNutrition.fats}g</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {dietPlan.notes && (
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
                  <h4 className="text-amber-900 font-semibold mb-2">{nutritionistSettings.pdfLabels.notes}</h4>
                  <p className="text-amber-800 text-sm">{dietPlan.notes}</p>
                </div>
              )}

              {/* Meals */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg text-slate-900 font-semibold mb-3">{nutritionistSettings.pdfLabels.mealPlan}</h3>
                {meals.map((meal, idx) => (
                  <div key={idx} className="bg-white/70 border border-slate-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                      <h4 className="text-slate-900 font-semibold">{meal.name}</h4>
                      <span className="text-slate-600 text-sm">{meal.time}</span>
                    </div>
                    <div className="space-y-2">
                      {meal.foods.map((food: any, foodIdx: number) => (
                        <div key={foodIdx} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="text-slate-900 font-medium">{food.name}</p>
                            <p className="text-slate-600 text-xs">{food.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-700 font-semibold">{food.calories} cal</p>
                            <p className="text-slate-600 text-xs">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Date */}
              <div className="mt-8 pt-4 border-t-2 border-slate-300">
                <div className="flex justify-between items-start text-xs text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-700">{today}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{nutritionistSettings.practiceName}</p>
                    <p>{nutritionistSettings.phone}</p>
                    <p>{nutritionistSettings.email}</p>
                    <p className="text-slate-500 mt-1">{nutritionistSettings.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrint}
            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Imprimir
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}