// Utility functions to calculate business metrics dynamically from appointments data

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  consultationType: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  basePrice: number;
  couponCode?: string;
  discount: number;
  finalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isPaid: boolean;
  notes?: string;
  createdAt: string;
}

// Metric definitions with calculation methods
export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: 'financial' | 'patients' | 'appointments' | 'performance';
  defaultTarget: number;
  higherIsBetter: boolean; // True if higher values are better (e.g., income), false if lower is better (e.g., churn)
}

// Predefined metrics available in the system
export const AVAILABLE_METRICS: MetricDefinition[] = [
  {
    id: 'weeklyIncome',
    name: 'Ingresos Semanales',
    description: 'Total de ingresos generados esta semana',
    unit: 'MXN',
    category: 'financial',
    defaultTarget: 15000,
    higherIsBetter: true,
  },
  {
    id: 'monthlyIncome',
    name: 'Ingresos Mensuales',
    description: 'Total de ingresos generados este mes',
    unit: 'MXN',
    category: 'financial',
    defaultTarget: 60000,
    higherIsBetter: true,
  },
  {
    id: 'avgIncomePerPatient',
    name: 'Ingreso Promedio por Paciente',
    description: 'Ingreso promedio generado por cada paciente',
    unit: 'MXN',
    category: 'financial',
    defaultTarget: 2000,
    higherIsBetter: true,
  },
  {
    id: 'totalPatients',
    name: 'Total de Pacientes',
    description: 'Número total de pacientes únicos',
    unit: 'pacientes',
    category: 'patients',
    defaultTarget: 50,
    higherIsBetter: true,
  },
  {
    id: 'newPatientsThisMonth',
    name: 'Pacientes Nuevos (Mes)',
    description: 'Pacientes nuevos adquiridos este mes',
    unit: 'pacientes',
    category: 'patients',
    defaultTarget: 10,
    higherIsBetter: true,
  },
  {
    id: 'activePatients',
    name: 'Pacientes Activos',
    description: 'Pacientes con citas en los últimos 30 días',
    unit: 'pacientes',
    category: 'patients',
    defaultTarget: 30,
    higherIsBetter: true,
  },
  {
    id: 'appointmentsThisWeek',
    name: 'Citas Esta Semana',
    description: 'Total de citas programadas esta semana',
    unit: 'citas',
    category: 'appointments',
    defaultTarget: 25,
    higherIsBetter: true,
  },
  {
    id: 'appointmentsThisMonth',
    name: 'Citas Este Mes',
    description: 'Total de citas programadas este mes',
    unit: 'citas',
    category: 'appointments',
    defaultTarget: 100,
    higherIsBetter: true,
  },
  {
    id: 'avgAppointmentsPerWeek',
    name: 'Promedio de Citas Semanales',
    description: 'Promedio de citas completadas por semana',
    unit: 'citas',
    category: 'appointments',
    defaultTarget: 20,
    higherIsBetter: true,
  },
  {
    id: 'completionRate',
    name: 'Tasa de Completación',
    description: 'Porcentaje de citas completadas vs programadas',
    unit: '%',
    category: 'performance',
    defaultTarget: 85,
    higherIsBetter: true,
  },
  {
    id: 'cancellationRate',
    name: 'Tasa de Cancelaciones',
    description: 'Porcentaje de citas canceladas',
    unit: '%',
    category: 'performance',
    defaultTarget: 5,
    higherIsBetter: false,
  },
  {
    id: 'returnRate',
    name: 'Tasa de Retorno',
    description: 'Pacientes que regresan dentro de 30 días',
    unit: '%',
    category: 'performance',
    defaultTarget: 70,
    higherIsBetter: true,
  },
  {
    id: 'churnRate',
    name: 'Tasa de Abandono',
    description: 'Pacientes sin citas en más de 2 meses',
    unit: '%',
    category: 'performance',
    defaultTarget: 15,
    higherIsBetter: false,
  },
  {
    id: 'conversionRate',
    name: 'Conversión Inicial a Seguimiento',
    description: 'Pacientes que regresan después de consulta inicial',
    unit: '%',
    category: 'performance',
    defaultTarget: 75,
    higherIsBetter: true,
  },
  {
    id: 'scheduleOccupancy',
    name: 'Ocupación de Agenda',
    description: 'Porcentaje de slots ocupados esta semana',
    unit: '%',
    category: 'appointments',
    defaultTarget: 85,
    higherIsBetter: true,
  },
];

// Get start and end of current week
function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}

// Get start and end of current month
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

// 1. Weekly Income Goal
export function calculateWeeklyIncome(appointments: Appointment[]): number {
  const { start, end } = getWeekRange();
  
  return appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return apt.status === 'completed' && apt.isPaid && aptDate >= start && aptDate <= end;
    })
    .reduce((sum, apt) => sum + apt.finalPrice, 0);
}

