export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'tool';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string; // Feedback on why the answer is correct or what to review
}

export interface Lesson {
  title: string;
  duration: string;
  content: string; // Markdown formatted content
  keyTakeaways: string[];
  assignment: string;
  resources: Resource[];
  quiz: QuizQuestion[]; // 3 short questions per lesson
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface FinalExam {
  title: string;
  questions: Question[];
}

export interface Course {
  title: string;
  certificateTitle: string;
  description: string;
  targetAudience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTotalDuration: string;
  modules: Module[];
  finalExam: FinalExam;
}