import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { Search, Plus, AlertCircle, Users } from 'lucide-react';
import { generateConsistentDemoPatients } from '../../utils/generateDemoPatients';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../App';

interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  lastVisit: string;
  status: 'active' | 'inactive';
  progress: string;
  consentStatus: 'pending' | 'active';
}

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const isStudentsAccount = user?.planType === 'students';
  const userEmail = user?.email || 'nutritionist@nutriapp.com';
  const hasGeneratedData = user?.demoDataGenerated || false;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(isStudentsAccount && !hasGeneratedData);

  const handleGenerateDemoPatients = () => {
    if (!isStudentsAccount) return;

    const demoPatients = generateConsistentDemoPatients(userEmail, 10);
    setPatients(
      demoPatients.map((p) => ({
        id: p.id,
        name: p.fullName,
        age: p.age,
        bloodType: p.bloodType,
        lastVisit: p.lastVisit,
        status: p.status,
        progress: p.status === 'active' ? 'Activo' : 'Inactivo',
        consentStatus: 'active' as const,
      }))
    );

    if (setUser && user) {
      setUser({ ...user, demoDataGenerated: true });
    }
    setShowGenerateButton(false);
  };

  useEffect(() => {
    if (isStudentsAccount && hasGeneratedData) {
      const demoPatients = generateConsistentDemoPatients(userEmail, 10);
      setPatients(
        demoPatients.map((p) => ({
          id: p.id,
          name: p.fullName,
          age: p.age,
          bloodType: p.bloodType,
          lastVisit: p.lastVisit,
          status: p.status,
          progress: p.status === 'active' ? 'Activo' : 'Inactivo',
          consentStatus: 'active' as const,
        }))
      );
    } else if (!isStudentsAccount) {
      setPatients([
        {
          id: '1',
          name: 'María Rodríguez',
          age: 32,
          bloodType: 'A+',
          lastVisit: '2026-09-01',
          status: 'active',
          progress: 'En progreso',
          consentStatus: 'pending',
        },
        {
          id: '2',
          name: 'Carlos Hernández',
          age: 45,
          bloodType: 'O+',
          lastVisit: '2026-08-28',
          status: 'active',
          progress: 'Buen progreso',
          consentStatus: 'pending',
        },
        {
          id: '3',
          name: 'Ana López',
          age: 28,
          bloodType: 'B+',
          lastVisit: '2026-08-30',
          status: 'active',
          progress: 'Requiere atención',
          consentStatus: 'active',
        },
        {
          id: '4',
          name: 'Roberto Sánchez',
          age: 38,
          bloodType: 'AB+',
          lastVisit: '2026-08-15',
          status: 'inactive',
          progress: 'Sin actividad reciente',
          consentStatus: 'active',
        },
        {
          id: '5',
          name: 'Patricia Gómez',
          age: 25,
          bloodType: 'A-',
          lastVisit: '2026-09-02',
          status: 'active',
          progress: 'Excelente',
          consentStatus: 'active',
        },
      ]);
    }
  }, [isStudentsAccount, userEmail, hasGeneratedData]);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'pending-consent') {
      return matchesSearch && patient.consentStatus === 'pending';
    }
    const matchesFilter = filter === 'all' || patient.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Pacientes" showBack showNotifications />

      <div className="p-4 space-y-4">
        {/* Students Account - Generate Demo Patients */}
        {isStudentsAccount && showGenerateButton && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              Genera tus pacientes de práctica
            </h3>
            <p className="text-purple-800 dark:text-purple-200 mb-4">
              Genera automáticamente <strong>10 pacientes ficticios</strong> con datos realistas para
              practicar. Esta acción solo se puede realizar una vez.
            </p>
            <button
              onClick={handleGenerateDemoPatients}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Generar Pacientes Ficticios
            </button>
          </div>
        )}

        {/* Students Account Info Banner */}
        {isStudentsAccount && hasGeneratedData && (
          <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-900 dark:text-purple-100">
              <p className="font-semibold mb-1">Cuenta de Práctica Students</p>
              <p className="text-sm">
                Estás trabajando con <strong>10 pacientes ficticios</strong> generados automáticamente para
                tus prácticas. No puedes agregar más pacientes. Estos datos se eliminarán a los 6 meses.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pacientes..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            >
              <option value="all">Todos los pacientes</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="pending-consent">Pendientes de consentimiento</option>
            </select>
            {!isStudentsAccount && (
              <button
                onClick={() => navigate('/nutritionist/patients/add')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar
              </button>
            )}
          </div>
        </div>

        {/* Patient Count */}
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400 text-sm">{filteredPatients.length} paciente(s)</p>
        </div>

        {/* Patient List */}
        <div className="space-y-3">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/nutritionist/patients/${p.id}`)}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {p.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{p.age} años</p>
                    {p.consentStatus === 'pending' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 mt-1">
                        Pendiente de consentimiento
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    p.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {p.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No se encontraron pacientes.</p>
            </div>
          )}
        </div>
      </div>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}
