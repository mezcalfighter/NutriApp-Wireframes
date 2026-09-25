import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

interface Nutritionist {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  city: string;
  modality: string;
  rating: number;
  reviews: number;
  verified: boolean;
  sponsored: boolean;
  nextAvailability: string;
  price: string;
  institution: string;
  cedula: string;
}

const ALL_NUTRITIONISTS: Nutritionist[] = [
  {
    id: '1',
    name: 'Dra. Carmen Ruiz',
    initials: 'CR',
    specialty: 'Nutrición clínica',
    city: 'CDMX',
    modality: 'Presencial y en línea',
    rating: 4.9,
    reviews: 124,
    verified: true,
    sponsored: true,
    nextAvailability: 'Hoy 16:00',
    price: '$600 MXN',
    institution: 'UNAM',
    cedula: '12345678',
  },
  {
    id: '2',
    name: 'Lic. Roberto Soto',
    initials: 'RS',
    specialty: 'Nutrición deportiva',
    city: 'CDMX',
    modality: 'En línea',
    rating: 4.8,
    reviews: 98,
    verified: true,
    sponsored: true,
    nextAvailability: 'Mañana 10:00',
    price: '$500 MXN',
    institution: 'IBERO',
    cedula: '87654321',
  },
  {
    id: '3',
    name: 'Lic. Andrea Martínez',
    initials: 'AM',
    specialty: 'Nutrición pediátrica',
    city: 'CDMX',
    modality: 'Presencial',
    rating: 4.7,
    reviews: 67,
    verified: true,
    sponsored: false,
    nextAvailability: 'Lun 09:00',
    price: '$550 MXN',
    institution: 'ITESO',
    cedula: '11223344',
  },
  {
    id: '4',
    name: 'Lic. Marco Pérez',
    initials: 'MP',
    specialty: 'Nutriología general',
    city: 'CDMX',
    modality: 'Presencial',
    rating: 4.5,
    reviews: 43,
    verified: false,
    sponsored: false,
    nextAvailability: 'Mar 11:00',
    price: '$400 MXN',
    institution: 'UdeG',
    cedula: '',
  },
  {
    id: '5',
    name: 'Dra. Sofía Torres',
    initials: 'ST',
    specialty: 'Nutrición clínica',
    city: 'CDMX',
    modality: 'En línea',
    rating: 4.6,
    reviews: 55,
    verified: true,
    sponsored: false,
    nextAvailability: 'Mié 15:00',
    price: '$580 MXN',
    institution: 'TEC',
    cedula: '99887766',
  },
];

const SPECIALTIES = [
  'Todas las especialidades',
  'Nutrición clínica',
  'Nutrición deportiva',
  'Nutrición pediátrica',
  'Nutriología general',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sortNutritionists(list: Nutritionist[]): Nutritionist[] {
  const sponsored = list.filter((n) => n.sponsored);
  const organic = list.filter((n) => !n.sponsored);
  // max 2 sponsored in first 5
  const sponsoredSlice = sponsored.slice(0, 2);
  const remainingSponsored = sponsored.slice(2);
  return [...sponsoredSlice, ...organic, ...remainingSponsored];
}

function renderStars(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// ---------------------------------------------------------------------------
// Nutritionist card
// ---------------------------------------------------------------------------

function NutritionistCard({ nutritionist }: { nutritionist: Nutritionist }) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {nutritionist.initials}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center flex-wrap gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {nutritionist.name}
              </h3>
              {nutritionist.sponsored && (
                <span className="border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                  Patrocinado
                </span>
              )}
            </div>

            {/* Verified badge */}
            {nutritionist.verified && (
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  Perfil verificado
                </span>
              </div>
            )}

            {/* Specialty, city, modality */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {nutritionist.specialty} · {nutritionist.city}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {nutritionist.modality}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm text-amber-400 tracking-tight leading-none">
                {renderStars(nutritionist.rating)}
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {nutritionist.rating}
              </span>
              <span className="text-xs text-slate-400">({nutritionist.reviews} reseñas)</span>
            </div>

            {/* Availability & price */}
            <div className="flex items-center justify-between flex-wrap gap-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Próxima disponibilidad:
                </span>{' '}
                {nutritionist.nextAvailability}
              </p>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {nutritionist.price}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3">
          <button
            onClick={() => navigate(`/confirmar-cita?nutriologo=${nutritionist.id}`)}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Reservar cita
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FindNutritionist() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Todas las especialidades');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    const base = ALL_NUTRITIONISTS.filter((n) => {
      const matchesSearch =
        !query ||
        n.name.toLowerCase().includes(query) ||
        n.specialty.toLowerCase().includes(query);
      const matchesSpecialty =
        specialty === 'Todas las especialidades' || n.specialty === specialty;
      return matchesSearch && matchesSpecialty;
    });
    return sortNutritionists(base);
  }, [search, specialty]);

  // Alert import used for zero-results state
  const showEmpty = filtered.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Buscar Nutriólogo
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o especialidad..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!showEmpty && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </p>
        )}

        {/* Empty state */}
        {showEmpty && (
          <Alert>
            <AlertDescription>
              No encontramos nutriólogos con esos criterios. Intenta con otra búsqueda o
              especialidad.
            </AlertDescription>
          </Alert>
        )}

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map((n) => (
            <NutritionistCard key={n.id} nutritionist={n} />
          ))}
        </div>

        {/* Footer transparency link */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm text-slate-500 underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            ¿Cómo ordenamos los resultados?
          </button>
        </div>
      </div>

      {/* Transparency dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>¿Cómo ordenamos los resultados?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            El orden se basa en disponibilidad, cercanía declarada y especialidad. Los resultados
            marcados como <span className="font-medium text-slate-700 dark:text-slate-300">Patrocinado</span> son un servicio de
            exposición que el nutriólogo contrata; nunca más de dos entre los primeros cinco. No
            usamos tus datos de salud para ordenar resultados. Todo nutriólogo con insignia{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">Perfil verificado</span>{' '}
            acreditó su cédula profesional.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
