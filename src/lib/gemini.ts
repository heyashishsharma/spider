import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate a caption and hashtags based on the user's Media Kit settings.
 */
export async function generateInstagramPost(niche: string, tone: string, customInstructions: string) {
  const prompt = `
    You are an expert Instagram social media manager.
    Your niche is: ${niche}.
    Your tone of voice is: ${tone}.
    Additional instructions: ${customInstructions}.
    
    Generate an engaging Instagram caption for a new post. Include 5-8 relevant hashtags.
    Keep the output raw, without any markdown formatting or introductory text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5',
      contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Post Generation Error:", error);
    throw new Error("Failed to generate Instagram post content.");
  }
}

/**
 * Generate an automated, context-aware reply to an Instagram comment.
 */
export async function generateCommentReply(commentText: string, tone: string) {
  const prompt = `
    You are managing an Instagram account. A user just left this comment on your post:
    "${commentText}"
    
    Write a short, engaging, and context-aware reply.
    Your tone of voice is: ${tone}.
    Keep it under 2 sentences and use an emoji if appropriate.
    Do not use quotation marks or introductory text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5',
      contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Reply Generation Error:", error);
    return "Thanks for the comment! 🔥"; // Fallback safe reply
  }
}
