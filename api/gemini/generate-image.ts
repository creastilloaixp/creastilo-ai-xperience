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
    const { prompt, aspectRatio = '1:1', imageSize = '1K' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio,
        imageSize
      }
    });

    // Extract base64 image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return res.status(200).json({
          success: true,
          image: `data:image/png;base64,${part.inlineData.data}`
        });
      }
    }

    return res.status(200).json({
      success: false,
      error: 'No image generated'
    });

  } catch (error: any) {
    console.error('Image Generation Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
