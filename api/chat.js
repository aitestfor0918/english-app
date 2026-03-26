// Vercel Serverless Function: api/chat.js
// This acts as a proxy to the Gemini API to avoid CORS issues and secure the API Key.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { contents } = req.body;
  
  // Get API key from request headers (user's custom key) 
  // or fallback to server-side environment variable (GEMINI_API_KEY)
  const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API Key is missing. Please set GEMINI_API_KEY in Vercel environment variables or provide it in the app settings.' 
    });
  }

  try {
    // Forward the request to Google's Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    // Forward the status code and data back to the frontend
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Failed to connect to Gemini API. Please check your network or API settings.' });
  }
}
