import React from 'react';

interface SimpleMarkdownProps {
  content: string;
}

export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  lines.forEach((line, index) => {
    // Code Blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End block
        elements.push(
          <div key={`code-${index}`} className="my-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <pre className="relative bg-slate-900 text-blue-100 p-6 rounded-xl overflow-x-auto text-sm font-mono shadow-2xl">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          </div>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start block
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-xl font-bold text-slate-800 mt-10 mb-4 font-heading">{parseInline(line.replace('### ', ''))}</h3>);
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-2xl font-bold text-slate-900 mt-12 mb-6 font-heading tracking-tight">{parseInline(line.replace('## ', ''))}</h2>);
      return;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-3xl font-extrabold text-slate-900 mt-12 mb-8 font-heading">{parseInline(line.replace('# ', ''))}</h1>);
      return;
    }

    // Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
       elements.push(
         <li key={index} className="ml-4 list-disc text-slate-600 pl-2 mb-3 leading-relaxed marker:text-accent">
           {parseInline(line.replace(/^[-*]\s/, ''))}
         </li>
       );
       return;
    }
    
    if (/^\d+\.\s/.test(line.trim())) {
      elements.push(
        <div key={index} className="flex gap-3 ml-2 mb-4 text-slate-600 leading-relaxed">
           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-accent font-bold text-xs flex items-center justify-center mt-0.5">{line.match(/^\d+/)?.[0]}</span>
           <span>{parseInline(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
      return;
    }

    if (!line.trim()) {
      elements.push(<div key={index} className="h-2"></div>);
      return;
    }

    elements.push(<p key={index} className="mb-5 text-slate-600 leading-7 text-lg">{parseInline(line)}</p>);
  });

  return <div className="markdown-body">{elements}</div>;
};

const parseInline = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-100 text-accent px-1.5 py-0.5 rounded text-sm font-mono font-semibold border border-slate-200">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};