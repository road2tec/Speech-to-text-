import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Zap, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  FileJson,
  ChevronRight,
  Play,
  CheckCircle2,
  Cpu,
  ArrowRight,
  BrainCircuit,
  LayoutDashboard,
  Share2,
  FileText,
  Settings2
} from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const steps = [
    {
      icon: <Mic size={32} />,
      title: "1. Record Your Voice",
      description: "Start recording your thoughts, meetings, or notes directly in your browser. Our system captures high-quality audio in real-time.",
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000"
    },
    {
      icon: <BrainCircuit size={32} />,
      title: "2. AI Processing",
      description: "Our backend pipeline transcribes your audio and runs deep NLP analysis to extract summaries, keywords, and sentiment.",
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
    },
    {
      icon: <LayoutDashboard size={32} />,
      title: "3. Get Smart Insights",
      description: "Instantly view a concise summary, key topics, and action items extracted from your speech in your dashboard.",
      color: "bg-green-500",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-dark/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Mic className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold font-poppins tracking-tight dark:text-white">VoiceNote <span className="text-primary">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium cursor-pointer">Features</a>
            <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium cursor-pointer">How it Works</a>
            <Link to="/login" className="text-slate-900 dark:text-white font-bold">Login</Link>
            <Link to="/register" className="btn-primary">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
                <Zap size={16} />
                <span>Next-Gen AI Transcription</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold font-poppins mb-8 leading-[1.1] dark:text-white">
                Transform Your <span className="gradient-text">Voice</span> Into Smart Insights
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                The ultimate AI-powered note-taking platform that transcribes, summarizes, and extracts key action items from your recordings in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2 px-8 py-4 text-lg">
                  Start Recording Free
                  <ChevronRight size={20} />
                </Link>
                <button className="flex items-center gap-3 px-8 py-4 rounded-xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 transition-all w-full sm:w-auto justify-center dark:text-white shadow-sm">
                  <Play size={20} className="text-primary fill-primary" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="glass p-8 rounded-[2rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-lg text-[10px] text-white font-bold uppercase tracking-widest">ai-processor.v1</div>
                </div>
                <div className="space-y-6">
                  <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded-full w-full"></div>
                  <div className="pt-8">
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="text-sm font-bold text-white">AI Summary</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 bg-white/10 rounded-full w-full"></div>
                        <div className="h-2 bg-white/10 rounded-full w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="wave-container">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.1}s` }}></div>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">Positive (85%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-dark-lighter">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6 dark:text-white">Simple 3-Step Process</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">How VoiceNote AI transforms your audio into organized knowledge.</p>
          </div>

          <div className="space-y-24">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
              >
                <div className="flex-1">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-6 dark:text-white font-poppins">{step.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <img src={step.image} alt={step.title} className="rounded-[2rem] shadow-xl w-full h-64 object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6 dark:text-white">Powerful AI Capabilities</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Integrated state-of-the-art NLP models for deep insights.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: <Mic className="text-primary" />, title: "Whisper Transcription", desc: "OpenAI Whisper models for 99% accuracy." },
              { icon: <MessageSquare className="text-secondary" />, title: "Smart Summaries", desc: "BART-large models for abstractive summary." },
              { icon: <Cpu className="text-orange-500" />, title: "Topic Classification", desc: "Identify core themes automatically." },
              { icon: <BarChart3 className="text-green-500" />, title: "Sentiment Analysis", desc: "Understand the tone of the speaker." },
              { icon: <FileJson className="text-blue-500" />, title: "Key Keywords", desc: "KeyBERT extraction for better search." },
              { icon: <Shield className="text-purple-500" />, title: "Action Items", desc: "Auto-extract todos and deadlines." }
            ].map((f, i) => (
              <motion.div key={i} variants={itemVariants} className="card p-8 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-white dark:bg-dark-lighter rounded-xl flex items-center justify-center mb-6 shadow-sm">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Mic className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold font-poppins dark:text-white">VoiceNote AI</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 VoiceNote AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
