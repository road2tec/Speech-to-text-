import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Settings2, 
  LayoutDashboard, 
  ArrowRight,
  PlayCircle,
  FileText,
  BrainCircuit,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
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
      description: "Our backend pipeline, powered by Whisper and Transformers, transcribes your audio and runs deep NLP analysis to extract insights.",
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
    },
    {
      icon: <LayoutDashboard size={32} />,
      title: "3. Get Smart Insights",
      description: "Instantly view a concise summary, key topics, sentiment analysis, and a list of action items extracted from your speech.",
      color: "bg-green-500",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 dark:bg-dark-lighter -z-10 skew-y-3 origin-top-left scale-110"></div>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold font-poppins mb-6 dark:text-white">
              How <span className="text-primary">VoiceNote AI</span> Works
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-10">
              A simple 3-step process to transform your voice into organized, actionable knowledge.
            </p>
            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">
                <PlayCircle size={20} />
                Watch Video Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="space-y-32">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
            >
              <div className="flex-1">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {step.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white font-poppins">{step.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  {step.description}
                </p>
                <ul className="space-y-4">
                  {[1, 2].map((_, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                      <ArrowRight size={18} className="text-primary" />
                      {idx === 0 ? "Automated workflow" : "Real-time results"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-slate-100 dark:border-slate-800">
                  <img src={step.image} alt={step.title} className="w-full h-auto object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simple Flow Summary */}
      <div className="bg-slate-50 dark:bg-dark-lighter py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16 dark:text-white font-poppins">Everything happens in the background</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white dark:bg-dark rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
                <FileText size={24} />
              </div>
              <h4 className="font-bold dark:text-white">Transcription</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Whisper ASR converts audio to accurate text.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white dark:bg-dark rounded-full flex items-center justify-center mx-auto shadow-sm text-secondary">
                <Settings2 size={24} />
              </div>
              <h4 className="font-bold dark:text-white">NLP Analysis</h4>
              <p className="text-sm text-slate-500 leading-relaxed">BART & KeyBERT analyze structure and meaning.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white dark:bg-dark rounded-full flex items-center justify-center mx-auto shadow-sm text-green-500">
                <Share2 size={24} />
              </div>
              <h4 className="font-bold dark:text-white">Dashboard</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Results delivered to your personal dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-poppins">Ready to see it in action?</h2>
          <p className="text-white/80 mb-10 text-lg">Join thousands of users who are already saving time with VoiceNote AI.</p>
          <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all inline-block shadow-lg">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
