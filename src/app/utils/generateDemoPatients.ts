// Utility to generate realistic demo patients for Students accounts

export interface DemoPatient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'M' | 'F';
  bloodType: string;
  height: number; // cm
  weight: number; // kg
  allergies: string;
  illnesses: string;
  goals: string;
  referralSource: string;
  createdAt: string;
  lastVisit: string;
  status: 'active' | 'inactive';
  isFictional: true; // Flag to indicate this is demo data
}

const maleFirstNames = [
  'Carlos', 'Juan', 'José', 'Luis', 'Miguel', 'Pedro', 'Francisco', 'Javier',
  'Antonio', 'Rafael', 'Fernando', 'Ricardo', 'Alejandro', 'Roberto', 'Diego',
  'Manuel', 'Jorge', 'Raúl', 'Ángel', 'Arturo', 'Sergio', 'Eduardo', 'Alberto',
  'Gerardo', 'Héctor', 'Óscar', 'Andrés', 'Enrique', 'Víctor', 'Daniel'
];

const femaleFirstNames = [
  'María', 'Ana', 'Laura', 'Carmen', 'Isabel', 'Rosa', 'Elena', 'Patricia',
  'Teresa', 'Lucía', 'Mónica', 'Sofía', 'Gabriela', 'Valeria', 'Andrea',
  'Mariana', 'Daniela', 'Alejandra', 'Cristina', 'Claudia', 'Silvia', 'Verónica',
  'Sandra', 'Diana', 'Rocío', 'Beatriz', 'Norma', 'Gloria', 'Adriana', 'Paula'
];

const lastNames = [
  'García', 'Rodríguez', 'Martínez', 'Hernández', 'López', 'González', 'Pérez',
  'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz',
  'Morales', 'Jiménez', 'Ruiz', 'Álvarez', 'Castillo', 'Romero', 'Gutiérrez',
  'Mendoza', 'Ortiz', 'Silva', 'Vargas', 'Reyes', 'Castro', 'Ramos', 'Herrera',
  'Medina', 'Aguilar', 'Delgado', 'Rojas', 'Vega', 'Navarro', 'Campos', 'Cortés'
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const allergies = [
  '',
  '',
  '',
  'Lactosa',
  'Gluten',
  'Frutos secos',
  'Mariscos',
  'Soya',
  'Huevo',
  'Polen',
  'Ninguna conocida',
  'Ninguna conocida',
];

const commonGoals = [
  'Pérdida de peso',
  'Ganancia de masa muscular',
  'Mejorar energía diaria',
  'Control de diabetes',
  'Alimentación más saludable',
  'Reducir colesterol',
  'Mejorar digestión',
  'Nutrición deportiva',
  'Control de presión arterial',
  'Mantenimiento de peso actual',
];

const referralSources = [
  'Redes Sociales',
  'Redes Sociales',
  'Amigos/Familiares',
  'Amigos/Familiares',
  'Google',
  'Recomendación médica',
  'Otro',
];

// Some patients will have chronic conditions
const chronicConditions = [
  '',
  '',
  '',
  '',
  '',
  'Diabetes tipo 2',
  'Hipertensión',
  'Hipotiroidismo',
  'Síndrome de ovario poliquístico',
  'Colesterol alto',
  'Anemia',
  'Gastritis',
  'Reflujo gastroesofágico',
];

const getRandomDate = (startYear: number, endYear: number): string => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const getRandomItem = <T,>(array: T[]): T => {
  const index = Math.abs(Math.floor(Math.random() * array.length)) % array.length;
  return array[index];
};

// Generate realistic weight based on height, age, and gender
const generateWeight = (height: number, gender: 'M' | 'F', age: number): number => {
  // Using a modified BMI approach
  // Base BMI range: 18.5 to 32 (underweight to obese range)
  const baseBMI = 18.5 + Math.random() * 13.5;

  // Most people cluster around 22-28 BMI
  const adjustedBMI = Math.random() < 0.7
    ? 22 + Math.random() * 6  // 70% of people in 22-28 range
    : baseBMI;

  const heightInMeters = height / 100;
  let weight = adjustedBMI * heightInMeters * heightInMeters;

  // Add some randomness and gender adjustment
  if (gender === 'M') {
    weight += Math.random() * 5; // Men tend to be slightly heavier
  } else {
    weight -= Math.random() * 3;
  }

  // Ensure weight is in realistic range
  weight = Math.max(40, Math.min(150, weight));

  return Math.round(weight * 10) / 10; // One decimal place
};

// Generate realistic height based on gender and age
const generateHeight = (gender: 'M' | 'F', age: number): number => {
  let baseHeight: number;

  if (gender === 'M') {
    // Average Mexican male height ~170cm, range 155-185
    baseHeight = 165 + Math.random() * 20;
  } else {
    // Average Mexican female height ~157cm, range 145-175
    baseHeight = 150 + Math.random() * 25;
  }

  // Older people might be slightly shorter
  if (age > 60) {
    baseHeight -= Math.random() * 5;
  }

  return Math.round(baseHeight * 10) / 10;
};

export const generateDemoPatients = (count: number = 10): DemoPatient[] => {
  const patients: DemoPatient[] = [];

  for (let i = 1; i <= count; i++) {
    const gender = Math.random() < 0.5 ? 'M' : 'F';
    const firstName = gender === 'M'
      ? getRandomItem(maleFirstNames)
      : getRandomItem(femaleFirstNames);
    const lastName = getRandomItem(lastNames);
    const secondLastName = getRandomItem(lastNames);
    const fullName = `${firstName} ${lastName} ${secondLastName}`;

    // Age: 18-85 (realistic adult range)
    const age = 18 + Math.floor(Math.random() * 67);

    const height = generateHeight(gender, age);
    const weight = generateWeight(height, gender, age);

    const bloodType = getRandomItem(bloodTypes);
    const allergy = getRandomItem(allergies);
    const illness = getRandomItem(chronicConditions);
    const goal = getRandomItem(commonGoals);
    const referralSource = getRandomItem(referralSources);

    const joinedDate = getRandomDate(2025, 2026);
    const lastVisitDate = getRandomDate(2026, 2026);
    const isActive = Math.random() < 0.85; // 85% active

    patients.push({
      id: `DEMO-PATIENT-${String(i).padStart(3, '0')}`,
      fullName,
      email: `demo.${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@ficticio.nutriapp.com`,
      phone: `+52 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      age,
      gender,
      bloodType,
      height,
      weight,
      allergies: allergy,
      illnesses: illness,
      goals: goal,
      referralSource: referralSource,
      createdAt: joinedDate,
      lastVisit: lastVisitDate,
      status: isActive ? 'active' : 'inactive',
      isFictional: true,
    });
  }

  return patients;
};

// Generate a consistent set of demo patients based on a seed (nutritionist email)
export const generateConsistentDemoPatients = (seed: string, count: number = 10): DemoPatient[] => {
  // Simple seeded random for consistency
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Use hash to seed Math.random replacement
  // Double-modulo keeps hash non-negative even when JS bitwise ops produce negatives.
  const seededRandom = () => {
    hash = ((hash * 9301 + 49297) % 233280 + 233280) % 233280;
    return hash / 233280;
  };

  // Override Math.random temporarily
  const originalRandom = Math.random;
  Math.random = seededRandom;

  const patients = generateDemoPatients(count);

  // Restore original Math.random
  Math.random = originalRandom;

  return patients;
};
