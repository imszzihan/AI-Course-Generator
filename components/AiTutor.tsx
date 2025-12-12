import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot, Loader2, ShieldAlert } from 'lucide-react';
import { askTutor } from '../services/gemini';
import { SimpleMarkdown } from './SimpleMarkdown';

interface AiTutorProps {
  lessonTitle: string;
  lessonContent: string;
  isQuizMode?: boolean;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiTutor: React.FC<AiTutorProps> = ({ lessonTitle, lessonContent, isQuizMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNoCheating, setShowNoCheating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  // Handle Toggle with Anti-Cheat Logic
  const handleToggle = () => {
    if (isQuizMode) {
      setShowNoCheating(true);
      // Auto hide the warning after 3 seconds
      const timer = setTimeout(() => setShowNoCheating(false), 3000);
      return () => clearTimeout(timer);
    }
    
    // Normal toggle
    setIsOpen(!isOpen);
    setShowNoCheating(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askTutor(lessonTitle, lessonContent, userMessage.text, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I couldn't reach the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Anti-Cheat Warning Popup */}
      {showNoCheating && (
        <div className="fixed bottom-24 right-6 lg:bottom-28 lg:right-8 z-50 animate-shake origin-bottom-right">
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 relative max-w-[250px]">
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-red-500 rotate-45 transform"></div>
            <div className="bg-white/20 p-1.5 rounded-full">
               <ShieldAlert size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">No AI Allowed!</p>
              <p className="text-[10px] opacity-90 leading-tight mt-0.5">Please complete the assessment on your own.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 group 
        ${isOpen ? 'w-12 h-12 rounded-full bg-slate-200 text-slate-600' : 'w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
             <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
             <MessageCircle size={28} className="relative z-10" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          </>
        )}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-20 right-4 sm:right-6 lg:bottom-24 lg:right-8 z-40 w-[90vw] sm:w-[400px] h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
             <Sparkles size={20} className="text-yellow-300" />
          </div>
          <div className="flex-1 min-w-0">
             <h3 className="font-bold font-heading truncate">AI Teaching Assistant</h3>
             <p className="text-xs text-slate-300 truncate opacity-80">Ask about "{lessonTitle}"</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
             <div className="text-center py-8 px-4 opacity-50">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Bot size={32} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                   Hi! I'm your AI Tutor. I've read this lesson and can answer any questions you have.
                </p>
             </div>
          )}
          
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                   {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                   {msg.role === 'user' ? (
                      msg.text
                   ) : (
                      <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
                         <SimpleMarkdown content={msg.text} />
                      </div>
                   )}
                </div>
             </div>
          ))}

          {isLoading && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex-shrink-0 flex items-center justify-center mt-1">
                   <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                   <Loader2 size={14} className="animate-spin" />
                   Thinking...
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100">
           <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
              <textarea
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Ask a question about this lesson..."
                 className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm p-2 max-h-32 min-h-[40px] outline-none text-slate-700 placeholder:text-slate-400"
                 rows={1}
                 style={{ minHeight: '44px' }}
              />
              <button
                 onClick={handleSend}
                 disabled={!input.trim() || isLoading}
                 className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                 <Send size={18} />
              </button>
           </div>
           <p className="text-[10px] text-center text-slate-400 mt-2">
              AI can make mistakes. Review generated responses.
           </p>
        </div>
      </div>
    </>
  );
};