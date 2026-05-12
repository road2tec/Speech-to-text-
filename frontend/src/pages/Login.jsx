import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Mic } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Banner */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10 space-y-8 max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl">
              <Mic className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-poppins">VoiceNote AI</span>
          </Link>
          
          <h2 className="text-4xl font-bold leading-tight">Welcome Back to Your Voice Workspace</h2>
          <p className="text-white/80 text-lg">
            Access your notes, analytics, and AI insights from any device. Your voice is your power.
          </p>
          
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">Your data is encrypted and secure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white dark:bg-dark flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold dark:text-white mb-2">Login</h1>
            <p className="text-slate-500">Welcome back! Please enter your details.</p>
          </div>
          
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-lighter dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold dark:text-slate-300">Password</label>
                <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-lighter dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          
          <p className="text-center text-slate-500 text-sm">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
