import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LayoutDashboard, Info, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mint-gradient text-white font-bold text-3xl h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl hover-lift animate-pulse-gentle">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-700)] to-[var(--accent-700)] bg-clip-text text-transparent mb-2">
            Glitched Technologies
          </h1>
          <p className="text-[var(--neutral-600)] font-medium">Inventory Management System</p>
        </div>

        {/* Login Form */}
        <div className="modal-content rounded-2xl p-8 shadow-2xl cool-shadow">
          <h2 className="text-2xl font-bold text-center text-[var(--neutral-800)] mb-6">
            Welcome Back
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input focus-mint"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input focus-mint pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-2\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <>
                  <LayoutDashboard size={20} className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm flex items-center justify-center mx-auto transition-colors duration-200 hover-lift"
            >
              <Info size={16} className="mr-1" />
              {showCredentials ? 'Hide Demo Credentials' : 'View Demo Credentials'}
            </button>
            
            {showCredentials && (
              <div className="mt-4 p-4 bg-gradient-to-r from-[var(--primary-50)] to-[var(--accent-50)] rounded-xl text-sm animate-slide-in-bottom border border-[var(--primary-200)]">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="font-semibold text-[var(--primary-700)]">Admin:</span>
                    <span className="text-[var(--neutral-700)]">admin@glitched.com / password</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="font-semibold text-[var(--accent-700)]">Manager:</span>
                    <span className="text-[var(--neutral-700)]">manager@glitched.com / password</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="font-semibold text-[var(--neutral-700)]">Staff:</span>
                    <span className="text-[var(--neutral-700)]">staff1@glitched.com / password</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-[var(--neutral-500)]">
          <p>© 2025 Glitched Technologies. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;