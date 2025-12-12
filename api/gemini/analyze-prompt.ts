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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const analysisPrompt = `Analiza este prompt de imagen y devuelve un JSON con:
    {
      "score": número del 0-100 indicando calidad,
      "missing_elements": array de elementos faltantes,
      "applied_techniques": array de técnicas aplicadas,
      "feedback": string con recomendaciones
    }

    Prompt a analizar: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const analysis = JSON.parse(text);

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error: any) {
    console.error('Analyze Prompt Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false,
      analysis: {
        score: 50,
        missing_elements: ["Detalles de iluminación", "Estilo artístico", "Composición"],
        applied_techniques: ["Mejora de resolución", "Ajuste de luz"],
        feedback: "Análisis no disponible por el momento."
      }
    });
  }
}
