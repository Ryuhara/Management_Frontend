import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prefix } = req.query;
    const url = prefix
      ? `${BACKEND_API_URL}/api/embedding/list-blobs?prefix=${encodeURIComponent(prefix as string)}`
      : `${BACKEND_API_URL}/api/embedding/list-blobs`;

    console.log('[list-blobs] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[list-blobs] Response status:', response.status);

    const data = await response.json();
    console.log('[list-blobs] Response data:', data);

    if (!response.ok) {
      console.error('[list-blobs] Backend error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[list-blobs] Error fetching blobs:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch blobs',
      details: error instanceof Error ? error.stack : undefined,
    });
  }
}
