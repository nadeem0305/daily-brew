import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeEntry(content: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are the 'Daily Brew Barista'. Analyze the user's journal entry. 
        Return a JSON object with:
        1. 'mood': A single emoji that represents the mood.
        2. 'insight': A short, soulful, coffee-themed piece of advice.
        
        Return ONLY the JSON.`,
      },
      { role: "user", content },
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }, // This is the "magic" line
  });

  // Convert the AI's string response into a JavaScript object
  const data = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

  return {
    mood: data.mood || "☕",
    insight: data.insight || "Keep brewing, friend.",
  };
}
