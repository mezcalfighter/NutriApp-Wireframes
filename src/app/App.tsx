import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useState, createContext, useContext } from 'react';
import { AppProvider } from './contexts/AppContext';

// Auth Components
import Login from './components/auth/Login';
import MFASetup from './components/auth/MFASetup';
import MFAVerification from './components/auth/MFAVerification';
import AccountLocked from './components/auth/AccountLocked';
import PasswordReset from './components/auth/PasswordReset';
import NutritionistRegister from './components/auth/NutritionistRegister';
import StudentsActivation from './components/auth/StudentsActivation';

// Nutritionist Components
import NutritionistDashboard from './components/nutritionist/Dashboard';
import PatientList from './components/nutritionist/PatientList';
import AddPatient from './components/nutritionist/AddPatient';
import EditPatient from './components/nutritionist/EditPatient';
import PatientDetail from './components/nutritionist/PatientDetail';
import TemplateLibrary from './components/nutritionist/TemplateLibrary';
import CreateTemplate from './components/nutritionist/CreateTemplate';
import AssignDiet from './components/nutritionist/AssignDiet';
import ViewPatientDiet from './components/nutritionist/ViewPatientDiet';
import Appointments from './components/nutritionist/Appointments';
import SetAvailability from './components/nutritionist/SetAvailability';
import AppointmentDetail from './components/nutritionist/AppointmentDetail';
import NutritionistProfile from './components/nutritionist/Profile';
import NutritionistBranding from './components/nutritionist/Branding';
import Finances from './components/nutritionist/Finances';
import Settings from './components/nutritionist/Settings';
import More from './components/nutritionist/More';
import AppointmentsManager from './components/nutritionist/AppointmentsManager';
import SubscriptionBilling from './components/nutritionist/SubscriptionBilling';
import PublicProfile from './components/nutritionist/PublicProfile';
import FeaturedSettings from './components/nutritionist/FeaturedSettings';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import ManageNutritionists from './components/admin/ManageNutritionists';
import ManagePatients from './components/admin/ManagePatients';
import AdminSocialModeration from './components/admin/AdminSocialModeration';
import ARCORequests from './components/admin/ARCORequests';
import AdminInstitutions from './components/admin/AdminInstitutions';
import InstitutionForm from './components/admin/InstitutionForm';
import ActivationCodes from './components/admin/ActivationCodes';
import AdminPlans from './components/admin/AdminPlans';
import AdminFeatured from './components/admin/AdminFeatured';
import AdminVerification from './components/admin/AdminVerification';

// Teacher Components
import TeacherDashboard from './components/teacher/TeacherDashboard';

// Social Components
import SocialFeed from './components/social/SocialFeed';
import CreatePost from './components/social/CreatePost';
import PostDetail from './components/social/PostDetail';

// Patient Components
import PatientDashboard from './components/patient/Dashboard';
import CurrentDiet from './components/patient/CurrentDiet';
import ProgressTracking from './components/patient/ProgressTracking';
import ScheduleAppointment from './components/patient/ScheduleAppointment';
import MyAppointments from './components/patient/MyAppointments';
import AppointmentConfirmation from './components/patient/AppointmentConfirmation';
import PatientAppointmentDetail from './components/patient/AppointmentDetail';
import PatientProfile from './components/patient/Profile';
import PatientGoals from './components/patient/Goals';

// Pricing & Payment
import PricingPage from './components/pricing/PricingPage';
import PaymentCheckout from './components/payment/PaymentCheckout';

// Landing & Onboarding
import LandingPage from './components/landing/LandingPage';
import FeaturesPage from './components/landing/FeaturesPage';
import StudentsPage from './components/landing/StudentsPage';
import PostRegisterFindNutritionist from './components/patient/PostRegisterFindNutritionist';
import FindNutritionist from './components/patient/FindNutritionist';
import ConfirmAppointment from './components/patient/ConfirmAppointment';

// Legal
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';

// UI
import { Toaster } from './components/ui/sonner';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => void;
  logout: () => void;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, login: () => {}, logout: () => {}, setUser: () => {} };
  }
  return context;
};

