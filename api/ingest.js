// api/ingest.js
export default function handler(req, res) {
  // Set CORS headers to allow the dashboard to fetch from the API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Use a global variable to store data in memory
  // Note: This resets on cold starts. For production, use Vercel KV.
  if (!global.payloads) {
    global.payloads = [];
  }

  if (req.method === 'POST') {
    // Ingest new data
    const newPayload = req.body;
    
    // Prevent duplicates (optional: check by name+ts)
    global.payloads.unshift(newPayload);
    
    // Keep only the last 50 entries to save memory
    if (global.payloads.length > 50) {
      global.payloads.pop();
    }

    return res.status(200).json({ 
      success: true, 
      count: global.payloads.length,
      message: 'Payload received'
    });
  } 

  else if (req.method === 'GET') {
    // Return stored data
    return res.status(200).json(global.payloads);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
