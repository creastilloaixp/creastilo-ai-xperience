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
    const { topic, platform, tone } = req.body;

    if (!topic || !platform || !tone) {
      return res.status(400).json({ error: 'Topic, platform and tone are required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `Crea una estrategia completa de campaña para ${platform} sobre "${topic}" con tono ${tone}.

    Genera 3 estrategias (Viral, Story, Venta) con:
    - copy
    - hashtags (array de strings)

    También genera:
    - style_direction (descripción general del estilo visual)
    - visual_prompt (prompt detallado en inglés para generación de imagen)

    Formato JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const campaign = JSON.parse(text);

    return res.status(200).json({
      success: true,
      campaign
    });

  } catch (error: any) {
    console.error('Campaign Generation Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false,
      campaign: {
        style_direction: "Default",
        strategies: [
          { type: "Viral", copy: "Error generando copy.", hashtags: [] },
          { type: "Story", copy: "Error generando copy.", hashtags: [] },
          { type: "Venta", copy: "Error generando copy.", hashtags: [] }
        ],
        visual_prompt: "Abstract glitch art representing a system error."
      }
    });
  }
}
