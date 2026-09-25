import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { User, Mail, Phone, MapPin, Save, Shield, GraduationCap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../App';

export default function NutritionistProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nutritionistSettings, updateNutritionistSettings } = useApp();
  const isStudentsAccount = user?.planType === 'students';
  
  const [formData, setFormData] = useState({
    academicDegree: nutritionistSettings.academicDegree,
    gender: nutritionistSettings.gender,
    name: nutritionistSettings.nutritionistName,
    email: nutritionistSettings.email,
    phone: nutritionistSettings.phone,
    practiceName: nutritionistSettings.practiceName,
    address: nutritionistSettings.address,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNutritionistSettings({
      academicDegree: formData.academicDegree as any,
      gender: formData.gender as 'male' | 'female',
      nutritionistName: formData.name,
      email: formData.email,
      phone: formData.phone,
      practiceName: formData.practiceName,
      address: formData.address,
    });
    alert('Perfil actualizado exitosamente');
  };

  // Get abbreviated degree for preview
  const getAbbreviatedDegree = () => {
    const { academicDegree } = formData;
    if (academicDegree === 'Licenciado' || academicDegree === 'Licenciada') return 'Lic.';
    if (academicDegree === 'Maestro' || academicDegree === 'Maestra') return academicDegree === 'Maestro' ? 'Mtro.' : 'Mtra.';
    return academicDegree === 'Doctor' ? 'Dr.' : 'Dra.';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Perfil" showMenu role="nutritionist" isStudentsAccount={isStudentsAccount} />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm text-center">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h2 className="text-slate-900 dark:text-white mb-1">
            {getAbbreviatedDegree()} {formData.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">{formData.practiceName}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white font-semibold">Información Personal</h3>

          {/* Academic Degree and Gender */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">
              Título Académico
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <select
                name="academicDegree"
                value={formData.academicDegree}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <optgroup label="Licenciatura">
                  <option value="Licenciado">Licenciado (Masculino)</option>
                  <option value="Licenciada">Licenciada (Femenino)</option>
                </optgroup>
                <optgroup label="Maestría">
                  <option value="Maestro">Maestro (Masculino)</option>
                  <option value="Maestra">Maestra (Femenino)</option>
                </optgroup>
                <optgroup label="Doctorado">
                  <option value="Doctor">Doctor (Masculino)</option>
                  <option value="Doctora">Doctora (Femenino)</option>
                </optgroup>
              </select>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Aparecerá como: {getAbbreviatedDegree()} {formData.name}
            </p>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: María González Hernández"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contacto@nutricion.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 123 456 7890"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Nombre del Consultorio</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="practiceName"
                value={formData.practiceName}
                onChange={handleChange}
                placeholder="Ej: Nutrición Integral"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Dirección del Consultorio</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle, número, colonia, ciudad"
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Seguridad</h3>
          <button
            type="button"
            onClick={() => navigate('/mfa-setup')}
            className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors flex items-center gap-3"
          >
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-left">
              <p className="text-slate-900 dark:text-white">Autenticación de Dos Factores</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Habilitada</p>
            </div>
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Guardar Cambios
        </button>
      </form>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}