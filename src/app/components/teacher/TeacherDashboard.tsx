import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  GraduationCap,
  BookOpen,
  FileDown,
  CheckCircle,
  XCircle,
  Search,
  X,
  AlertTriangle,
  ChevronRight,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

type Section = 'estudiantes' | 'modulo' | 'reporte';

interface Student {
  id: number;
  nombre: string;
  correo: string;
  fechaActivacion: string;
  pacientesFicticios: number;
  consentimientos: number;
  solicitudesArco: number;
  ultimoAcceso: string;
  videoCompletado: boolean;
  rubricaEnviada: boolean;
  avance: number;
  pacientesLista: string[];
}

const mockStudents: Student[] = [
  {
    id: 1,
    nombre: 'Ana Martínez López',
    correo: 'ana.martinez@estudiantes.unam.mx',
    fechaActivacion: '02 ago 2026',
    pacientesFicticios: 5,
    consentimientos: 5,
    solicitudesArco: 0,
    ultimoAcceso: 'Hoy, 10:32',
    videoCompletado: true,
    rubricaEnviada: true,
    avance: 100,
    pacientesLista: ['Paciente ficticio A', 'Paciente ficticio B', 'Paciente ficticio C', 'Paciente ficticio D', 'Paciente ficticio E'],
  },
  {
    id: 2,
    nombre: 'Carlos Ramírez Vega',
    correo: 'carlos.ramirez@estudiantes.unam.mx',
    fechaActivacion: '03 ago 2026',
    pacientesFicticios: 4,
    consentimientos: 4,
    solicitudesArco: 1,
    ultimoAcceso: 'Ayer, 18:15',
    videoCompletado: true,
    rubricaEnviada: true,
    avance: 100,
    pacientesLista: ['Paciente ficticio A', 'Paciente ficticio B', 'Paciente ficticio C', 'Paciente ficticio D'],
  },
  {
    id: 3,
    nombre: 'Sofía Hernández Castillo',
    correo: 'sofia.hernandez@estudiantes.unam.mx',
    fechaActivacion: '05 ago 2026',
    pacientesFicticios: 3,
    consentimientos: 3,
    solicitudesArco: 0,
    ultimoAcceso: 'Hace 2 días',
    videoCompletado: true,
    rubricaEnviada: false,
    avance: 75,
    pacientesLista: ['Paciente ficticio A', 'Paciente ficticio B', 'Paciente ficticio C'],
  },
  {
    id: 4,
    nombre: 'Miguel Ángel Torres',
    correo: 'miguel.torres@estudiantes.unam.mx',
    fechaActivacion: '06 ago 2026',
    pacientesFicticios: 2,
    consentimientos: 2,
    solicitudesArco: 0,
    ultimoAcceso: 'Hace 3 días',
    videoCompletado: true,
    rubricaEnviada: false,
    avance: 75,
    pacientesLista: ['Paciente ficticio A', 'Paciente ficticio B'],
  },
  {
    id: 5,
    nombre: 'Valeria Mendoza Ruiz',
    correo: 'valeria.mendoza@estudiantes.unam.mx',
    fechaActivacion: '08 ago 2026',
    pacientesFicticios: 2,
    consentimientos: 1,
    solicitudesArco: 0,
    ultimoAcceso: 'Hace 5 días',
    videoCompletado: false,
    rubricaEnviada: false,
    avance: 50,
    pacientesLista: ['Paciente ficticio A', 'Paciente ficticio B'],
  },
  {
    id: 6,
    nombre: 'Diego Fernández Mora',
    correo: 'diego.fernandez@estudiantes.unam.mx',
    fechaActivacion: '10 ago 2026',
    pacientesFicticios: 1,
    consentimientos: 1,
    solicitudesArco: 0,
    ultimoAcceso: 'Hace 1 semana',
    videoCompletado: false,
    rubricaEnviada: false,
    avance: 50,
    pacientesLista: ['Paciente ficticio A'],
  },
  {
    id: 7,
    nombre: 'Lucía Pérez González',
    correo: 'lucia.perez@estudiantes.unam.mx',
    fechaActivacion: '12 ago 2026',
    pacientesFicticios: 0,
    consentimientos: 0,
    solicitudesArco: 0,
    ultimoAcceso: 'Hace 2 semanas',
    videoCompletado: false,
    rubricaEnviada: false,
    avance: 0,
    pacientesLista: [],
  },
  {
    id: 8,
    nombre: 'Roberto Guzmán Salinas',
    correo: 'roberto.guzman@estudiantes.unam.mx',
    fechaActivacion: '15 ago 2026',
    pacientesFicticios: 0,
    consentimientos: 0,
    solicitudesArco: 0,
    ultimoAcceso: 'Hace 2 semanas',
    videoCompletado: false,
    rubricaEnviada: false,
    avance: 0,
    pacientesLista: [],
  },
];

