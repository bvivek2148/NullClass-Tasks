import type { NextApiRequest, NextApiResponse } from 'next';

// This is a catch-all API route that will proxy requests to your backend
// For Vercel deployment, you might want to:
// 1. Deploy your Express API separately (recommended)
// 2. Or convert your Express routes to Next.js API routes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extract the API path
  const { slug } = req.query;
  const apiPath = Array.isArray(slug) ? slug.join('/') : slug;
  
  // Get the backend URL from environment variables
  const backendUrl = process.env.BACKEND_URL || 'https://your-api-domain.vercel.app';
  
  try {
    // Forward the request to your Express API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Copy over important headers, filtering out arrays
    Object.entries(req.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
    
    const response = await fetch(`${backendUrl}/api/${apiPath}`, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? String(error) : 'Something went wrong'
    });
  }
}