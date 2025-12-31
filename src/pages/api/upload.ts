import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs/promises';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

// Next.jsのデフォルトのbodyパーサーを無効化
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // formidableを使用してファイルをパース
    const form = formidable({});

    const [fields, files] = await form.parse(req);

    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = fileArray[0] as FormidableFile;

    // ファイルを読み込む
    const fileBuffer = await fs.readFile(file.filepath);

    // FormDataを作成してバックエンドに送信
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: file.mimetype || 'application/octet-stream' });
    formData.append('file', blob, file.originalFilename || 'file');

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${BACKEND_API_URL}/api/upload_service`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // 一時ファイルを削除
    try {
      await fs.unlink(file.filepath);
    } catch (unlinkError) {
      console.error('Error deleting temp file:', unlinkError);
    }

    // バックエンドのステータスコードをそのまま返す
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({
      error: 'Failed to upload file to backend',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
