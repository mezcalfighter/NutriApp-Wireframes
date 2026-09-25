import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Header from '../shared/Header';
import { FileText, Calendar, Save } from 'lucide-react';
import { useAuth } from '../../App';
import { generateConsistentDemoPatients } from '../../utils/generateDemoPatients';

export default function AssignDiet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const userEmail = user?.email || 'nutritionist@nutriapp.com';
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (isStudentsAccount) {
      // Load demo patient data for Students
      const demoPatients = generateConsistentDemoPatients(userEmail, 10);
      const foundPatient = demoPatients.find(p => p.id === id);
      if (foundPatient) {
        setPatient({
          name: foundPatient.fullName,
          age: foundPatient.age,
          bloodType: foundPatient.bloodType,
        });
      }
    } else {
      // Regular nutritionist - mock data
      setPatient({
        name: 'Maria Rodriguez',
        age: 32,
        bloodType: 'A+',
      });
    }
  }, [id, isStudentsAccount, userEmail]);

  const templates = [
    { id: '1', name: 'Weight Loss - Low Carb', calories: 1500 },
    { id: '2', name: 'Diabetes Management', calories: 1800 },
    { id: '3', name: 'Muscle Gain', calories: 2500 },
    { id: '4', name: 'Mediterranean Diet', calories: 2000 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/nutritionist/patients/${id}`);
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
        <Header title="Asignar Plan" showBack />
        <div className="p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
      <Header title="Asignar Plan Nutricional" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-4">Paciente</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <span className="text-emerald-700 dark:text-emerald-400">{patient.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white">{patient.name}</p>
              <p className="text-slate-500 dark:text-slate-400">{patient.age} años • {patient.bloodType}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900">Select Template</h3>
          
          <div className="space-y-2">
            {templates.map((template) => (
              <label
                key={template.id}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="template"
                    value={template.id}
                    checked={selectedTemplate === template.id}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-4 h-4 text-emerald-500"
                  />
                  <div>
                    <p className="text-slate-900">{template.name}</p>
                    <p className="text-slate-500">{template.calories} cal/day</p>
                  </div>
                </div>
                <FileText className="w-5 h-5 text-slate-400" />
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/nutritionist/templates/create')}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 px-4 rounded-lg transition-colors"
          >
            Create Custom Diet
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900">Schedule</h3>

          <div>
            <label className="block text-slate-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Notes for Patient</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Add any special instructions or notes..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedTemplate || !startDate}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Assign Diet
          </button>
        </div>
      </form>
    </div>
  );
}