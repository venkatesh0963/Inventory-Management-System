import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url("/login_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md relative z-10">
        <div className="card p-8 shadow-2xl border-white/20 dark:border-white/10 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white font-bold text-3xl mb-4 shadow-lg shadow-primary-500/30">
              I
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">IMS Pro Login</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your inventory with ease</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Demo Credentials:</p>
            <p>Email: admin@example.com | Pass: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
