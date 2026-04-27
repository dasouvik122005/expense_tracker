import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getFinancialTip(transactionsSummary: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "Tip: Set up your GEMINI_API_KEY to get personalized AI financial advice!";
    }

    const prompt = `
      You are a wise financial advisor. Based on this summary of a user's recent transactions, provide ONE single, short, actionable financial tip (max 20 words).
      
      User Data Summary:
      ${transactionsSummary}
      
      The tip should be encouraging and direct.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || "Focus on building an emergency fund covering 3-6 months of expenses.";
  } catch (error) {
    console.error("Error fetching AI tip:", error);
    return "Consider the '50/30/20' rule: 50% for needs, 30% for wants, 20% for savings.";
  }
}
