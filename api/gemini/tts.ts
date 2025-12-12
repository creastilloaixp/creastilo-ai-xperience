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
    const { text, voiceName = 'Kore' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: text,
      config: {
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    // Extract audio data
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
      return res.status(200).json({
        success: false,
        error: 'No audio generated'
      });
    }

    return res.status(200).json({
      success: true,
      audio: audioData // Base64 PCM audio
    });

  } catch (error: any) {
    console.error('TTS Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