function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100
      ? 'bg-emerald-500'
      : value >= 50
      ? 'bg-amber-400'
      : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{value}%</span>
    </div>
  );
}

function CheckIcon({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle className="w-4 h-4 text-emerald-500" />
  ) : (
    <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
  );
}

interface StudentOverlayProps {
  student: Student;
  onClose: () => void;
}

function StudentOverlay({ student, onClose }: StudentOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Amber banner */}
      <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          Vista docente · solo lectura · datos ficticios
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-5 flex-1">
        {/* Encabezado */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {student.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{student.nombre}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{student.correo}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Activación: {student.fechaActivacion}</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pacientes ficticios', value: student.pacientesFicticios },
            { label: 'Consentimientos', value: student.consentimientos },
            { label: 'Solicitudes ARCO', value: student.solicitudesArco },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 text-center">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Pacientes ficticios */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Pacientes ficticios registrados</p>
          {student.pacientesLista.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Sin pacientes ficticios aún.</p>
          ) : (
            <ul className="space-y-2">
              {student.pacientesLista.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <User className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Módulo LFPDPPP */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Módulo LFPDPPP</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Video completado</span>
            <CheckIcon value={student.videoCompletado} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Rúbrica enviada</span>
            <CheckIcon value={student.rubricaEnviada} />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1.5">Avance general</p>
            <ProgressBar value={student.avance} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4">
        <button
          onClick={onClose}
          className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          Cerrar vista
        </button>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('estudiantes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.correo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems: { id: Section; label: string; icon: typeof GraduationCap }[] = [
    { id: 'estudiantes', label: 'Estudiantes', icon: GraduationCap },
    { id: 'modulo', label: 'Módulo', icon: BookOpen },
    { id: 'reporte', label: 'Reporte', icon: FileDown },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Panel Docente" showMenu />

      {selectedStudent && (
        <StudentOverlay
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Bienvenida */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">LS</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Bienvenida, Mtra. Laura Sánchez</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">UNAM · Nutrición Clínica · Semestre 2026-1</p>
            </div>
          </div>
        </div>

        {/* Sección: Estudiantes */}
        {activeSection === 'estudiantes' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Estudiantes del programa
                <span className="ml-2 text-sm font-medium text-slate-400 dark:text-slate-500">({mockStudents.length})</span>
              </h2>
            </div>

            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Tabla de estudiantes */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nombre</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Correo</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Activación</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pacientes</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Consent.</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">ARCO</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Último acceso</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, i) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`border-b last:border-b-0 border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          i % 2 === 0 ? '' : 'bg-slate-50/40 dark:bg-slate-800/20'
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{student.nombre}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{student.correo}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{student.fechaActivacion}</td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{student.pacientesFicticios}</td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{student.consentimientos}</td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{student.solicitudesArco}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{student.ultimoAcceso}</td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                          No se encontraron estudiantes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Sección: Módulo LFPDPPP */}
        {activeSection === 'modulo' && (
          <section className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Módulo de inducción a la LFPDPPP
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nombre</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Video</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rúbrica</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-40">Avance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.map((student, i) => (
                      <tr
                        key={student.id}
                        className={`border-b last:border-b-0 border-slate-100 dark:border-slate-800 ${
                          i % 2 === 0 ? '' : 'bg-slate-50/40 dark:bg-slate-800/20'
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{student.nombre}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <CheckIcon value={student.videoCompletado} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <CheckIcon value={student.rubricaEnviada} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <ProgressBar value={student.avance} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Sección: Reporte */}
        {activeSection === 'reporte' && (
          <section className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Reporte semestral</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total estudiantes', value: mockStudents.length },
                  { label: 'Completaron módulo', value: mockStudents.filter((s) => s.avance === 100).length },
                  { label: 'En progreso', value: mockStudents.filter((s) => s.avance > 0 && s.avance < 100).length },
                  { label: 'Sin iniciar', value: mockStudents.filter((s) => s.avance === 0).length },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                El reporte incluye datos de participación, avance en el módulo LFPDPPP y estadísticas de uso de pacientes ficticios del Semestre 2026-1.
              </p>
              <button
                onClick={() => toast.success('Generando reporte... Se descargará en breve.')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <FileDown className="w-4 h-4" />
                Descargar reporte semestral (PDF)
              </button>
            </div>
          </section>
        )}

      </main>

      {/* Bottom nav del docente */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-40 safe-area-bottom">
        <div className="flex max-w-4xl mx-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                activeSection === id
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
