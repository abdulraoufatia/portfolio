import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, QrCode } from 'lucide-react';
import { auth } from '../lib/auth';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setRequires2FA(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const response = await signIn(email, password, requires2FA ? totpCode : undefined);
      
      if (response.requires2FA) {
        setRequires2FA(true);
        setIsSubmitting(false);
        return;
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  const verify2FA = async () => {
    try {
      await auth.verify2FA(totpCode);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid 2FA code');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
          Admin Login
        </h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4 flex items-start">
            <AlertCircle className="shrink-0 mr-2 mt-0.5" size={20} />
            <span>{error}</span>
          </div>
        )}

        {requires2FA ? (
          <div>
            <p className="mb-4 text-center">Enter the code from your authenticator app</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">2FA Code</label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <button
              onClick={verify2FA}
              disabled={isSubmitting || totpCode.length !== 6}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  maxLength={255}
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={8}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default Auth;