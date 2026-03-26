import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export const categorizeOpportunity = async (content: string) => {
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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini categorization failed:", error);
    return null;
  }
};