// 2. Return Rate (patients with multiple appointments within 1 month)
export function calculateReturnRate(appointments: Appointment[]): number {
  const completedAppointments = appointments.filter((apt) => apt.status === 'completed');
  
  // Group by patient
  const patientAppointments: Record<string, Appointment[]> = {};
  completedAppointments.forEach((apt) => {
    if (!patientAppointments[apt.patientId]) {
      patientAppointments[apt.patientId] = [];
    }
    patientAppointments[apt.patientId].push(apt);
  });
  
  const uniquePatients = Object.keys(patientAppointments).length;
  if (uniquePatients === 0) return 0;
  
  // Count patients with return visits within 1 month
  let returningPatients = 0;
  Object.values(patientAppointments).forEach((apts) => {
    if (apts.length < 2) return;
    
    // Sort by date
    const sorted = apts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Check if any consecutive appointments are within 30 days
    for (let i = 0; i < sorted.length - 1; i++) {
      const date1 = new Date(sorted[i].date);
      const date2 = new Date(sorted[i + 1].date);
      const daysDiff = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 30) {
        returningPatients++;
        break;
      }
    }
  });
  
  return (returningPatients / uniquePatients) * 100;
}

// 3. Churn Rate (patients without appointments for > 2 months)
export function calculateChurnRate(appointments: Appointment[]): number {
  const completedAppointments = appointments.filter((apt) => apt.status === 'completed');
  
  // Group by patient
  const patientAppointments: Record<string, Appointment[]> = {};
  completedAppointments.forEach((apt) => {
    if (!patientAppointments[apt.patientId]) {
      patientAppointments[apt.patientId] = [];
    }
    patientAppointments[apt.patientId].push(apt);
  });
  
  const uniquePatients = Object.keys(patientAppointments).length;
  if (uniquePatients === 0) return 0;
  
  const now = new Date();
  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(now.getMonth() - 2);
  
  let churnedPatients = 0;
  Object.values(patientAppointments).forEach((apts) => {
    // Get most recent appointment
    const mostRecent = apts.reduce((latest, apt) => {
      const latestDate = new Date(latest.date);
      const aptDate = new Date(apt.date);
      return aptDate > latestDate ? apt : latest;
    });
    
    const mostRecentDate = new Date(mostRecent.date);
    if (mostRecentDate < twoMonthsAgo) {
      churnedPatients++;
    }
  });
  
  return (churnedPatients / uniquePatients) * 100;
}

// 4. Schedule Occupancy (% of available slots filled)
export function calculateScheduleOccupancy(appointments: Appointment[]): number {
  // For demo purposes, assume 8 slots per day, 5 days per week = 40 slots per week
  const totalSlotsPerWeek = 40;
  const { start, end } = getWeekRange();
  
  const appointmentsThisWeek = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return (
      (apt.status === 'confirmed' || apt.status === 'completed') &&
      aptDate >= start &&
      aptDate <= end
    );
  });
  
  return (appointmentsThisWeek.length / totalSlotsPerWeek) * 100;
}

// 5. Initial to Follow-up Conversion
export function calculateConversionRate(appointments: Appointment[]): number {
  const completedAppointments = appointments.filter((apt) => apt.status === 'completed');
  
  // Count initial consultations
  const initialConsults = completedAppointments.filter((apt) =>
    apt.consultationType.name.toLowerCase().includes('inicial')
  );
  
  if (initialConsults.length === 0) return 0;
  
  // Group by patient
  const patientAppointments: Record<string, Appointment[]> = {};
  completedAppointments.forEach((apt) => {
    if (!patientAppointments[apt.patientId]) {
      patientAppointments[apt.patientId] = [];
    }
    patientAppointments[apt.patientId].push(apt);
  });
  
  // Count patients who had initial consult and came back
  let patientsWithFollowUp = 0;
  initialConsults.forEach((initial) => {
    const patientApts = patientAppointments[initial.patientId];
    if (patientApts.length > 1) {
      patientsWithFollowUp++;
    }
  });
  
  return (patientsWithFollowUp / initialConsults.length) * 100;
}

// 6. New Patients This Month
export function calculateNewPatientsThisMonth(appointments: Appointment[]): number {
  const { start, end } = getMonthRange();
  
  // Get unique patient IDs with their first appointment date
  const patientFirstAppointment: Record<string, Date> = {};
  
  appointments
    .filter((apt) => apt.status === 'completed' || apt.status === 'confirmed')
    .forEach((apt) => {
      const aptDate = new Date(apt.date);
      if (!patientFirstAppointment[apt.patientId]) {
        patientFirstAppointment[apt.patientId] = aptDate;
      } else {
        const currentFirst = patientFirstAppointment[apt.patientId];
        if (aptDate < currentFirst) {
          patientFirstAppointment[apt.patientId] = aptDate;
        }
      }
    });
  
  // Count patients whose first appointment is this month
  return Object.values(patientFirstAppointment).filter(
    (firstDate) => firstDate >= start && firstDate <= end
  ).length;
}

