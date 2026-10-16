export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Store in memory (persists only in warm state)
  if (!global.payloads) global.payloads = [];
  
  global.payloads.unshift(req.body);
  if (global.payloads.length > 50) global.payloads.pop(); // Keep last 50

  res.status(200).json({ 
    success: true, 
    count: global.payloads.length,
    sessionId: req.body.sessionId || 'NONE'
  });
}
