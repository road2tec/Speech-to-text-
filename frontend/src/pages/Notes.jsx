import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  MoreVertical, 
  Star, 
  Clock, 
  Tag,
  Trash2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Link } from 'react-router-dom';

const getEmotionDetails = (emotion) => {
  const map = {
    Joy: { emoji: '😄', label: 'Joy', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' },
    Sadness: { emoji: '😢', label: 'Sadness', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' },
    Anger: { emoji: '😠', label: 'Anger', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30' },
    Fear: { emoji: '😨', label: 'Fear', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' },
    Surprise: { emoji: '😮', label: 'Surprise', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' },
    Love: { emoji: '😍', label: 'Love', color: 'bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400 border-pink-100 dark:border-pink-900/30' },
    Neutral: { emoji: '😐', label: 'Neutral', color: 'bg-slate-50 text-slate-700 dark:bg-slate-950/20 dark:text-slate-400 border-slate-100 dark:border-slate-800' }
  };
  return map[emotion] || map.Neutral;
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [filterTopic, setFilterTopic] = useState('All');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id, currentStatus) => {
    try {
      // Optimistic update
      setNotes(notes.map(n => n._id === id ? { ...n, is_favorite: !currentStatus } : n));
      
      await api.put(`/notes/${id}`, {
        is_favorite: !currentStatus
      });
    } catch (err) {
      console.error('Error toggling favorite', err);
      // Revert on error
      fetchNotes();
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error deleting note', err);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || 
                         note.transcript.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = filterTopic === 'All' || note.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const topics = ['All', ...new Set(notes.map(n => n.topic).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      
      <main className="lg:ml-64 p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold dark:text-white font-poppins">My Notes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and explore your voice recordings.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={search}
                onChange={(e) => setSearch(search.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
              />
            </div>
            
            <select 
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white"
            >
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <div className="flex bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 rounded-xl p-1">
              <button 
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white dark:bg-dark-lighter rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className={view === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
          }>
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  view={view} 
                  onToggleFavorite={() => toggleFavorite(note._id, note.is_favorite)}
                  onDelete={() => deleteNote(note._id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-dark-lighter rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-dark rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">No notes found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const NoteCard = ({ note, view, onToggleFavorite, onDelete }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (view === 'list') {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 bg-white dark:bg-dark-lighter rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group"
      >
        <Link to={`/notes/${note._id}`} className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-bold dark:text-white group-hover:text-primary transition-colors">{note.title}</h3>
            <p className="text-xs text-slate-500 truncate max-w-md">{note.summary}</p>
          </div>
        </Link>
        <div className="flex items-center gap-6 px-4">
          <button 
            onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
            className={`transition-colors ${note.is_favorite ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
          >
            <Star size={18} fill={note.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark text-slate-600 dark:text-slate-400">
              {note.topic || 'General'}
            </span>
            {note.emotion && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark text-slate-600 dark:text-slate-400 flex items-center gap-1 shadow-sm">
                {getEmotionDetails(note.emotion).emoji} {getEmotionDetails(note.emotion).label}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={14} /> {formatDate(note.created_at)}
          </div>
          <button onClick={(e) => { e.preventDefault(); onDelete(); }} className="text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card flex flex-col p-6 group h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {note.sentiment === 'Positive' && <div className="w-2 h-2 rounded-full bg-green-500" title="Positive"></div>}
          {note.sentiment === 'Negative' && <div className="w-2 h-2 rounded-full bg-red-500" title="Negative"></div>}
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{note.topic || 'General'}</span>
          {note.emotion && (
            <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-dark border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 flex items-center gap-1" title={`Emotion: ${note.emotion}`}>
              {getEmotionDetails(note.emotion).emoji} {getEmotionDetails(note.emotion).label}
            </span>
          )}
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
          className={`transition-colors ${note.is_favorite ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
        >
          <Star size={18} fill={note.is_favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <Link to={`/notes/${note._id}`} className="flex-1">
        <h3 className="text-lg font-bold dark:text-white group-hover:text-primary transition-colors mb-3 leading-tight">
          {note.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed italic">
          "{note.summary}"
        </p>
      </Link>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Clock size={14} />
          {formatDate(note.created_at)}
        </div>
        
        <div className="flex gap-1">
          {note.keywords?.slice(0, 2).map((kw, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark text-[10px] font-bold text-slate-500 uppercase">
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Notes;
