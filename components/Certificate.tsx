import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import { X, Printer } from 'lucide-react';

interface CertificateProps {
  course: Course;
  learnerName: string;
  score: number;
  onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ course, learnerName, score, onClose }) => {
  const [certificateId, setCertificateId] = useState('');
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // Generate a consistent random ID for this session
    setCertificateId(`CLX9-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-1QZ8`);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      {/* Container for the whole modal including toolbar */}
      <div className="relative w-full max-w-[1100px] flex flex-col h-auto">
        
        {/* Toolbar - Hidden when printing */}
        <div className="flex justify-end gap-3 mb-4 print:hidden sticky top-0 z-20">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 bg-white text-slate-900 rounded-full font-semibold shadow-lg hover:bg-slate-50 transition-all hover:-translate-y-0.5"
            >
              <Printer size={18} />
              Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
        </div>

        {/* Certificate Paper */}
        <div className="overflow-hidden rounded-sm shadow-2xl print:shadow-none print:overflow-visible w-full bg-white">
            {/* 
                Certificate Dimensions:
                We aim for ~1100px width for screen. 
                Print CSS handles the actual page size.
                Aspect Ratio 11/8.5
            */}
            <div 
                id="certificate-area" 
                className="bg-white relative mx-auto print:mx-0 print:w-full print:h-full flex flex-col"
                style={{ 
                    width: '100%',
                    maxWidth: '1056px', // 11 inches at 96 DPI
                    aspectRatio: '11/8.5',
                    minHeight: '816px'
                }}
            >
                {/* Thin Silver Border (#C8CDD3) */}
                <div className="absolute inset-4 print:inset-2 border-[1px] border-[#C8CDD3] z-0 pointer-events-none"></div>

                {/* Header Bar (#0A2342) */}
                <div className="absolute top-8 left-8 right-8 h-24 print:h-20 print:top-6 print:left-6 print:right-6 bg-[#0A2342] flex items-center justify-between px-12 print:px-8 z-10">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-white/30 rounded-lg flex items-center justify-center">
                             <div className="text-white text-xl">🎓</div>
                        </div>
                        <div>
                            <div className="text-white font-heading font-bold text-xl tracking-tight leading-none">CoreLearn</div>
                            <div className="text-blue-200 text-[10px] font-bold tracking-widest uppercase">Academy</div>
                        </div>
                    </div>
                    {/* Right side text in header (optional, keeping minimal as per new main title) */}
                    <div className="text-white/80 font-serif text-sm tracking-widest uppercase">
                        Official Transcript
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 flex flex-col items-center pt-40 print:pt-32 px-20 print:px-16 relative z-10 text-center">
                    
                    {/* Main Title */}
                    <h1 className="font-serif text-5xl print:text-4xl text-[#0A2342] font-bold tracking-widest uppercase mb-12 print:mb-8">
                        Certificate of Completion
                    </h1>

                    <h3 className="font-serif text-xl print:text-lg text-slate-500 italic mb-6 print:mb-4">This certifies that</h3>
                    
                    <h2 className="font-heading text-4xl print:text-3xl font-bold text-slate-900 mb-8 print:mb-4 pb-2 border-b-2 border-slate-100 min-w-[500px] inline-block tracking-tight">
                        {learnerName || "Student Name"}
                    </h2>
                    
                    <div className="space-y-3 mb-10 print:mb-6 max-w-4xl">
                        <p className="text-lg print:text-base text-slate-600 font-sans leading-relaxed">
                            has successfully completed the course
                        </p>
                        <h2 className="text-2xl print:text-xl font-bold text-slate-900 font-serif my-2">
                            {course.title}
                        </h2>
                        <p className="text-lg print:text-base text-slate-600 font-sans">
                            with a completion score of <span className="font-bold text-[#0A2342]">{score}%</span>.
                        </p>
                    </div>

                    <p className="text-slate-500 font-sans text-sm mb-auto">
                        Issued on <span className="font-semibold text-slate-700">{completionDate}</span>
                    </p>

                    {/* Footer Section */}
                    <div className="w-full flex justify-between items-end mb-12 print:mb-8 px-12 print:px-8">
                        {/* Signature */}
                        <div className="flex flex-col items-start min-w-[250px]">
                            {/* Replaced Signature Image with Small Font Text */}
                            <div className="mb-2 px-1">
                                <span className="text-sm font-semibold text-slate-800 font-heading uppercase tracking-widest">
                                    CoreLearn Academy
                                </span>
                            </div>
                            <div className="h-px w-full bg-slate-400 mb-2"></div>
                            <div className="text-xs font-bold text-slate-900 uppercase tracking-widest">Authorized Issuer</div>
                            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">CoreLearn Academy AI Platform</div>
                        </div>

                        {/* Certificate ID */}
                        <div className="text-right">
                             <div className="text-xs font-mono text-slate-400">
                                Certificate ID: {certificateId}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
};