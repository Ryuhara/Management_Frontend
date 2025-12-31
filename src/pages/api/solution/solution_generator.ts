import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GETメソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query Input is required' });
  }

  try {
    // バックエンドAPIにリクエストを転送
    const response = await fetch(
      `${BACKEND_API_URL}/api/solution_service/${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorData;
      try {
        errorData = isJson ? await response.json() : { error: await response.text() };
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      return res.status(response.status).json({
        error: errorData.error || `HTTP error status: ${response.status}`,
      });
    }

    // Parse response based on content type
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      // Backend returned text/html, wrap it in a solution object
      const text = await response.text();
      data = { solution: text };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching solution:', error);

    // Check if it's a connection error
    const isConnectionError = error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
       error.message.includes('fetch failed') ||
       error.cause?.toString().includes('ECONNREFUSED'));

    return res.status(503).json({
      error: isConnectionError
        ? 'Backend service is unavailable. Please ensure the backend server is running.'
        : 'Failed to fetch solution from backend',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
