import { GoogleGenAI } from "@google/genai";

export const categorizeOpportunity = async (content: string) => {
  const apiKey = (
    process.env.GEMINI_API_KEY || 
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
    process.env.GOOGLE_API_KEY || 
    process.env.API_KEY || 
    ""
  ).trim().replace(/['"]/g, "");

  const keyPreview = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "NONE";
  console.log(`Categorizing opportunity. API key present: ${!!apiKey}, length: ${apiKey?.length}, preview: ${keyPreview}`);
  
  if (apiKey && !apiKey.startsWith("AIza")) {
    console.warn(`Gemini API key "${keyPreview}" does not start with AIza. It might be invalid. Please check your AI Studio settings.`);
  }
  
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("YOUR_")) {
    console.error("Gemini API key is missing, empty, or a placeholder. Please set GEMINI_API_KEY in AI Studio settings.");
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
