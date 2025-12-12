import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id, limit = 100 } = req.query;

    // Inicializar Supabase con SERVICE_KEY
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Query leads
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    // Filtrar por session si se proporciona
    if (session_id) {
      query = query.eq('session_id', session_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(500).json({ error: 'Failed to fetch leads', details: error.message });
    }

    return res.status(200).json({
      success: true,
      leads: data || [],
      count: data?.length || 0
    });

  } catch (error: any) {
    console.error('List Leads Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
