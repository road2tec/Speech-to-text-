import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  Mic, 
  Square, 
  Upload, 
  Save, 
  Trash2, 
  Download, 
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Pause,
  FileText,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [title, setTitle] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
    }
  };

  const togglePause = () => {
    if (isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProcess = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    
    try {
      const response = await api.post('/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setTitle(response.data.topic || 'Untitled Note');
    } catch (err) {
      console.error('Processing failed', err);
      alert('Failed to process audio. Please ensure backend is running and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    
    try {
      await api.post('/notes', {
        title: title || 'Untitled Note',
        transcript: result.transcript,
        summary: result.summary,
        keywords: result.keywords,
        sentiment: result.sentiment,
        emotion: result.emotion || 'Neutral',
        tasks: result.tasks,
        topic: result.topic
      });
      navigate('/notes');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save note. Please check your connection.');
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setResult(null);
    setRecordingTime(0);
    setTitle('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold dark:text-white font-poppins">Create New Note</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Record your voice or upload an audio file for AI analysis.</p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <div className="card p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-8 bg-white dark:bg-dark-lighter shadow-xl shadow-primary/5">
              {!audioBlob && !result && (
                <>
                  <div className="relative">
                    <motion.div 
                      animate={isRecording && !isPaused ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-2xl ${
                        isRecording 
                          ? (isPaused ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600') 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <Square size={44} fill="currentColor" /> : <Mic size={44} />}
                    </motion.div>
                    {isRecording && !isPaused && (
                      <div className="absolute -inset-4 border-2 border-red-500/20 rounded-full animate-ping"></div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold dark:text-white">
                      {isRecording ? (isPaused ? 'Recording Paused' : 'Recording...') : 'Ready to Record'}
                    </h2>
                    <p className="text-5xl font-mono font-bold text-slate-800 dark:text-white tracking-tighter">
                      {formatTime(recordingTime)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    {isRecording && (
                      <button 
                        onClick={togglePause}
                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-dark dark:text-white font-bold transition-all"
                      >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                    )}
                    
                    {!isRecording && (
                      <label className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-dark dark:text-white font-bold cursor-pointer transition-all">
                        <Upload size={20} />
                        Upload Audio
                        <input type="file" className="hidden" accept="audio/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setAudioBlob(file);
                        }} />
                      </label>
                    )}
                    
                    {isRecording ? (
                      <button 
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-red-200"
                      >
                        <Square size={20} fill="currentColor" /> Stop
                      </button>
                    ) : (
                      <button 
                        onClick={startRecording}
                        className="btn-primary px-8 py-3 flex items-center gap-2"
                      >
                        <Mic size={20} /> Start Recording
                      </button>
                    )}
                  </div>
                </>
              )}

              {audioBlob && !result && (
                <div className="w-full space-y-8 py-10 animate-in fade-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
                    <CheckCircle size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold dark:text-white">Audio Captured Successfully!</h2>
                    <p className="text-slate-500 dark:text-slate-400 italic">"Ready for AI analysis..."</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button 
                      onClick={resetRecording}
                      className="px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 dark:text-white transition-all flex items-center gap-2 justify-center font-bold"
                    >
                      <Trash2 size={20} /> Discard
                    </button>
                    <button 
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="btn-primary py-3 px-12 flex items-center gap-2 justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> Processing Audio...
                        </>
                      ) : (
                        <>
                          <Cpu size={20} /> Process with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full text-left space-y-8 pt-4"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none py-1 w-full lg:w-2/3 dark:text-white"
                      placeholder="Enter note title..."
                    />
                    <div className="flex gap-2 w-full lg:w-auto">
                      <button className="flex-1 lg:flex-none p-3 rounded-xl bg-slate-100 dark:bg-dark hover:bg-slate-200 text-slate-600 dark:text-slate-400 transition-all flex items-center justify-center">
                        <Copy size={20} />
                      </button>
                      <button onClick={handleSave} className="flex-1 lg:flex-none btn-primary py-3 px-8 flex items-center gap-2 justify-center whitespace-nowrap">
                        <Save size={20} /> Save AI Note
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                          <FileText size={20} className="text-primary" /> Transcript
                        </h3>
                        <div className="p-6 bg-slate-50 dark:bg-dark rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 min-h-[350px] whitespace-pre-wrap leading-relaxed shadow-inner">
                          {result.transcript}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                          <Cpu size={20} className="text-secondary" /> AI Summary
                        </h3>
                        <div className="p-5 bg-secondary/5 border border-secondary/10 rounded-2xl text-sm italic text-slate-600 dark:text-slate-400 leading-relaxed shadow-sm">
                          "{result.summary}"
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-bold dark:text-white">Action Items</h3>
                        <div className="space-y-2">
                          {result.tasks && result.tasks.length > 0 ? result.tasks.map((task, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                              {task}
                            </div>
                          )) : <p className="text-sm text-slate-400 italic px-2">No tasks detected.</p>}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                          <span className="text-sm font-bold dark:text-slate-300">Sentiment</span>
                          <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                            result.sentiment === 'Positive' ? 'bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400' : 
                            result.sentiment === 'Negative' ? 'bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/20 dark:text-yellow-400'
                          }`}>
                            {result.sentiment}
                          </span>
                        </div>
                        
                        <div className="p-5 rounded-2xl bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                          <span className="text-sm font-bold dark:text-slate-300">Emotion</span>
                          {(() => {
                            const emo = getEmotionDetails(result.emotion);
                            return (
                              <span className={`px-4 py-1 rounded-full text-xs font-bold border ${emo.color}`}>
                                {emo.emoji} {emo.label}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Record;
