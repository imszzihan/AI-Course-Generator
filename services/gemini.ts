import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCourseTitle = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a professional, academic, and engaging course title for a university-grade course about: "${topic}". 
      
      Guidelines:
      - It should sound like a Masterclass or University Curriculum.
      - Examples: "Advanced Neurobiology: Mechanisms of Memory", "Strategic Financial Management for Executives", "Full Stack Architecture: From Prototype to Scale".
      
      Return ONLY the title text, nothing else. No quotes.`,
    });
    return response.text?.trim() || topic;
  } catch (e) {
    return topic;
  }
};

export const generateCourseContent = async (topic: string, specificTitle?: string): Promise<Course> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      certificateTitle: { type: Type.STRING },
      description: { type: Type.STRING },
      targetAudience: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
      estimatedTotalDuration: { type: Type.STRING },
      modules: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            lessons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  content: { type: Type.STRING, description: "Extensive educational content (approx 600-800 words). Must include deep dives, examples, and correct technical syntax." },
                  keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                  assignment: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING, description: "A valid URL to a real resource (documentation, video, article)." },
                        type: { type: Type.STRING, enum: ["video", "article", "book", "tool"] }
                      },
                      required: ["title", "url", "type"]
                    },
                    description: "List of 2-3 external resources for further reading."
                  },
                  quiz: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswerIndex: { type: Type.INTEGER },
                        explanation: { type: Type.STRING, description: "Detailed pedagogical explanation of the correct answer and why other options are incorrect." }
                      },
                      required: ["question", "options", "correctAnswerIndex", "explanation"]
                    }
                  }
                },
                required: ["title", "duration", "content", "keyTakeaways", "assignment", "resources", "quiz"]
              }
            }
          },
          required: ["title", "description", "lessons"]
        }
      },
      finalExam: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswerIndex: { type: Type.INTEGER }
              },
              required: ["id", "text", "options", "correctAnswerIndex"]
            }
          }
        },
        required: ["title", "questions"]
      }
    },
    required: ["title", "certificateTitle", "description", "targetAudience", "difficulty", "estimatedTotalDuration", "modules", "finalExam"]
  };

  const coreInstructions = `
    CRITICAL QUALITY & ACCURACY PROTOCOLS:
    1.  **ACT AS A VERIFIED EXPERT**: You are the world's leading authority on this subject. Your content must be factually impeccable, nuanced, and professional.
    2.  **DOUBLE-CHECK FACTS**: Verify all dates, formulas, code syntax, and historical events. If a specific detail is debated in the field, present multiple viewpoints.
    3.  **EXPLAIN "WHY"**: Do not just list facts. Explain underlying mechanisms, context, and reasoning. Teach concepts, don't just state them.
    4.  **SAFETY & LEGAL**: If the topic involves medical, legal, or financial advice, strictly adhere to consensus guidelines. Provide accurate, conservative educational information and imply standard disclaimers in the text.
    5.  **NO HALLUCINATIONS**: Do not invent citations, case laws, or libraries.

    COURSE SCALE - "MASTERCLASS" LEVEL:
    - **Modules**: 4 to 6 distinct, progressive modules.
    - **Lessons**: 3 to 5 lessons per module.
    - **Content Volume**: ~600-800 words per lesson. Detailed, comprehensive, and exhaustive.
    - **Format**: Use Markdown effectively (H2, H3, bold, lists, code blocks).
  `;

  const prompt = specificTitle 
    ? `Create a rigorous, university-grade online course curriculum with the title: "${specificTitle}" (Topic: ${topic}).
    
    ${coreInstructions}
    
    Structure Requirements:
    1. Use the provided Title exactly.
    2. Create a logical flow from foundational to advanced concepts.
    3. Quizzes: 3 challenging questions per lesson with helpful explanations.
    4. Resources: Provide 2-3 high-quality external resources (Documentation, Videos, Articles) for each lesson.
    5. Final Exam: 15 comprehensive questions testing deep understanding.
    
    The output must be pure JSON matching the schema.`
    : `Create a rigorous, university-grade online course curriculum about "${topic}".
    
    ${coreInstructions}
    
    Structure Requirements:
    1. **Create a Professional, Academic Course Title** that sounds like a university masterclass.
    2. Create a logical flow from foundational to advanced concepts.
    3. Quizzes: 3 challenging questions per lesson with helpful explanations.
    4. Resources: Provide 2-3 high-quality external resources (Documentation, Videos, Articles) for each lesson.
    5. Final Exam: 15 comprehensive questions testing deep understanding.
    
    The output must be pure JSON matching the schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "You are a distinguished professor and subject matter expert known for precision, accuracy, and depth of instruction. You prioritize educational value and factual correctness above all else."
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate course content");
  
  return JSON.parse(text) as Course;
};

export const askTutor = async (currentLessonTitle: string, currentLessonContent: string, question: string, chatHistory: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  try {
    const historyStr = chatHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'AI Tutor'}: ${msg.text}`).join('\n');
    
    const prompt = `You are a helpful, encouraging, and highly knowledgeable AI Teaching Assistant.
    
    CONTEXT (The student is currently studying this lesson):
    Title: ${currentLessonTitle}
    Content: 
    ${currentLessonContent.substring(0, 15000)}
    
    PREVIOUS CHAT HISTORY:
    ${historyStr}
    
    STUDENT QUESTION: "${question}"
    
    INSTRUCTIONS:
    1. Answer the student's question clearly and concisely.
    2. Use the provided Lesson Content as your primary source of truth.
    3. If the answer is in the lesson, explain it in a new way to help them understand.
    4. If the question requires outside knowledge, provide it but keep it relevant.
    5. Use Markdown for formatting (bold, code blocks, lists).
    
    Provide the response now.`;
 
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    return response.text || "I'm having trouble connecting right now. Please try again.";
  } catch (e) {
    console.error(e);
    return "I'm sorry, I encountered an error. Please check your connection and try again.";
  }
 };