// 7. Average Income Per Patient
export function calculateAvgIncomePerPatient(appointments: Appointment[]): number {
  const paidAppointments = appointments.filter(
    (apt) => apt.status === 'completed' && apt.isPaid
  );
  
  if (paidAppointments.length === 0) return 0;
  
  const totalIncome = paidAppointments.reduce((sum, apt) => sum + apt.finalPrice, 0);
  const uniquePatients = new Set(paidAppointments.map((apt) => apt.patientId)).size;
  
  return uniquePatients > 0 ? totalIncome / uniquePatients : 0;
}

// 8. Cancellation Rate
export function calculateCancellationRate(appointments: Appointment[]): number {
  const totalAppointments = appointments.length;
  if (totalAppointments === 0) return 0;
  
  const cancelledAppointments = appointments.filter((apt) => apt.status === 'cancelled').length;
  
  return (cancelledAppointments / totalAppointments) * 100;
}

// 9. Monthly Income
export function calculateMonthlyIncome(appointments: Appointment[]): number {
  const { start, end } = getMonthRange();
  
  return appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return apt.status === 'completed' && apt.isPaid && aptDate >= start && aptDate <= end;
    })
    .reduce((sum, apt) => sum + apt.finalPrice, 0);
}

// 10. Total Patients
export function calculateTotalPatients(appointments: Appointment[]): number {
  const uniquePatients = new Set(
    appointments
      .filter((apt) => apt.status === 'completed' || apt.status === 'confirmed')
      .map((apt) => apt.patientId)
  );
  return uniquePatients.size;
}

// 11. Active Patients (with appointments in last 30 days)
export function calculateActivePatients(appointments: Appointment[]): number {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const recentPatients = new Set(
    appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date);
        return (
          (apt.status === 'completed' || apt.status === 'confirmed') &&
          aptDate >= thirtyDaysAgo
        );
      })
      .map((apt) => apt.patientId)
  );
  
  return recentPatients.size;
}

// 12. Appointments This Week
export function calculateAppointmentsThisWeek(appointments: Appointment[]): number {
  const { start, end } = getWeekRange();
  
  return appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return (
      (apt.status === 'confirmed' || apt.status === 'completed') &&
      aptDate >= start &&
      aptDate <= end
    );
  }).length;
}

// 13. Appointments This Month
export function calculateAppointmentsThisMonth(appointments: Appointment[]): number {
  const { start, end } = getMonthRange();
  
  return appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return (
      (apt.status === 'confirmed' || apt.status === 'completed') &&
      aptDate >= start &&
      aptDate <= end
    );
  }).length;
}

// 14. Average Appointments Per Week
export function calculateAvgAppointmentsPerWeek(appointments: Appointment[]): number {
  const completedAppointments = appointments.filter((apt) => apt.status === 'completed');
  
  if (completedAppointments.length === 0) return 0;
  
  // Get date range of all appointments
  const dates = completedAppointments.map((apt) => new Date(apt.date).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  // Calculate number of weeks
  const daysDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  const weeks = Math.max(daysDiff / 7, 1); // Minimum 1 week
  
  return completedAppointments.length / weeks;
}

// 15. Completion Rate
export function calculateCompletionRate(appointments: Appointment[]): number {
  const totalScheduled = appointments.filter((apt) => 
    apt.status === 'completed' || apt.status === 'confirmed' || apt.status === 'cancelled'
  ).length;
  
  if (totalScheduled === 0) return 0;
  
  const completed = appointments.filter((apt) => apt.status === 'completed').length;
  
  return (completed / totalScheduled) * 100;
}

// Calculate all metrics at once
export function calculateAllMetrics(appointments: Appointment[]) {
  return {
    weeklyIncome: Math.round(calculateWeeklyIncome(appointments)),
    monthlyIncome: Math.round(calculateMonthlyIncome(appointments)),
    avgIncomePerPatient: Math.round(calculateAvgIncomePerPatient(appointments)),
    totalPatients: calculateTotalPatients(appointments),
    newPatientsThisMonth: calculateNewPatientsThisMonth(appointments),
    activePatients: calculateActivePatients(appointments),
    appointmentsThisWeek: calculateAppointmentsThisWeek(appointments),
    appointmentsThisMonth: calculateAppointmentsThisMonth(appointments),
    avgAppointmentsPerWeek: Math.round(calculateAvgAppointmentsPerWeek(appointments) * 10) / 10,
    completionRate: Math.round(calculateCompletionRate(appointments) * 10) / 10,
    cancellationRate: Math.round(calculateCancellationRate(appointments) * 10) / 10,
    returnRate: Math.round(calculateReturnRate(appointments) * 10) / 10,
    churnRate: Math.round(calculateChurnRate(appointments) * 10) / 10,
    conversionRate: Math.round(calculateConversionRate(appointments) * 10) / 10,
    scheduleOccupancy: Math.round(calculateScheduleOccupancy(appointments) * 10) / 10,
  };
}

// Get calculated value for a specific metric
export function getMetricValue(metricId: string, appointments: Appointment[]): number {
  const allMetrics = calculateAllMetrics(appointments);
  return allMetrics[metricId as keyof typeof allMetrics] || 0;
}