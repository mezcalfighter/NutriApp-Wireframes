import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PDFLabels {
  breakfast: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
  eveningSnack: string;
  notes: string;
  dietPlan: string;
  nutritionalSummary: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  patient: string;
  nutritionist: string;
  startDate: string;
  endDate: string;
  mealPlan: string;
}

// New metric configuration structure - only stores visibility and target values
interface MetricConfig {
  metricId: string; // References AVAILABLE_METRICS in metricsCalculations.ts
  visible: boolean;
  targetValue: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  usageCount: number;
  maxUsage?: number;
}

interface ConsultationType {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
  appointmentId?: string;
}

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

interface NutritionistSettings {
  academicDegree: 'Licenciado' | 'Licenciada' | 'Maestro' | 'Maestra' | 'Doctor' | 'Doctora';
  gender: 'male' | 'female'; // For proper title formatting
  nutritionistName: string;
  practiceName: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
  watermark: string;
  pdfColor: string; // Hex color for PDF theme
  pdfLabels: PDFLabels;
  metrics: MetricConfig[];
  coupons?: Coupon[];
  consultationTypes?: ConsultationType[];
}

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  nutritionistSettings: NutritionistSettings;
  updateNutritionistSettings: (settings: Partial<NutritionistSettings>) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark mode
  });
  const [nutritionistSettings, setNutritionistSettings] = useState<NutritionistSettings>({
    academicDegree: 'Doctor',
    gender: 'female',
    nutritionistName: 'Sarah Johnson',
    practiceName: 'Nutrición Integral',
    phone: '+52 123 456 7890',
    email: 'contacto@nutricion.com',
    address: 'Ciudad de México, CDMX',
    logo: '',
    watermark: '',
    pdfColor: '#D1FAE5', // Default emerald-100
    pdfLabels: {
      breakfast: 'Desayuno',
      morningSnack: 'Colación Mañana',
      lunch: 'Comida',
      afternoonSnack: 'Colación Tarde',
      dinner: 'Cena',
      eveningSnack: 'Colación Noche',
      notes: 'Notas',
      dietPlan: 'Plan de Dieta',
      nutritionalSummary: 'Resumen Nutricional',
      calories: 'Calorías',
      protein: 'Proteínas',
      carbs: 'Carbohidratos',
      fats: 'Grasas',
      patient: 'Paciente',
      nutritionist: 'Nutricionista',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      mealPlan: 'Plan de Comidas',
    },
    metrics: [
      { metricId: 'weeklyIncome', visible: true, targetValue: 15000 },
      { metricId: 'monthlyIncome', visible: false, targetValue: 60000 },
      { metricId: 'avgIncomePerPatient', visible: false, targetValue: 2000 },
      { metricId: 'totalPatients', visible: true, targetValue: 50 },
      { metricId: 'newPatientsThisMonth', visible: true, targetValue: 10 },
      { metricId: 'activePatients', visible: false, targetValue: 30 },
      { metricId: 'appointmentsThisWeek', visible: true, targetValue: 25 },
      { metricId: 'appointmentsThisMonth', visible: false, targetValue: 100 },
      { metricId: 'avgAppointmentsPerWeek', visible: false, targetValue: 20 },
      { metricId: 'completionRate', visible: false, targetValue: 85 },
      { metricId: 'cancellationRate', visible: false, targetValue: 5 },
      { metricId: 'returnRate', visible: false, targetValue: 70 },
      { metricId: 'churnRate', visible: false, targetValue: 15 },
      { metricId: 'conversionRate', visible: false, targetValue: 75 },
      { metricId: 'scheduleOccupancy', visible: false, targetValue: 85 },
    ],
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('nutritionistSettings');
    if (savedSettings) {
      try {
        setNutritionistSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading nutritionist settings:', e);
      }
    }

    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        console.error('Error loading appointments:', e);
      }
    } else {
      // Initialize with demo appointments
      const demoAppointments: Appointment[] = [
        {
          id: '1',
          patientId: 'patient-1',
          patientName: 'María González',
          date: '2026-01-20',
          time: '09:00 AM',
          consultationType: {
            id: '1',
            name: 'Consulta Inicial',
            price: 1500,
            duration: 60,
          },
          basePrice: 1500,
          discount: 0,
          finalPrice: 1500,
          status: 'completed',
          isPaid: true,
          notes: 'Primera consulta, paciente interesada en plan nutricional',
          createdAt: '2026-01-15T10:00:00Z',
        },
        {
          id: '2',
          patientId: 'patient-2',
          patientName: 'Juan Pérez',
          date: '2026-01-21',
          time: '10:00 AM',
          consultationType: {
            id: '2',
            name: 'Consulta de Seguimiento',
            price: 1000,
            duration: 45,
          },
          basePrice: 1000,
          couponCode: 'BIENVENIDA30',
          discount: 300,
          finalPrice: 700,
          status: 'completed',
          isPaid: true,
          createdAt: '2026-01-16T11:00:00Z',
        },
        {
          id: '3',
          patientId: 'patient-3',
          patientName: 'Ana Martínez',
          date: '2026-01-22',
          time: '02:00 PM',
          consultationType: {
            id: '1',
            name: 'Consulta Inicial',
            price: 1500,
            duration: 60,
          },
          basePrice: 1500,
          discount: 0,
          finalPrice: 1500,
          status: 'completed',
          isPaid: false,
          notes: 'Pendiente de pago',
          createdAt: '2026-01-17T09:00:00Z',
        },
        {
          id: '4',
          patientId: 'patient-1',
          patientName: 'María González',
          date: '2026-01-27',
          time: '09:00 AM',
          consultationType: {
            id: '2',
            name: 'Consulta de Seguimiento',
            price: 1000,
            duration: 45,
          },
          basePrice: 1000,
          discount: 0,
          finalPrice: 1000,
          status: 'confirmed',
          isPaid: false,
          createdAt: '2026-01-20T14:00:00Z',
        },
        {
          id: '5',
          patientId: 'patient-4',
          patientName: 'Carlos Rodríguez',
          date: '2026-01-28',
          time: '11:00 AM',
          consultationType: {
            id: '1',
            name: 'Consulta Inicial',
            price: 1500,
            duration: 60,
          },
          basePrice: 1500,
          discount: 0,
          finalPrice: 1500,
          status: 'pending',
          isPaid: false,
          notes: 'Interesado en plan para deportistas',
          createdAt: '2026-01-21T16:00:00Z',
        },
      ];
      setAppointments(demoAppointments);
      localStorage.setItem('appointments', JSON.stringify(demoAppointments));
    }

    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  const updateNutritionistSettings = (settings: Partial<NutritionistSettings>) => {
    const newSettings = { ...nutritionistSettings, ...settings };
    setNutritionistSettings(newSettings);
    localStorage.setItem('nutritionistSettings', JSON.stringify(newSettings));
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    localStorage.setItem('appointments', JSON.stringify([...appointments, appointment]));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, ...updates } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const deleteAppointment = (id: string) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    setNotifications([...notifications, newNotification]);
    localStorage.setItem('notifications', JSON.stringify([...notifications, newNotification]));
  };

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        nutritionistSettings,
        updateNutritionistSettings,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}