import { GoogleGenAI } from "@google/genai";

export const categorizeOpportunity = async (content: string) => {
  const apiKey = (process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").trim().replace(/['"]/g, "");

  const keyPreview = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "NONE";
  console.log(`Categorizing opportunity. API key present: ${!!apiKey}, length: ${apiKey?.length}, preview: ${keyPreview}`);
  
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("YOUR_") || apiKey.length < 10) {
    console.error("Gemini API key is missing, invalid, or a placeholder. Please set NEXT_PUBLIC_GEMINI_API_KEY in AI Studio settings.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
    Extract structured information from this Telegram post about an opportunity.
    Return a JSON object with these fields:
    - title (string)
    - type (string: Internship, Event, Competition, Scholarship, Job, Fellowship, Conference, Grant, or General)
    - organization (string)
    - location (string)
    - deadline (string, ISO format if possible or readable)
    - apply_link (string)
    - description (string, detailed)
    - category (string, one of: Internships, Events, Competitions, Scholarships, Jobs, Fellowships, Conferences, Grants, General)
    - tags (array of strings)

    Post content:
    ${content}
  `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini categorization failed:", error);
    return null;
  }
};
