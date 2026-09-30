import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Header from '../shared/Header';
import { Save, Trash2, Lock } from 'lucide-react';
import { useAuth } from '../../App';
import { generateConsistentDemoPatients } from '../../utils/generateDemoPatients';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const userEmail = user?.email || 'nutritionist@nutriapp.com';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    bloodType: 'A+',
    height: '',
    weight: '',
    allergies: '',
    illnesses: '',
    goals: '',
  });

  useEffect(() => {
    if (isStudentsAccount) {
      // Load demo patient data for Students (view only)
      const demoPatients = generateConsistentDemoPatients(userEmail, 10);
      const foundPatient = demoPatients.find(p => p.id === id);

      if (foundPatient) {
        setFormData({
          fullName: foundPatient.fullName,
          email: foundPatient.email,
          phone: foundPatient.phone,
          age: foundPatient.age.toString(),
          bloodType: foundPatient.bloodType,
          height: foundPatient.height.toString(),
          weight: foundPatient.weight.toString(),
          allergies: foundPatient.allergies || '',
          illnesses: foundPatient.illnesses || '',
          goals: foundPatient.goals,
        });
      }
    } else {
      // Regular nutritionist - load mock data
      setFormData({
        fullName: 'Maria Rodriguez',
        email: 'maria@example.com',
        phone: '+1 (555) 123-4567',
        age: '32',
        bloodType: 'A+',
        height: '165',
        weight: '68',
        allergies: 'Lactose intolerant',
        illnesses: 'Pre-diabetes',
        goals: 'Weight loss and blood sugar management',
      });
    }
  }, [id, isStudentsAccount, userEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/nutritionist/patients/${id}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      navigate('/nutritionist/patients');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
      <Header title="Editar Paciente" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Students Warning Banner */}
        {isStudentsAccount && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                Modo Solo Lectura - Cuenta Students
              </h4>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Los pacientes ficticios no pueden ser editados. Puedes ver su información pero no realizar cambios.
            </p>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white">Información Personal</h3>

          <div>
            <label htmlFor="fullName" className="block text-slate-700 dark:text-slate-300 mb-2">
              Nombre Completo *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              disabled={isStudentsAccount}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-slate-700 mb-2">
              Age *
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="bloodType" className="block text-slate-700 mb-2">
              Blood Type *
            </label>
            <select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        {/* Physical Metrics */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900">Physical Metrics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-slate-700 mb-2">
                Height (cm) *
              </label>
              <input
                id="height"
                name="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-slate-700 mb-2">
                Weight (kg) *
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900">Medical Information</h3>

          <div>
            <label htmlFor="allergies" className="block text-slate-700 mb-2">
              Allergies
            </label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="illnesses" className="block text-slate-700 mb-2">
              Current Illnesses / Conditions
            </label>
            <textarea
              id="illnesses"
              name="illnesses"
              value={formData.illnesses}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-slate-700 mb-2">
              Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
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
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-200"
          >
            <Trash2 className="w-5 h-5" />
            Delete Patient
          </button>
        </div>
      </form>
    </div>
  );
}