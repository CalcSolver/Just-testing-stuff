// pages/api/ingest.js
export default function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    const data = req.body;
    
    // 1. Log to Vercel Dashboard
    console.log('🎯 [C2 INGEST]', data.name, data.url);
    
    // 2. Optional: Save to a free database (e.g., Supabase, Firebase)
    // For now, we'll just return the data to confirm it worked.
    
    res.status(200).json({ 
      success: true, 
      message: 'Data received', 
      received: data.name,
      timestamp: new Date().toISOString() 
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
