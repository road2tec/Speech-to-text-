import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Star, Clock, ChevronRight, Search } from 'lucide-react';
import api from '../services/api';

const Favorites = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/notes');
      // Filter only favorites
      const favs = response.data.filter(note => note.is_favorite);
      setNotes(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold font-poppins dark:text-white flex items-center gap-3">
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
              Favorite Notes
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Your most important insights in one place</p>
          </header>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search your favorites..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-white dark:bg-dark-lighter rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotes.map((note) => (
                <Link 
                  key={note._id} 
                  to={`/notes/${note._id}`}
                  className="card p-6 flex flex-col group hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {note.topic || 'General'}
                    </span>
                    <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors dark:text-white font-poppins">
                    {note.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 italic">
                    "{note.summary}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Clock size={14} />
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Read More
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-dark-lighter rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="text-yellow-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white font-poppins">No favorites yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                Mark your notes with a star to see them here for quick access.
              </p>
              <Link to="/notes" className="btn-primary px-8">
                Go to My Notes
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
