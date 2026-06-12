// Vercel serverless function: proxies the AI Course Guide chat to Anthropic.
// The Vite dev proxy only exists locally — in production this file handles /api/chat.
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const key = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  if (!key) {
    return res.status(503).json({
      error: { message: 'AI chat is not configured yet. Add ANTHROPIC_API_KEY in Vercel environment variables.' },
    })
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })
    const data = await upstream.json()
    return res.status(upstream.status).json(data)
  } catch (err) {
    return res.status(502).json({ error: { message: 'Upstream request failed: ' + err.message } })
  }
}
