
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly when initializing the GoogleGenAI instance
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const getExpertAdvice = async (prompt: string, context?: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un experto criador de aves de combate de clase mundial con décadas de experiencia en genética, nutrición, salud y entrenamiento. 
      Analiza la siguiente consulta y proporciona consejos detallados, profesionales y éticos sobre la crianza de aves de alto rendimiento.
      
      Consulta: ${prompt}
      
      Contexto actual de la granja (si aplica): ${JSON.stringify(context || {})}
      
      Responde en español, usando un tono profesional y experto.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Fix: Access the .text property directly (not a method call)
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error al consultar al experto digital. Por favor intenta de nuevo.";
  }
};

export const analyzePedigree = async (birds: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analiza esta lista de aves y sus linajes. Sugiere los mejores cruces posibles para mejorar la velocidad y resistencia de la descendencia basándote en la genética disponible.
      
      Aves: ${JSON.stringify(birds)}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    // Fix: Access the .text property directly (not a method call)
    return response.text;
  } catch (error) {
    console.error("Pedigree Analysis Error:", error);
    return null;
  }
};
