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

  const { text, voiceName = 'Kore' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Direct REST API call to avoid SDK issues in serverless env
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('API Key missing');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    
    const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: { parts: [{ text: text }] },
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName }
                    }
                }
            }
        })
    });

    if (!fetchResponse.ok) {
       const errText = await fetchResponse.text();
       throw new Error(`Gemini REST Error: ${fetchResponse.status} ${errText}`);
    }

    const data = await fetchResponse.json();
    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) throw new Error('No audio data in REST response');

    return res.status(200).json({
        success: true,
        audio: audioData
    });

  } catch (error: any) {
    console.error('TTS Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      details: error.toString(),
      success: false
    });
  }
}
