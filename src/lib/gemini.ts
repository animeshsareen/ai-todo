import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateSubTasks(taskTitle: string, customPrompt: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `${customPrompt}\n\nTask: "${taskTitle}"\n\nReturn only the sub-tasks, one per line, without numbers or bullets.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.split('\n').filter(task => task.trim().length > 0);
  } catch (error) {
    console.error('Error generating sub-tasks:', error);
    return [];
  }
} 