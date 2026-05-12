import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Share2, 
  Download, 
  Play, 
  FileText, 
  Cpu, 
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error('Error fetching note', err);
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  const toggleFavorite = async () => {
    try {
      const newStatus = !note.is_favorite;
      setNote({ ...note, is_favorite: newStatus });
      await api.put(`/notes/${id}`, { is_favorite: newStatus });
    } catch (err) {
      console.error('Error toggling favorite', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        navigate('/notes');
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      <div className="lg:ml-64 p-8 flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      
      <main className="lg:ml-64 p-4 md:p-8 max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/notes" className="p-2 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold dark:text-white font-poppins">{note.title}</h1>
                <button 
                  onClick={toggleFavorite}
                  className={`transition-colors ${note.is_favorite ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
                >
                  <Star size={24} fill={note.is_favorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(note.created_at).toLocaleString()}</span>
                <span>•</span>
                <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary uppercase text-[10px] font-bold tracking-wider">{note.topic || 'General'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none p-2.5 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 flex items-center justify-center gap-2 font-bold">
              <Edit3 size={18} /> Edit
            </button>
            <button className="flex-1 md:flex-none p-2.5 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 flex items-center justify-center gap-2 font-bold">
              <Share2 size={18} /> Share
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 md:flex-none p-2.5 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 font-bold"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-white dark:bg-dark-lighter rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-xl shadow-primary/5">
              <button className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all shrink-0">
                <Play size={24} fill="currentColor" />
              </button>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-full bg-slate-100 dark:bg-dark rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-primary to-secondary"></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>0:45</span>
                  <span>2:15</span>
                </div>
              </div>
              <button className="p-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
                <Download size={22} />
              </button>
            </div>

            <div className="card p-8 bg-white dark:bg-dark-lighter shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h3 className="text-xl font-bold flex items-center gap-3 dark:text-white mb-6 font-poppins">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={18} />
                </div>
                Full Transcript
              </h3>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                {note.transcript}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card p-6 bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20 shadow-lg shadow-secondary/5">
              <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white mb-4 text-secondary font-poppins">
                <Cpu size={18} /> AI Summary
              </h3>
              <p className="text-slate-600 dark:text-slate-400 italic text-sm leading-relaxed">
                "{note.summary}"
              </p>
            </div>

            <div className="card p-6 shadow-md">
              <h3 className="text-lg font-bold dark:text-white mb-4 font-poppins">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {note.keywords && note.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-dark text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6 shadow-md">
              <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2 font-poppins">
                <CheckCircle size={18} className="text-green-500" /> Detected Tasks
              </h3>
              <ul className="space-y-3">
                {note.tasks && note.tasks.length > 0 ? note.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-dark/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                    {task}
                  </li>
                )) : <p className="text-sm text-slate-400 italic text-center py-4">No tasks extracted.</p>}
              </ul>
            </div>

            <div className="card p-6 flex justify-between items-center shadow-md">
              <span className="font-bold dark:text-white text-sm">Sentiment</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  note.sentiment === 'Positive' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                  note.sentiment === 'Negative' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-yellow-500'
                }`}></div>
                <span className="font-bold text-xs dark:text-slate-300">{note.sentiment}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteDetails;
