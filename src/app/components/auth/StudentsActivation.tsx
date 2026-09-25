import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, ArrowLeft, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

interface InstitutionCode {
  institution: string;
  program: string;
  domains: string[];
}

const VALID_CODES: Record<string, InstitutionCode> = {
  'NUTRI-UNAM-2026': {
    institution: 'UNAM',
    program: 'Nutrición Clínica',
    domains: ['unam.mx', 'dgae.unam.mx'],
  },
  'NUTRI-ITES-2026': {
    institution: 'ITESO',
    program: 'Ingeniería en Alimentos',
    domains: ['iteso.mx', 'alumnos.iteso.mx'],
  },
};

const EXPIRED_CODE = 'NUTRI-VENC-0000';
const EXHAUSTED_CODE = 'NUTRI-AGOT-9999';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getEmailDomain(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : '';
}

// ---------------------------------------------------------------------------
// Step progress indicator
// ---------------------------------------------------------------------------

const STEP_LABELS = ['Código', 'Correo', 'Cuenta'];

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-6">
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-3">
        Paso {step} de 3
      </p>
      <div className="flex items-center justify-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const active = num === step;
          const done = num < step;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {done ? <CheckCircle className="w-4 h-4" /> : num}
                </div>
                <span
                  className={`text-xs ${
                    active
                      ? 'text-purple-600 dark:text-purple-400 font-medium'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`w-8 h-0.5 mb-4 transition-colors ${
                    done ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Institution chip
// ---------------------------------------------------------------------------

function InstitutionChip({ institution, program }: { institution: string; program: string }) {
  return (
    <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-2 mb-4">
      <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 truncate">
          {institution}
        </p>
        <p className="text-xs text-purple-500 dark:text-purple-400 truncate">{program}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Activation code
// ---------------------------------------------------------------------------

interface Step1Props {
  onNext: (code: string, info: InstitutionCode) => void;
}

function Step1({ onNext }: Step1Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [validInfo, setValidInfo] = useState<InstitutionCode | null>(null);

  function handleChange(value: string) {
    const upper = value.toUpperCase();
    setCode(upper);
    setError('');
    setValidInfo(null);

    if (upper === EXPIRED_CODE) {
      setError('Este código venció el 31 de enero de 2026.');
    } else if (upper === EXHAUSTED_CODE) {
      setError('Este código ya alcanzó su número de usos.');
    } else if (upper.length >= 14) {
      const info = VALID_CODES[upper];
      if (info) {
        setValidInfo(info);
      } else if (upper.startsWith('NUTRI-')) {
        setError('Este código no existe.');
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Código de activación
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="NUTRI-XXXX-XXXX"
          maxLength={18}
          className="w-full uppercase rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Tu institución te lo entregó. Si no lo tienes, pídelo a tu docente responsable.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {validInfo && (
        <div className="rounded-lg border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-4 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Código válido
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Institución:</span> {validInfo.institution}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Programa:</span> {validInfo.program}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Cupo disponible
          </p>
        </div>
      )}

      <button
        disabled={!validInfo}
        onClick={() => validInfo && onNext(code, validInfo)}
        className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Institutional email
// ---------------------------------------------------------------------------

interface Step2Props {
  institutionInfo: InstitutionCode;
  onNext: (email: string) => void;
  onBack: () => void;
}

type EmailPhase = 'input' | 'otp' | 'verified';

function Step2({ institutionInfo, onNext, onBack }: Step2Props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phase, setPhase] = useState<EmailPhase>('input');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  function handleSendCode() {
    const domain = getEmailDomain(email);
    if (!institutionInfo.domains.includes(domain)) {
      setEmailError(
        `Ese dominio no está autorizado para ${institutionInfo.institution}. Usa tu correo institucional o pide a tu docente que lo agregue.`
      );
      return;
    }
    setEmailError('');
    setPhase('otp');
  }

  function handleVerifyOtp() {
    if (otp.length !== 6) {
      setOtpError('El código debe ser de 6 dígitos.');
      return;
    }
    setOtpError('');
    setPhase('verified');
  }

  return (
    <div className="space-y-4">
      <InstitutionChip
        institution={institutionInfo.institution}
        program={institutionInfo.program}
      />

      {phase !== 'verified' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Correo institucional
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            disabled={phase === 'otp'}
            placeholder={`usuario@${institutionInfo.domains[0]}`}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Debe ser el correo que te dio tu institución (
            {institutionInfo.domains.join(', ')}).
          </p>
          {emailError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{emailError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {phase === 'input' && (
        <button
          disabled={!email.includes('@')}
          onClick={handleSendCode}
          className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Enviar código de verificación
        </button>
      )}

      {phase === 'otp' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Ingresa el código de 6 dígitos enviado a{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
          </p>
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(val);
                setOtpError('');
              }}
              maxLength={6}
              placeholder="000000"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-center tracking-widest text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            {otpError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{otpError}</AlertDescription>
              </Alert>
            )}
          </div>
          <button
            onClick={handleVerifyOtp}
            className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Verificar código
          </button>
        </div>
      )}

      {phase === 'verified' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Correo verificado ✓
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">{email}</p>
            </div>
          </div>
          <button
            onClick={() => onNext(email)}
            className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      )}

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar al paso anterior
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Personal data & consent
// ---------------------------------------------------------------------------

interface Step3Props {
  institutionInfo: InstitutionCode;
  onBack: () => void;
}

function Step3({ institutionInfo, onBack }: Step3Props) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [ficticiosChecked, setFicticiosChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.';

    if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'La contraseña debe tener al menos una letra mayúscula.';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'La contraseña debe tener al menos un número.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    toast.success('Cuenta creada exitosamente');
    navigate('/mfa-setup');
  }

  const canSubmit =
    privacyChecked &&
    ficticiosChecked &&
    nombre.trim() &&
    apellidos.trim() &&
    password.length >= 8 &&
    password === confirmPassword &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password);

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1 text-sm">
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {institutionInfo.institution} — {institutionInfo.program}
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          Vigente hasta{' '}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            30 de junio de 2026
          </span>
        </p>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre(s)"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        {errors.nombre && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.nombre}</p>
        )}
      </div>

      {/* Apellidos */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Apellidos
        </label>
        <input
          type="text"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          placeholder="Primer y segundo apellido"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        {errors.apellidos && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.apellidos}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Al menos 8 caracteres, una mayúscula y un número.
        </p>
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Confirmar contraseña
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite tu contraseña"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyChecked}
            onChange={(e) => setPrivacyChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            He leído el{' '}
            <a
              href="/aviso-privacidad"
              className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300"
            >
              Aviso de privacidad
            </a>{' '}
            y acepto los{' '}
            <a
              href="/terminos-uso"
              className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300"
            >
              Términos de uso
            </a>
            .
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ficticiosChecked}
            onChange={(e) => setFicticiosChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Entiendo que mi cuenta Students solo funciona con pacientes ficticios y no debe
            usarse con personas reales.
          </span>
        </label>
      </div>

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Crear cuenta Students
      </button>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar al paso anterior
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StudentsActivation() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activationCode, setActivationCode] = useState('');
  const [institutionInfo, setInstitutionInfo] = useState<InstitutionCode | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  function handleStep1Next(code: string, info: InstitutionCode) {
    setActivationCode(code);
    setInstitutionInfo(info);
    setStep(2);
  }

  function handleStep2Next(email: string) {
    setVerifiedEmail(email);
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Logo & title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center mb-3 shadow-lg">
            <Heart className="w-9 h-9 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            NutriApp Students
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Activación de cuenta académica
          </p>
        </div>

        <Card className="shadow-xl border-0 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <StepIndicator step={step} />
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
              {step === 1 && 'Código de activación'}
              {step === 2 && 'Correo institucional'}
              {step === 3 && 'Datos y consentimiento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && <Step1 onNext={handleStep1Next} />}
            {step === 2 && institutionInfo && (
              <Step2
                institutionInfo={institutionInfo}
                onNext={handleStep2Next}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && institutionInfo && (
              <Step3
                institutionInfo={institutionInfo}
                onBack={() => setStep(2)}
              />
            )}
          </CardContent>
        </Card>

        {/* Suppress unused-variable warning for verifiedEmail */}
        {verifiedEmail && null}
        {activationCode && null}
      </div>
    </div>
  );
}
