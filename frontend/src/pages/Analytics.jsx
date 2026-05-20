import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  BarChart, 
  TrendingUp, 
  Clock, 
  Smile, 
  Meh, 
  Frown,
  Calendar,
  Filter,
  Heart
} from 'lucide-react';
import api from '../services/api';

const getEmotionDetails = (emotion) => {
  const map = {
    Joy: { emoji: '😄', label: 'Joy', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30', chartBg: 'rgba(16, 185, 129, 0.6)', chartBorder: 'rgb(16, 185, 129)' },
    Sadness: { emoji: '😢', label: 'Sadness', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30', chartBg: 'rgba(59, 130, 246, 0.6)', chartBorder: 'rgb(59, 130, 246)' },
    Anger: { emoji: '😠', label: 'Anger', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30', chartBg: 'rgba(244, 63, 94, 0.6)', chartBorder: 'rgb(244, 63, 94)' },
    Fear: { emoji: '😨', label: 'Fear', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30', chartBg: 'rgba(168, 85, 247, 0.6)', chartBorder: 'rgb(168, 85, 247)' },
    Surprise: { emoji: '😮', label: 'Surprise', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30', chartBg: 'rgba(245, 158, 11, 0.6)', chartBorder: 'rgb(245, 158, 11)' },
    Love: { emoji: '😍', label: 'Love', color: 'bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400 border-pink-100 dark:border-pink-900/30', chartBg: 'rgba(236, 72, 153, 0.6)', chartBorder: 'rgb(236, 72, 153)' },
    Neutral: { emoji: '😐', label: 'Neutral', color: 'bg-slate-50 text-slate-700 dark:bg-slate-950/20 dark:text-slate-400 border-slate-100 dark:border-slate-800', chartBg: 'rgba(100, 116, 139, 0.6)', chartBorder: 'rgb(100, 116, 139)' }
  };
  return map[emotion] || map.Neutral;
};
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/notes/analytics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          stats?.sentiment_distribution?.Positive || 0,
          stats?.sentiment_distribution?.Neutral || 0,
          stats?.sentiment_distribution?.Negative || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topicData = {
    labels: stats?.topic_distribution ? Object.keys(stats.topic_distribution) : [],
    datasets: [
      {
        label: 'Notes per Topic',
        data: stats?.topic_distribution ? Object.values(stats.topic_distribution) : [],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const emotionData = {
    labels: stats?.emotion_distribution ? Object.keys(stats.emotion_distribution) : [],
    datasets: [
      {
        data: stats?.emotion_distribution ? Object.values(stats.emotion_distribution) : [],
        backgroundColor: stats?.emotion_distribution 
          ? Object.keys(stats.emotion_distribution).map(emo => getEmotionDetails(emo).chartBg)
          : [],
        borderColor: stats?.emotion_distribution 
          ? Object.keys(stats.emotion_distribution).map(emo => getEmotionDetails(emo).chartBorder)
          : [],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-poppins dark:text-white">Analytics Insights</h1>
              <p className="text-slate-500 dark:text-slate-400">Deep dive into your voice notes data</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                <Calendar size={18} />
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <BarChart size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-500">+12%</span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Total Notes</h3>
                  <p className="text-2xl font-bold dark:text-white">{stats?.total_notes || 0}</p>
                </div>
                
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                      <TrendingUp size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-500">Positive</span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Top Sentiment</h3>
                  <p className="text-2xl font-bold dark:text-white">
                    {stats?.sentiment_distribution ? 
                      Object.keys(stats.sentiment_distribution).reduce((a, b) => stats.sentiment_distribution[a] > stats.sentiment_distribution[b] ? a : b)
                      : 'N/A'
                    }
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                      <Clock size={24} />
                    </div>
                    <span className="text-xs font-bold text-blue-500">Avg</span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Avg Duration</h3>
                  <p className="text-2xl font-bold dark:text-white">42s</p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500">
                      <Heart size={24} />
                    </div>
                    <span className="text-xs font-bold text-pink-500">Dominant</span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Dominant Emotion</h3>
                  <p className="text-2xl font-bold dark:text-white">
                    {stats?.emotion_distribution && Object.keys(stats.emotion_distribution).length > 0 ? 
                      (() => {
                        const top = Object.keys(stats.emotion_distribution).reduce((a, b) => stats.emotion_distribution[a] > stats.emotion_distribution[b] ? a : b);
                        const details = getEmotionDetails(top);
                        return `${details.emoji} ${details.label}`;
                      })()
                      : 'Neutral'
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-lg font-bold mb-6 dark:text-white">Sentiment Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Pie data={sentimentData} options={{ maintainAspectRatio: false }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                        <Smile size={16} />
                        <span className="text-xs font-bold">{stats?.sentiment_distribution?.Positive || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase">Positive</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <Meh size={16} />
                        <span className="text-xs font-bold">{stats?.sentiment_distribution?.Neutral || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase">Neutral</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                        <Frown size={16} />
                        <span className="text-xs font-bold">{stats?.sentiment_distribution?.Negative || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase">Negative</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-bold mb-6 dark:text-white">Top Topics</h3>
                  <div className="h-64">
                    <Bar 
                      data={topicData} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                      }} 
                    />
                  </div>
                </div>
              </div>

              <div className="card p-6 mt-8">
                <h3 className="text-lg font-bold mb-6 dark:text-white">Emotion Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="h-64 lg:col-span-1 flex items-center justify-center">
                    {stats?.emotion_distribution && Object.keys(stats.emotion_distribution).length > 0 ? (
                      <Pie data={emotionData} options={{ maintainAspectRatio: false }} />
                    ) : (
                      <p className="text-sm text-slate-400 italic">No emotion data available.</p>
                    )}
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {stats?.emotion_distribution && Object.keys(stats.emotion_distribution).length > 0 ? (
                      Object.entries(stats.emotion_distribution).map(([emotion, count]) => {
                        const details = getEmotionDetails(emotion);
                        return (
                          <div key={emotion} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-dark/40 flex flex-col items-center text-center shadow-sm hover:scale-[1.02] transition-transform duration-200">
                            <span className="text-2xl mb-1">{details.emoji}</span>
                            <span className="text-sm font-bold dark:text-white">{details.label}</span>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">{count} {count === 1 ? 'note' : 'notes'}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400 italic col-span-full text-center">No categories to display.</p>
                    )}
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

export default Analytics;
