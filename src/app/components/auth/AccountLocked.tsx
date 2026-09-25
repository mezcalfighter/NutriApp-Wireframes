import { useNavigate } from 'react-router';
import { ShieldAlert, Clock } from 'lucide-react';

export default function AccountLocked() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-red-900 mb-2">Account Temporarily Locked</h1>
            <p className="text-slate-600">
              Your account has been locked due to multiple failed login attempts
            </p>
          </div>

          {/* Lockout Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 mb-1">Locked for 30 minutes</p>
                <p className="text-red-700">
                  Please wait before attempting to log in again
                </p>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-red-800">Time remaining</p>
              <p className="text-red-900 mt-1">29:45</p>
            </div>
          </div>

          {/* Security Info */}
          <div className="space-y-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-slate-900 mb-2">Security Notice</h3>
              <p className="text-slate-600">
                After 5 failed login attempts, your account is automatically locked for 30 minutes to protect your security.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-slate-900 mb-2">What you can do:</h3>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>Wait 30 minutes and try again</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>Reset your password if you've forgotten it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>Contact support if you need immediate assistance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/password-reset')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Reset Password
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>

          {/* Support */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600 mb-2">Need help?</p>
            <button className="text-emerald-600 hover:text-emerald-700">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}