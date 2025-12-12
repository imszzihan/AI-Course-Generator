import React from 'react';
import { X, Zap, BookOpen, Award } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-accent mb-6 mx-auto">
            <Zap size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-900 font-heading mb-2">How CoreLearn Works</h2>
          <p className="text-center text-slate-500 mb-8">
            Our AI architect builds a complete educational experience in seconds.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">1</div>
              <div>
                <h3 className="font-bold text-slate-900">Enter Your Goal</h3>
                <p className="text-sm text-slate-500">Type anything you want to learn. Be specific or broad.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">2</div>
              <div>
                <h3 className="font-bold text-slate-900">AI Curriculum Design</h3>
                <p className="text-sm text-slate-500">We generate modules, lessons, and quizzes instantly using Gemini 2.5.</p>
              </div>
            </div>

            <div className="flex gap-4">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">3</div>
              <div>
                <h3 className="font-bold text-slate-900">Get Certified</h3>
                <p className="text-sm text-slate-500">Pass the final exam to earn your personalized certificate.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
          >
            Got it, let's learn!
          </button>
        </div>
      </div>
    </div>
  );
};