function App() {
  const [user, setUser] = useState<any>(null);

  const login = (email: string, password: string) => {
    const isStudent = email.includes('.edu') || email.includes('student') || email.includes('unam') || email.includes('iteso');
    const isAdmin = email.includes('admin');
    const isNutritionist = email.includes('nutritionist');
    const isTeacher = email.includes('teacher') || email.includes('docente') || email.includes('maestr');
    const isPatient = !isAdmin && !isNutritionist && !isStudent && !isTeacher;

    let userName = 'Usuario';
    if (isAdmin) userName = 'Administrador';
    else if (isTeacher) userName = 'Mtra. Laura Sánchez';
    else if (isStudent) userName = 'Est. María López';
    else if (isNutritionist) userName = 'Lic. Andrea Martínez';
    else if (isPatient) userName = 'Juan Pérez';

    const mockUser = {
      id: '1',
      email,
      role: isAdmin ? 'admin' : isTeacher ? 'teacher' : isStudent ? 'student' : isNutritionist ? 'nutritionist' : 'patient',
      name: userName,
      mfaEnabled: isAdmin || isNutritionist || isStudent || isTeacher,
      planType: isStudent ? 'students' : isNutritionist ? 'basic' : null,
      demoDataGenerated: false,
      institution: isStudent ? 'UNAM' : isTeacher ? 'UNAM' : null,
      program: isStudent ? 'Nutrición Clínica' : isTeacher ? 'Nutrición Clínica' : null,
      semesterEnd: isStudent ? '2026-06-30' : null,
    };
    setUser(mockUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      <AppProvider>
        <Toaster />
        <Router>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/funcionalidades" element={<FeaturesPage />} />
            <Route path="/students" element={<StudentsPage />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/mfa-setup" element={<MFASetup />} />
            <Route path="/mfa-verify" element={<MFAVerification />} />
            <Route path="/account-locked" element={<AccountLocked />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/students-activation" element={<StudentsActivation />} />

            {/* Legal */}
            <Route path="/aviso-privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos-uso" element={<TermsOfService />} />

            {/* Registration & Onboarding */}
            <Route path="/registro" element={<NutritionistRegister />} />
            <Route path="/registro-paciente" element={<Login />} />
            <Route path="/registro-paciente/encuentra-nutriologo" element={<PostRegisterFindNutritionist />} />
            <Route path="/buscar-nutriologo" element={<FindNutritionist />} />
            <Route path="/confirmar-cita" element={<ConfirmAppointment />} />
            <Route path="/checkout" element={<PaymentCheckout />} />

            {/* Nutritionist */}
            <Route path="/nutritionist/dashboard" element={<NutritionistDashboard />} />
            <Route path="/nutritionist/patients" element={<PatientList />} />
            <Route path="/nutritionist/patients/add" element={<AddPatient />} />
            <Route path="/nutritionist/patients/:id/edit" element={<EditPatient />} />
            <Route path="/nutritionist/patients/:id" element={<PatientDetail />} />
            <Route path="/nutritionist/templates" element={<TemplateLibrary />} />
            <Route path="/nutritionist/templates/create" element={<CreateTemplate />} />
            <Route path="/nutritionist/templates/:id/edit" element={<CreateTemplate />} />
            <Route path="/nutritionist/patients/:id/assign-diet" element={<AssignDiet />} />
            <Route path="/nutritionist/patients/:id/diet" element={<ViewPatientDiet />} />
            <Route path="/nutritionist/appointments" element={<Appointments />} />
            <Route path="/nutritionist/availability" element={<SetAvailability />} />
            <Route path="/nutritionist/appointments/:id" element={<AppointmentDetail />} />
            <Route path="/nutritionist/appointments-manager" element={<AppointmentsManager />} />
            <Route path="/nutritionist/profile" element={<NutritionistProfile />} />
            <Route path="/nutritionist/public-profile" element={<PublicProfile />} />
            <Route path="/nutritionist/branding" element={<NutritionistBranding />} />
            <Route path="/nutritionist/finances" element={<Finances />} />
            <Route path="/nutritionist/subscription" element={<SubscriptionBilling />} />
            <Route path="/nutritionist/featured-settings" element={<FeaturedSettings />} />
            <Route path="/nutritionist/settings" element={<Settings />} />
            <Route path="/nutritionist/more" element={<More />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/nutritionists" element={<ManageNutritionists />} />
            <Route path="/admin/patients" element={<ManagePatients />} />
            <Route path="/admin/moderation" element={<AdminSocialModeration />} />
            <Route path="/admin/arco-requests" element={<ARCORequests />} />
            <Route path="/admin/institutions" element={<AdminInstitutions />} />
            <Route path="/admin/institutions/new" element={<InstitutionForm />} />
            <Route path="/admin/institutions/:id/edit" element={<InstitutionForm />} />
            <Route path="/admin/institutions/:id/codes" element={<ActivationCodes />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/featured" element={<AdminFeatured />} />
            <Route path="/admin/verification" element={<AdminVerification />} />

            {/* Teacher */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

            {/* Social — Nutritionist */}
            <Route path="/nutritionist/community" element={<SocialFeed role="nutritionist" />} />
            <Route path="/nutritionist/community/create" element={<CreatePost />} />
            <Route path="/nutritionist/community/post/:id" element={<PostDetail role="nutritionist" />} />

            {/* Social — Patient */}
            <Route path="/patient/community" element={<SocialFeed role="patient" />} />
            <Route path="/patient/community/post/:id" element={<PostDetail role="patient" />} />

            {/* Patient */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/diet" element={<CurrentDiet />} />
            <Route path="/patient/progress" element={<ProgressTracking />} />
            <Route path="/patient/goals" element={<PatientGoals />} />
            <Route path="/patient/appointments" element={<ScheduleAppointment />} />
            <Route path="/patient/my-appointments" element={<MyAppointments />} />
            <Route path="/patient/appointments/:id/confirmation" element={<AppointmentConfirmation />} />
            <Route path="/patient/appointments/:id" element={<PatientAppointmentDetail />} />
            <Route path="/patient/profile" element={<PatientProfile />} />

            {/* Redirects */}
            <Route path="/nutritionist/finance-dashboard" element={<Navigate to="/nutritionist/finances" replace />} />
            <Route path="/nutritionist/referrals-dashboard" element={<Navigate to="/nutritionist/settings" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthContext.Provider>
  );
}

export default App;
