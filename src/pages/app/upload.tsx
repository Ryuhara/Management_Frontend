'use client';

import { useState, ChangeEvent } from 'react';
import { uploadDocument, UploadResponse, UploadErrorResponse } from '../lib/api/backend-apis';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await uploadDocument(selectedFile);

      if ('error' in result) {
        setError((result as UploadErrorResponse).error);
      } else {
        setUploadResult(result as UploadResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Document Upload</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Select File:
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            display: 'block',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%'
          }}
        />
        {selectedFile && (
          <p style={{ marginTop: '8px', color: '#666' }}>
            選択されたファイル: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        variant="primary"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </Button>

      {error && (
        <Card variant="error" title="Error" style={{ marginTop: '20px' }}>
          <p>{error}</p>
        </Card>
      )}

      {uploadResult && (
        <Card variant="success" title="Upload Successful" style={{ marginTop: '20px' }}>
          <p><strong>Message:</strong> {uploadResult.message}</p>
          <p><strong>Filename:</strong> {uploadResult.filename}</p>
          <p><strong>Blob Name:</strong> {uploadResult.blob_name}</p>
        </Card>
      )}
    </div>
  );
}
