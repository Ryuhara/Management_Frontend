import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blob_name, model_id, embedding_model } = req.body;

    if (!blob_name) {
      return res.status(400).json({ error: 'blob_name is required' });
    }

    const response = await fetch(`${BACKEND_API_URL}/api/embedding/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blob_name,
        model_id: model_id || 'prebuilt-layout',
        embedding_model: embedding_model || 'text-embedding-3-small',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error processing document:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process document',
    });
  }
}
