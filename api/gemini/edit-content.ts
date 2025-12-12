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
    const { text, instruction, complexity = 'basic' } = req.body;

    if (!text || !instruction) {
      return res.status(400).json({ error: 'Text and instruction are required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Usar modelo según complejidad
    const model = complexity === 'complex' ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: `${instruction}\n\nTexto a editar:\n${text}`,
      config: {
        temperature: 0.7
      }
    });

    return res.status(200).json({
      success: true,
      text: response.text || text
    });

  } catch (error: any) {
    console.error('Edit Content Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false,
      text: req.body.text // Return original text on error
    });
  }
}
