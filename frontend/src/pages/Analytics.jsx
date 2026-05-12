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
  Filter
} from 'lucide-react';
import api from '../services/api';
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
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                      <Smile size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Total</span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">AI Insights</h3>
                  <p className="text-2xl font-bold dark:text-white">{stats?.total_notes * 4 || 0}</p>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
