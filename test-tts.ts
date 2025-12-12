
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Manual env loader
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const lines = envFile.split('\n');
        for (const line of lines) {
            const [key, val] = line.split('=');
            if (key && val) {
                process.env[key.trim()] = val.trim();
            }
        }
    } catch (e) {
        console.warn('Could not read .env file');
    }
};
loadEnv();

async function testTTS() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.error('No Key'); return; }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const text = "Hola mundo";
    console.log('Testing gemini-2.5-flash-preview-tts...');

    // STANDARD FLASH WITH AUDIO MODALITY
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: text }] }], 
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    console.log('Success? Candidates:', response.candidates?.length);
    if(response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        console.log('AUDIO DATA RECEIVED! Length:', response.candidates[0].content.parts[0].inlineData.data.length);
    } else {
        console.log('No audio data in response.');
        console.log(JSON.stringify(response, null, 2));
    }

  } catch (error: any) {
    console.error('Error:', error.message); 
    if(error.response) console.log(JSON.stringify(error.response.data || error.response, null, 2));
  }
}

testTTS();
