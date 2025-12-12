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
    const { prompt, systemInstruction } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Llamar a Gemini con API key del servidor
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });

    return res.status(200).json({
      text: response.text || "No response generated.",
      success: true
    });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
