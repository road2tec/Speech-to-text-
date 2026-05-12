import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Shield, 
  FileJson, 
  Cpu, 
  Globe, 
  Lock,
  Cloud,
  Layers,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: <Mic className="text-blue-500" size={40} />,
      title: "Whisper Transcription",
      description: "State-of-the-art speech-to-text conversion using OpenAI's Whisper models. Supports over 50+ languages with punctuation and formatting.",
      color: "bg-blue-500/10"
    },
    {
      icon: <MessageSquare className="text-purple-500" size={40} />,
      title: "AI Summarization",
      description: "Don't read pages of text. Our BART-large-CNN models extract the core message into concise, readable summaries automatically.",
      color: "bg-purple-500/10"
    },
    {
      icon: <BarChart3 className="text-green-500" size={40} />,
      title: "Sentiment Analysis",
      description: "Understand the emotional tone behind every recording. We analyze polarity to tell if the discussion was positive, negative, or neutral.",
      color: "bg-green-500/10"
    },
    {
      icon: <FileJson className="text-orange-500" size={40} />,
      title: "Action Item Extraction",
      description: "Our NLP pipeline automatically identifies tasks, deadlines, and reminders mentioned in your speech so you never forget a todo.",
      color: "bg-orange-500/10"
    },
    {
      icon: <Cpu className="text-red-500" size={40} />,
      title: "KeyBERT Keywords",
      description: "Extract the most relevant keywords and phrases from your recordings using KeyBERT, making your notes easily searchable.",
      color: "bg-red-500/10"
    },
    {
      icon: <Globe className="text-indigo-500" size={40} />,
      title: "Multi-language Support",
      description: "Record in your native language. Our AI handles various accents and languages with high precision and contextual understanding.",
      color: "bg-indigo-500/10"
    }
  ];

  const secondaryFeatures = [
    { icon: <Lock size={20} />, title: "Secure Data", desc: "Enterprise-grade encryption for all files." },
    { icon: <Cloud size={20} />, title: "Cloud Sync", desc: "Access your notes from any device anywhere." },
    { icon: <Smartphone size={20} />, title: "Mobile Ready", desc: "Record on the go with our responsive UI." },
    { icon: <Layers size={20} />, title: "Topic Tags", desc: "Auto-categorize notes by topic classification." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark">
      {/* Header */}
      <div className="bg-white dark:bg-dark-lighter py-20 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-extrabold font-poppins mb-6 dark:text-white"
          >
            Powerful <span className="gradient-text">AI Features</span>
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Built with state-of-the-art machine learning models to provide deep insights from your voice.
          </p>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="card p-10 group"
            >
              <div className={`w-20 h-20 ${f.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Secondary Features Section */}
      <div className="bg-primary/5 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {secondaryFeatures.map((f, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-primary mb-4">{f.icon}</div>
                <h4 className="font-bold mb-2 dark:text-white">{f.title}</h4>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 dark:text-white font-poppins">Ready to experience these features?</h2>
        <Link to="/register" className="btn-primary px-10 py-4 text-lg">
          Start Your Free Trial
        </Link>
      </div>
    </div>
  );
};

export default Features;
