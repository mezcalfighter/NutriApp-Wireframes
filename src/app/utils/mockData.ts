// Utility to generate realistic mock data for NutriApp admin

export interface Nutritionist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  patients: number;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
  reportsCount?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nutritionist: string;
  nutritionistId: string;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
  appointments: number;
  reportsCount?: number;
}

const firstNames = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'José', 'Carmen', 'Luis', 'Isabel', 'Miguel', 'Rosa', 'Pedro', 'Elena', 'Francisco', 'Teresa', 'Antonio', 'Patricia', 'Javier', 'Lucía', 'Rafael', 'Mónica', 'Diego', 'Sofía', 'Fernando', 'Gabriela', 'Roberto', 'Andrea', 'Alejandro', 'Valeria', 'Ricardo'];

const lastNames = ['García', 'Rodríguez', 'Martínez', 'Hernández', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Jiménez', 'Ruiz', 'Álvarez', 'Castillo', 'Romero', 'Gutiérrez', 'Mendoza', 'Ortiz', 'Silva', 'Vargas', 'Reyes', 'Castro', 'Ramos', 'Herrera'];

const specialties = [
  'Nutrición Deportiva',
  'Nutrición Clínica',
  'Nutrición Pediátrica',
  'Nutrición Oncológica',
  'Nutrición Geriátrica',
  'Nutrición Vegetariana/Vegana',
  'Nutrición para Diabéticos',
  'Nutrición Bariátrica',
  'Nutrición General',
  'Nutrición Materno-Infantil',
  'Nutrición y Obesidad',
  'Nutrición Comunitaria'
];

const titles = ['Dr.', 'Dra.', 'Lic.', 'Mtro.', 'Mtra.'];

const getRandomDate = (startYear: number, endYear: number): string => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const getRandomLastActive = (): string => {
  const options = [
    'Hace 1 hora',
    'Hace 2 horas',
    'Hace 5 horas',
    'Hace 1 día',
    'Hace 2 días',
    'Hace 3 días',
    'Hace 1 semana',
    'Hace 2 semanas',
    'Hace 1 mes'
  ];
  return options[Math.floor(Math.random() * options.length)];
};

export const generateNutritionists = (count: number): Nutritionist[] => {
  const nutritionists: Nutritionist[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const name = `${title} ${firstName} ${lastName}`;
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const isSuspended = Math.random() < 0.05; // 5% suspended

    nutritionists.push({
      id: `nutritionist-${i}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@nutriapp.com`,
      phone: `+52 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      specialty,
      patients: isSuspended ? 0 : Math.floor(Math.random() * 60),
      status: isSuspended ? 'suspended' : 'active',
      joinedDate: getRandomDate(2024, 2026),
      lastActive: getRandomLastActive(),
      reportsCount: isSuspended ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 3),
    });
  }

  return nutritionists;
};

export const generatePatients = (count: number, nutritionists: Nutritionist[]): Patient[] => {
  const patients: Patient[] = [];
  const activeNutritionists = nutritionists.filter(n => n.status === 'active');

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const isSuspended = Math.random() < 0.02; // 2% suspended
    const nutritionist = activeNutritionists.length > 0
      ? activeNutritionists[Math.floor(Math.random() * activeNutritionists.length)]
      : nutritionists[0];

    patients.push({
      id: `patient-${i}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+52 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      nutritionist: nutritionist.name,
      nutritionistId: nutritionist.id,
      status: isSuspended ? 'suspended' : 'active',
      joinedDate: getRandomDate(2024, 2026),
      lastActive: getRandomLastActive(),
      appointments: isSuspended ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 20),
      reportsCount: isSuspended ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2),
    });
  }

  return patients;
};
