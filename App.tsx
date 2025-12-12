import React, { useState, useCallback } from 'react';
import { Course } from './types';
import { generateCourseContent, generateCourseTitle } from './services/gemini';
import { DEMO_COURSE } from './services/demoData';
import { InputSection } from './components/InputSection';
import { CourseDashboard } from './components/CourseDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { InfoModal } from './components/InfoModal';
import { GraduationCap, ChevronLeft, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);

  const handleGenerate = useCallback(async (topic: string) => {
    setCurrentTopic(topic);
    setGeneratedTitle(null);
    setIsLoading(true);
    setError(null);
    try {
      if (topic.trim().toLowerCase() === 'demo') {
        // Mock the title generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGeneratedTitle("Modern Full Stack Development with Next.js");
        // Mock the content generation delay - longer to show animation
        await new Promise(resolve => setTimeout(resolve, 3500));
        setCourse(DEMO_COURSE);
      } else {
        // OPTIMIZATION: Fire both requests in parallel to save time.
        // We don't wait for the title to start generating the massive course content.
        
        // 1. Start generating the full content immediately (heaviest task)
        const contentPromise = generateCourseContent(topic);
        
        // 2. Start generating title purely for UI feedback (LoadingScreen)
        // We catch errors here so it doesn't fail the main process if title gen hiccups
        generateCourseTitle(topic)
          .then(title => setGeneratedTitle(title))
          .catch(() => { /* If title gen fails, we just don't show it in loading screen */ });

        // 3. Wait for the content to finish
        const generatedCourse = await contentPromise;
        setCourse(generatedCourse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setCourse(null);
    setError(null);
    setCurrentTopic('');
    setGeneratedTitle(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract Background Shapes */}
      {!course && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accentGlow rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cta rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </>
      )}

      {/* Info Modal */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Header / Nav */}
      <header className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 glass transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-white/50">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={handleReset}
        >
          <div className="bg-gradient-to-br from-primary to-slate-900 p-2.5 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 transform group-hover:scale-105">
            <GraduationCap size={24} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            CoreLearn<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600"> Academy</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!course && !isLoading && (
            <button 
              onClick={() => setShowInfo(true)}
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <HelpCircle size={18} />
              <span>How it works</span>
            </button>
          )}

          {course && (
            <button 
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-2 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              New Topic
            </button>
          )}

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          
          {/* User Profile Mock */}
          <div className="flex items-center gap-2 pl-2 sm:pl-0">
             <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 border border-white shadow-sm flex items-center justify-center text-slate-700 font-bold text-xs hover:scale-105 transition-transform" title="User Profile">
               JD
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full h-full relative z-10">
        {isLoading ? (
          <LoadingScreen topic={currentTopic} generatedTitle={generatedTitle} />
        ) : course ? (
          <CourseDashboard course={course} />
        ) : (
          <InputSection onGenerate={handleGenerate} error={error} />
        )}
      </main>
    </div>
  );
};

export default App;