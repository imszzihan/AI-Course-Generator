import React, { useState, useEffect } from 'react';
import { Course, Lesson, Module } from '../types';
import { BookOpen, CheckCircle, Clock, ChevronRight, PlayCircle, Trophy, Award, Menu, X, AlertCircle, RefreshCw, HelpCircle, Lock, Layout, Star, AlertTriangle, ArrowLeft, Globe, ExternalLink, Video, Book, Wrench, FileText } from 'lucide-react';
import { SimpleMarkdown } from './SimpleMarkdown';
import { Certificate } from './Certificate';
import { AiTutor } from './AiTutor';

interface CourseDashboardProps {
  course: Course;
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({ course }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'content' | 'quiz'>('content');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showFinalExam, setShowFinalExam] = useState(false);
  
  // Progression State
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Lesson Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizRetryCount, setQuizRetryCount] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  // Exam State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Certificate State
  const [learnerName, setLearnerName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  const activeModule = course.modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  // Helper to generate unique ID for lessons
  const getLessonId = (m: number, l: number) => `${m}-${l}`;

  // Reset quiz state when changing lessons
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizRetryCount(0);
    
    const isCompleted = completedLessons.has(getLessonId(activeModuleIndex, activeLessonIndex));
    setQuizPassed(isCompleted);
  }, [activeLessonIndex, activeModuleIndex, completedLessons]);

  const handleLessonSelect = (mIndex: number, lIndex: number) => {
    setActiveModuleIndex(mIndex);
    setActiveLessonIndex(lIndex);
    setViewMode('content');
    setShowFinalExam(false);
    setShowMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExamSelect = () => {
    setShowFinalExam(true);
    setShowMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextLesson = () => {
    if (!activeLesson?.quiz || activeLesson.quiz.length === 0) {
        setCompletedLessons(prev => {
            const newSet = new Set(prev);
            newSet.add(getLessonId(activeModuleIndex, activeLessonIndex));
            return newSet;
        });
    }

    if(activeLessonIndex < activeModule!.lessons.length - 1) {
       handleLessonSelect(activeModuleIndex, activeLessonIndex + 1);
    } else if (activeModuleIndex < course.modules.length - 1) {
       handleLessonSelect(activeModuleIndex + 1, 0);
    } else {
       handleExamSelect();
    }
  };

  const handleStartQuiz = () => {
    setViewMode('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToContent = () => {
    setViewMode('content');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLessonLocked = (mIndex: number, lIndex: number) => {
    if (mIndex === 0 && lIndex === 0) return false; 
    let prevM = mIndex;
    let prevL = lIndex - 1;
    if (prevL < 0) {
        prevM = mIndex - 1;
        if (prevM < 0) return false; 
        prevL = course.modules[prevM].lessons.length - 1;
    }
    return !completedLessons.has(getLessonId(prevM, prevL));
  };

  const lastModuleIdx = course.modules.length - 1;
  const lastLessonIdx = course.modules[lastModuleIdx].lessons.length - 1;
  const isExamLocked = !completedLessons.has(getLessonId(lastModuleIdx, lastLessonIdx));

  // Quiz & Exam Handlers
  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted && quizPassed) return; 
    if (quizSubmitted && quizRetryCount >= 1 && quizPassed) return; 
    if (quizSubmitted && !quizPassed) {
       return; 
    }
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const submitLessonQuiz = () => {
    if (!activeLesson?.quiz) return;
    const isCorrect = activeLesson.quiz.every((q, i) => quizAnswers[i] === q.correctAnswerIndex);
    if (isCorrect) {
      setQuizPassed(true);
      setQuizSubmitted(true);
      setCompletedLessons(prev => {
        const newSet = new Set(prev);
        newSet.add(getLessonId(activeModuleIndex, activeLessonIndex));
        return newSet;
      });
    } else {
      setQuizSubmitted(true);
    }
  };

  const retryLessonQuiz = () => {
    setQuizRetryCount(prev => prev + 1);
    setQuizSubmitted(false);
    setQuizAnswers({});
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitExam = () => {
    let correctCount = 0;
    course.finalExam.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setExamSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retryExam = () => {
    setExamSubmitted(false);
    setUserAnswers({});
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateCertificate = () => {
    if (learnerName.trim()) {
      setShowCertificate(true);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} />;
      case 'book': return <Book size={20} />;
      case 'tool': return <Wrench size={20} />;
      case 'article':
      default: return <FileText size={20} />;
    }
  };

  const totalQuestions = course.finalExam.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 80;

  // Calculate Progress
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Determine if AI access should be restricted
  const isTestingMode = showFinalExam || viewMode === 'quiz';
  // Determine if navigation is locked (during active exam)
  const isTakingExam = showFinalExam && !examSubmitted;

  return (
    <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden relative">
      
      {/* Certificate Overlay */}
      {showCertificate && (
        <Certificate 
          course={course}
          learnerName={learnerName}
          score={percentage}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* AI Tutor Chat Widget */}
      <AiTutor 
         lessonTitle={activeLesson?.title || course.title} 
         lessonContent={activeLesson?.content || course.description} 
         isQuizMode={isTestingMode}
      />

      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-20 z-40 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform print:hidden"
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
      >
        {showMobileSidebar ? <X /> : <Menu />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-white/50 backdrop-blur-xl border-r border-white/60 flex flex-col transition-transform duration-300 ease-in-out shadow-sm print:hidden
        ${showMobileSidebar ? 'translate-x-0 bg-white' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">{course.difficulty}</span>
             <span className="text-xs text-slate-400 font-medium">{course.estimatedTotalDuration}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight font-heading">{course.title}</h2>
          
          {/* Progress Bar */}
          <div className="mt-6 mb-2">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>Course Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-accent transition-all duration-1000 ease-out rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
          {course.modules.map((module, mIndex) => (
            <div key={mIndex} className="mb-6">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 px-3 flex items-center gap-2 transition-opacity ${isTakingExam ? 'text-slate-300' : 'text-slate-400'}`}>
                 <Layout size={12} />
                 Module {mIndex + 1}
              </h3>
              <div className="space-y-1">
                {module.lessons.map((lesson, lIndex) => {
                  const isActive = !showFinalExam && activeModuleIndex === mIndex && activeLessonIndex === lIndex;
                  const locked = isLessonLocked(mIndex, lIndex);
                  const completed = completedLessons.has(getLessonId(mIndex, lIndex));
                  const disabled = isTakingExam;

                  return (
                    <button
                      key={lIndex}
                      onClick={() => !disabled && handleLessonSelect(mIndex, lIndex)}
                      disabled={disabled}
                      className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex items-start gap-3 group relative overflow-hidden
                        ${isActive 
                          ? 'bg-white shadow-md border border-slate-100 text-slate-900 font-semibold' 
                          : disabled
                            ? 'text-slate-400 cursor-not-allowed opacity-50 grayscale'
                            : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                        }`}
                    >
                      {isActive && !disabled && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>}
                      
                      <span className={`mt-0.5 shrink-0 transition-colors duration-300 ${isActive && !disabled ? 'text-accent' : 'text-slate-300'}`}>
                        {disabled ? (
                           <Lock size={16} />
                        ) : completed ? (
                           <CheckCircle size={16} className="text-green-500" />
                        ) : locked ? (
                           <Lock size={16} />
                        ) : isActive ? (
                           <PlayCircle size={16} />
                        ) : (
                           <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                        )}
                      </span>
                      <span className="flex-1 leading-snug">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <button
              onClick={!isTakingExam ? handleExamSelect : undefined}
              disabled={isTakingExam && !examSubmitted}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group relative overflow-hidden
                ${showFinalExam
                  ? 'border-orange-200 bg-orange-50 text-orange-900 shadow-md'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:shadow-lg'
                }
                ${isTakingExam ? 'cursor-default' : ''}
              `}
            >
              <div className={`p-2.5 rounded-xl ${showFinalExam ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors'}`}>
                {isExamLocked && !showFinalExam ? <Lock size={20} /> : <Trophy size={20} />}
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Final Certification</div>
                <div className="text-xs opacity-75 mt-0.5 font-medium">
                  {examSubmitted ? (passed ? 'Passed' : 'Failed') : (isTakingExam ? 'In Progress...' : 'Start Exam')}
                </div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth relative print:hidden" id="main-content">
        <div className="max-w-4xl mx-auto pb-12">
          
          {/* Main Card Container */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 min-h-[80vh] relative mb-6">
            
            {showFinalExam ? (
              <div className="animate-fade-in space-y-10">
                <div className="text-center space-y-4 pb-8 border-b border-slate-100">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-bold uppercase tracking-wider mb-2">
                    <Award size={16} />
                    Final Assessment
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-heading">{course.finalExam.title}</h1>
                  <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Complete this exam to prove your mastery of <span className="font-semibold text-slate-900">{course.title}</span> and earn your certificate.
                  </p>
                </div>

                {examSubmitted ? (
                  <div className={`rounded-3xl p-10 border text-center relative overflow-hidden ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-100'}`}>
                    <div className="relative z-10">
                      {passed ? (
                        <div className="space-y-6">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/10 text-green-500 mb-6">
                            <Trophy size={48} />
                          </div>
                          <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-2 font-heading">Certified!</h2>
                            <p className="text-green-700 text-xl font-medium">You scored {percentage}%</p>
                          </div>
                          
                          <div className="max-w-md mx-auto mt-8 pt-8 border-t border-green-200">
                            <p className="text-slate-600 mb-3 text-sm font-medium">Enter your name for the certificate:</p>
                            <input 
                              type="text" 
                              value={learnerName}
                              onChange={(e) => setLearnerName(e.target.value)}
                              placeholder="Your Full Name"
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none mb-4 text-center font-bold text-slate-800"
                            />
                            <button 
                              onClick={handleGenerateCertificate}
                              disabled={!learnerName.trim()}
                              className="w-full bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              Claim Your Certificate
                            </button>
                            <div className="mt-4">
                                <button 
                                    onClick={() => handleLessonSelect(0,0)}
                                    className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
                                >
                                    Return to Course Content
                                </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-500/10 text-red-500 mb-6">
                            <RefreshCw size={48} />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-heading">Keep Learning</h2>
                            <p className="text-red-600 text-lg">You scored {percentage}%. You need 80% to pass.</p>
                          </div>
                          <div className="flex flex-col gap-3 justify-center">
                            <button 
                                onClick={retryExam}
                                className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Retake Exam
                            </button>
                            <button 
                                onClick={() => handleLessonSelect(0,0)}
                                className="text-slate-600 hover:text-slate-900 font-medium py-2"
                            >
                                Review Course Content
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {course.finalExam.questions.map((q, index) => (
                      <div key={q.id} className="space-y-6">
                         <div className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm">{index + 1}</span>
                            <h3 className="text-xl font-semibold text-slate-800 pt-0.5">{q.text}</h3>
                         </div>
                         <div className="grid sm:grid-cols-2 gap-4 pl-12">
                            {q.options.map((option, optIndex) => (
                              <label 
                                key={optIndex} 
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md
                                  ${userAnswers[q.id] === optIndex 
                                    ? 'border-accent bg-blue-50/50 shadow-md ring-1 ring-accent' 
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                                  ${userAnswers[q.id] === optIndex ? 'border-accent bg-accent' : 'border-slate-300 bg-white'}`}>
                                  {userAnswers[q.id] === optIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <input 
                                  type="radio" 
                                  name={`q-${q.id}`} 
                                  className="hidden"
                                  checked={userAnswers[q.id] === optIndex}
                                  onChange={() => handleAnswerSelect(q.id, optIndex)}
                                />
                                <span className={`text-base ${userAnswers[q.id] === optIndex ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                  {option}
                                </span>
                              </label>
                            ))}
                         </div>
                      </div>
                    ))}
                    <div className="pt-8 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={submitExam}
                        disabled={Object.keys(userAnswers).length < totalQuestions}
                        className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
                      >
                        Submit Final Exam
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : viewMode === 'quiz' && activeLesson?.quiz ? (
                /* QUIZ PAGE VIEW */
                <div className="animate-fade-in">
                    <div className="mb-8">
                        <button 
                            onClick={handleBackToContent}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors mb-6 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Lesson Content
                        </button>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-cta shadow-sm">
                                <HelpCircle size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Knowledge Check</h1>
                                <p className="text-slate-500">Test your understanding of {activeLesson.title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 space-y-10">
                            {/* Result Banners */}
                            {quizSubmitted && !quizPassed && (
                                <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${quizRetryCount === 0 ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <AlertCircle size={20} />
                                    {quizRetryCount === 0 
                                    ? "Not quite. Check the feedback below and try again." 
                                    : "Review the correct answers below to continue."}
                                </div>
                            )}

                            {/* Questions */}
                            {activeLesson.quiz.map((q, qIdx) => {
                                const userAnswer = quizAnswers[qIdx];
                                
                                return (
                                    <div key={qIdx} className="space-y-4">
                                        <p className="text-lg font-medium text-slate-800">{qIdx + 1}. {q.question}</p>
                                        <div className="grid gap-2">
                                            {q.options.map((opt, optIndex) => {
                                                let optionClass = "border-slate-200 bg-white hover:border-slate-300";
                                                let iconClass = "border-slate-300 bg-white";
                                                
                                                if (quizSubmitted) {
                                                    if (optIndex === q.correctAnswerIndex) {
                                                        optionClass = "border-green-500 bg-green-50 text-green-900";
                                                        iconClass = "border-green-500 bg-green-500 text-white";
                                                    } else if (userAnswer === optIndex) {
                                                        optionClass = "border-red-500 bg-red-50 text-red-900";
                                                        iconClass = "border-red-500 bg-red-500 text-white";
                                                    } else {
                                                        optionClass = "opacity-60";
                                                    }
                                                } else if (userAnswer === optIndex) {
                                                    optionClass = "border-accent bg-blue-50/50 shadow-md ring-1 ring-accent";
                                                    iconClass = "border-accent bg-accent";
                                                }

                                                return (
                                                    <label 
                                                    key={optIndex} 
                                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${optionClass}`}
                                                    onClick={() => handleQuizAnswer(qIdx, optIndex)}
                                                    >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${iconClass}`}>
                                                        {quizSubmitted ? (
                                                            optIndex === q.correctAnswerIndex ? <CheckCircle size={12} /> : (userAnswer === optIndex ? <X size={12} /> : null)
                                                        ) : (
                                                            userAnswer === optIndex && <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-base">{opt}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Feedback / Explanation Display */}
                                        {quizSubmitted && (
                                            <div className={`mt-3 p-4 rounded-xl text-sm leading-relaxed flex gap-3 animate-fade-in ${
                                                userAnswer === q.correctAnswerIndex ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
                                            }`}>
                                                <div className="shrink-0 mt-0.5">
                                                    {userAnswer === q.correctAnswerIndex ? <CheckCircle size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-600" />}
                                                </div>
                                                <div>
                                                    <span className="font-bold block mb-1 text-xs uppercase tracking-wide opacity-80">
                                                        {userAnswer === q.correctAnswerIndex ? 'Correct' : 'Explanation'}
                                                    </span>
                                                    {q.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end">
                             {!quizPassed ? (
                                <button 
                                    onClick={quizSubmitted ? retryLessonQuiz : submitLessonQuiz}
                                    disabled={Object.keys(quizAnswers).length < activeLesson.quiz.length}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20"
                                >
                                    {quizSubmitted ? "Try Again" : "Check Answers"}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNextLesson}
                                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2 animate-bounce"
                                >
                                    Continue to Next Lesson <ChevronRight size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
              /* LESSON CONTENT VIEW */
              <div className="animate-fade-in">
                {/* Lesson Header */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <span>Module {activeModuleIndex + 1}</span>
                    <ChevronRight size={12} />
                    <span>Lesson {activeLessonIndex + 1}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 font-heading leading-tight">{activeLesson?.title}</h1>
                  <div className="flex flex-wrap gap-3">
                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 text-sm font-medium">
                        <Clock size={16} />
                        {activeLesson?.duration}
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        <BookOpen size={16} />
                        Theory & Practice
                     </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 mb-12">
                   <SimpleMarkdown content={activeLesson?.content || ''} />
                </div>

                {/* Key Takeaways Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 mb-10 border border-blue-100/50">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 font-heading">
                    <Star className="text-accent fill-accent" size={24} />
                    Key Concepts
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeLesson?.keyTakeaways.map((point, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-700 font-medium">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Resources Card */}
                {activeLesson?.resources && activeLesson.resources.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 mb-10 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 font-heading">
                      <Globe className="text-blue-500" size={24} />
                      Additional Resources
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {activeLesson.resources.map((resource, i) => (
                        <a 
                          key={i} 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 group-hover:text-blue-600 shadow-sm transition-colors border border-slate-100">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate group-hover:text-blue-700 transition-colors">{resource.title}</p>
                            <p className="text-xs text-slate-500 capitalize">{resource.type}</p>
                          </div>
                          <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Assignment Card */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-8 sm:p-10 mb-16 shadow-2xl shadow-slate-900/20 group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 text-accentGlow">
                      <BookOpen size={24} />
                      <span className="font-bold tracking-wider uppercase text-xs">Practical Assignment</span>
                    </div>
                    <p className="text-xl sm:text-2xl text-slate-100 font-medium leading-relaxed font-heading">
                      {activeLesson?.assignment}
                    </p>
                  </div>
                </div>

                {/* Next Navigation */}
                <div className="mt-12 flex justify-end">
                    {activeLesson?.quiz && activeLesson.quiz.length > 0 ? (
                        <button 
                            onClick={handleStartQuiz}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2 group hover:shadow-2xl hover:-translate-y-1"
                        >
                            Start Knowledge Check <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleNextLesson}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2 group hover:shadow-2xl hover:-translate-y-1"
                        >
                            Next Lesson <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
              </div>
            )}
          </div>
          
          {/* Disclaimer Footer */}
          <div className="flex items-start gap-3 p-4 bg-slate-100 rounded-xl text-slate-500 text-xs border border-slate-200">
             <AlertTriangle size={16} className="shrink-0 mt-0.5" />
             <p>
                <strong>Disclaimer:</strong> This course content is generated by artificial intelligence. While we strive for accuracy, information regarding medical, legal, financial, or safety-critical topics should be verified by professional sources. CoreLearn Academy is an educational tool and does not provide professional advice.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};