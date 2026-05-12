import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  User, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Bell, 
  Smartphone,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      
      <main className="lg:ml-64 p-4 md:p-8 max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
          <p className="text-slate-500">Manage your account preferences and application settings.</p>
        </header>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="card p-8 bg-white dark:bg-dark-lighter">
            <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Profile Information
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {user?.full_name?.charAt(0)}
                </div>
                <button className="text-primary text-sm font-bold hover:underline">Change Avatar</button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.full_name}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-slate-300">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-50 dark:bg-dark/50 dark:text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button className="btn-primary flex items-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="card p-8 bg-white dark:bg-dark-lighter">
            <h2 className="text-xl font-bold dark:text-white mb-6">Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-dark border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">Dark Mode</p>
                    <p className="text-xs text-slate-500">Adjust the appearance of the app.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-dark border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">Default Language</p>
                    <p className="text-xs text-slate-500">Language for transcription & UI.</p>
                  </div>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent font-bold text-primary outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="card p-8 bg-white dark:bg-dark-lighter">
            <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-green-500" /> Security
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark transition-all flex justify-between items-center group">
                <div>
                  <p className="font-bold dark:text-white">Change Password</p>
                  <p className="text-xs text-slate-500">Update your account password.</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-dark flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <Smartphone size={16} />
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
