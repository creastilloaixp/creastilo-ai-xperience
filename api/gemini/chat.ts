import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://n8n-n8n.yxmkwr.easypanel.host/webhook-test/3b2ba344-9538-4522-aaeb-ec2700f4a28f";

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
    const { message, history = [], systemInstruction } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Function calling definition para email
    const emailTool = {
      name: 'send_email_n8n',
      description: 'Sends an email via N8N automation when user requests contact or support.',
      parameters: {
        type: 'object',
        properties: {
          user_message: {
            type: 'string',
            description: 'The message content from the user'
          },
          contact_info: {
            type: 'string',
            description: 'User contact information (email or phone)'
          },
          intent: {
            type: 'string',
            description: 'The intent of the message (e.g., "support", "sales", "info")'
          }
        },
        required: ['user_message']
      }
    };

    const fullHistory = [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullHistory,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [emailTool] }]
      }
    });

    // Check for function calls
    const functionCalls = response.functionCalls || [];

    if (functionCalls.length > 0) {
      const call = functionCalls[0];

      if (call.name === 'send_email_n8n') {
        // Execute N8N webhook
        try {
          await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: call.args.user_message,
              contact: call.args.contact_info || "Not provided",
              intent: call.args.intent || "general",
              timestamp: new Date().toISOString()
            })
          });

          // Send function result back to Gemini
          const finalResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              ...fullHistory,
              {
                role: 'model',
                parts: [{ functionCall: call }]
              },
              {
                role: 'user',
                parts: [{
                  functionResponse: {
                    name: 'send_email_n8n',
                    response: { status: 'Email sent successfully' }
                  }
                }]
              }
            ]
          });

          return res.status(200).json({
            text: finalResponse.text || "Email request processed.",
            success: true
          });

        } catch (webhookError) {
          console.error("Webhook Error:", webhookError);
          return res.status(200).json({
            text: "Tuve un problema conectando con el servidor de correo. Por favor intenta más tarde.",
            success: true
          });
        }
      }
    }

    return res.status(200).json({
      text: response.text || "I am unable to process that request.",
      success: true
    });

  } catch (error: any) {
    console.error('Chat Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
