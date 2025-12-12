import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rawPrompt, style = "Cinematic" } = req.body;

    if (!rawPrompt) {
      return res.status(400).json({ error: 'Raw prompt is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const enhancePrompt = `Enhance this image prompt to be highly detailed, ${style} style, and photorealistic (if applicable). Keep it under 60 words. Prompt: ${rawPrompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: enhancePrompt
    });

    return res.status(200).json({
      success: true,
      enhancedPrompt: response.text || rawPrompt
    });

  } catch (error: any) {
    console.error('Enhance Prompt Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false,
      enhancedPrompt: req.body.rawPrompt // Return original on error
    });
  }
}
