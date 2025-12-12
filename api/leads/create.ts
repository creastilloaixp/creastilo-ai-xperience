import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
    const { name, phone, email, prize_id, prize_label, coupon_code, estimated_value } = req.body;

    // Validación
    if (!name || !phone || !prize_id || !prize_label || !coupon_code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Capturar metadata del request
    const sessionId = req.headers['x-session-id'] as string;
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;

    // Inicializar Supabase con SERVICE_KEY (backend only)
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Insertar lead en Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
        prize_id,
        prize_label,
        coupon_code,
        estimated_value: estimated_value || 0,
        session_id: sessionId,
        ip_address: ip,
        status: 'Pendiente'
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ error: 'Failed to create lead', details: error.message });
    }

    return res.status(201).json({
      success: true,
      lead: data
    });

  } catch (error: any) {
    console.error('Create Lead Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
