import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  Mic, 
  FileText, 
  Star, 
  Clock, 
  TrendingUp, 
  Plus,
  ChevronRight,
  Calendar,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalNotes: 0,
    favorites: 0,
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all notes to calculate stats
      const notesRes = await api.get('/notes');
      const allNotes = notesRes.data;
      
      // Fetch analytics for more detailed stats
      const analyticsRes = await api.get('/notes/analytics');
      const analyticsData = analyticsRes.data;

      setStats({
        totalNotes: allNotes.length,
        favorites: allNotes.filter(n => n.is_favorite).length,
        recentNotes: allNotes.slice(0, 4), // Get last 4 notes
        topTopic: analyticsData.topic_distribution ? 
          Object.keys(analyticsData.topic_distribution).reduce((a, b) => analyticsData.topic_distribution[a] > analyticsData.topic_distribution[b] ? a : b, 'None')
          : 'None'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-poppins dark:text-white">
                Welcome back, <span className="text-primary">{user?.full_name?.split(' ')[0]}!</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Here's what's happening with your voice notes today.</p>
            </div>
            <Link to="/record" className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-primary/25">
              <Plus size={20} />
              Create New Note
            </Link>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white dark:bg-dark-lighter rounded-3xl"></div>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 bg-white dark:bg-dark-lighter">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Total Notes</h3>
                  <p className="text-3xl font-bold dark:text-white mt-1">{stats.totalNotes}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 bg-white dark:bg-dark-lighter">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-4">
                    <Star size={24} />
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Favorites</h3>
                  <p className="text-3xl font-bold dark:text-white mt-1">{stats.favorites}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 bg-white dark:bg-dark-lighter">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Top Topic</h3>
                  <p className="text-xl font-bold dark:text-white mt-2 truncate">{stats.topTopic}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 bg-white dark:bg-dark-lighter">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">AI Insights</h3>
                  <p className="text-3xl font-bold dark:text-white mt-1">{stats.totalNotes * 4}</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Notes */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                      <Clock size={20} className="text-primary" />
                      Recent Notes
                    </h2>
                    <Link to="/notes" className="text-primary text-sm font-bold hover:underline">View All</Link>
                  </div>

                  <div className="space-y-4">
                    {stats.recentNotes.length > 0 ? stats.recentNotes.map((note) => (
                      <Link key={note.id} to={`/notes/${note.id}`} className="flex items-center gap-4 p-4 bg-white dark:bg-dark-lighter border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-dark rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <Mic size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-bold dark:text-white truncate">{note.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{new Date(note.created_at).toLocaleDateString()} • {note.topic}</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )) : (
                      <div className="text-center py-12 bg-white dark:bg-dark-lighter rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500">No notes found. Start by recording one!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-secondary" />
                    Activity
                  </h2>
                  <div className="card p-6 bg-gradient-to-br from-primary to-secondary text-white border-none shadow-xl shadow-primary/20">
                    <h3 className="font-bold mb-2">Upgrade to Pro</h3>
                    <p className="text-white/80 text-xs mb-4 leading-relaxed">Get unlimited AI transcriptions, longer recordings, and advanced analytics.</p>
                    <button className="w-full py-2 bg-white text-primary rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                  
                  <div className="card p-6 bg-white dark:bg-dark-lighter">
                    <h4 className="font-bold mb-4 dark:text-white text-sm">Productivity Tip</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed italic">
                      "Recording your thoughts immediately after a meeting increases retention by 40%. Use VoiceNote AI to capture those gems."
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
