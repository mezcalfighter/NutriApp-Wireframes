import { useState } from 'react';
import { useNavigate } from 'react-router';
import { KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-emerald-900 mb-2">Check Your Email</h1>
              <p className="text-slate-600">
                We've sent password reset instructions to
              </p>
              <p className="text-emerald-600 mt-2">{email}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
              <h3 className="text-emerald-900 mb-2">Next Steps</h3>
              <ul className="text-emerald-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">1.</span>
                  <span>Check your email inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">2.</span>
                  <span>Click the reset link in the email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">3.</span>
                  <span>Create a new password</span>
                </li>
              </ul>
            </div>

            <p className="text-slate-600 text-center mb-6">
              Didn't receive the email? Check your spam folder or
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setSent(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Resend Email
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-emerald-900 mb-2">Reset Password</h1>
            <p className="text-slate-600">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}