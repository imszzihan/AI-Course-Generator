import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, Zap, Globe, Cpu } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (topic: string) => void;
  error: string | null;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, error }) => {
  const [topic, setTopic] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fullText = "What do you want to become an expert in?";
    let index = 0;
    
    const startTimeout = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (index < fullText.length) {
          setPlaceholder((prev) => fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 60); // Faster typing speed for longer text

      return () => clearInterval(intervalId);
    }, 500);

    return () => clearTimeout(startTimeout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  const suggestions = [
    { icon: <Cpu size={14} />, text: "Machine Learning" },
    { icon: <Globe size={14} />, text: "Digital Marketing" },
    { icon: <Zap size={14} />, text: "Productivity Systems" },
    { icon: <Sparkles size={14} />, text: "Graphic Design" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-8 w-full max-w-4xl relative">
        
        {/* Floating Decoration Elements */}
        <div className="hidden lg:block absolute -left-12 top-10 animate-float opacity-80">
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-100 transform -rotate-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <Cpu size={24} />
            </div>
            <div className="h-2 w-16 bg-slate-200 rounded-full mb-1"></div>
            <div className="h-2 w-10 bg-slate-200 rounded-full"></div>
          </div>
        </div>
        
        <div className="hidden lg:block absolute -right-12 bottom-20 animate-float opacity-80" style={{ animationDelay: '1s' }}>
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-orange-500/10 border border-slate-100 transform rotate-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2">
              <Zap size={24} />
            </div>
            <div className="h-2 w-16 bg-slate-200 rounded-full mb-1"></div>
            <div className="h-2 w-10 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-xs shadow-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          AI-Powered Curriculum Generator
        </div>
        
        {/* Hero Heading */}
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] animate-fade-in-up delay-100">
          Turn Curiosity into <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">Expertise Instantly.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Type any topic, and our AI will architect a professional course with lessons, quizzes, and a final certificate just for you.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mt-8 relative z-20 animate-fade-in-up delay-300">
          <form onSubmit={handleSubmit} className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500 ${isFocused ? 'opacity-60' : ''}`}></div>
            <div className={`relative flex items-center bg-white rounded-2xl transition-all duration-300 ${isFocused ? 'shadow-2xl translate-y-[-2px]' : 'shadow-xl'}`}>
              <div className="pl-6 text-slate-400">
                <Search size={24} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                className="flex-1 px-5 py-6 text-base sm:text-lg md:text-xl outline-none text-slate-800 placeholder-slate-300 bg-transparent font-medium"
                placeholder={placeholder}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
              />
              <div className="pr-3">
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center gap-2 text-sm font-medium animate-shake">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        {/* Popular Tags */}
        <div className="mt-10 animate-fade-in-up delay-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trending Now</p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setTopic(s.text)}
                className="group relative px-5 py-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {s.icon}
                  {s.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};