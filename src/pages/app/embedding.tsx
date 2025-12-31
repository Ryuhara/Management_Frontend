'use client';

import { useState, useEffect } from 'react';
import {
  listBlobs,
  processDocument,
  processBatchDocuments,
  ListBlobsResponse,
  ProcessDocumentResponse,
  ProcessBatchResponse,
  EmbeddingErrorResponse,
} from '../lib/api/backend-apis';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function EmbeddingPage() {
  const [blobs, setBlobs] = useState<string[]>([]);
  const [selectedBlobs, setSelectedBlobs] = useState<string[]>([]);
  const [prefix, setPrefix] = useState('');
  const [modelId, setModelId] = useState('prebuilt-read');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessDocumentResponse | ProcessBatchResponse | null>(null);

  const loadBlobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listBlobs(prefix || undefined);
      if ('error' in response) {
        setError((response as EmbeddingErrorResponse).error);
      } else {
        setBlobs((response as ListBlobsResponse).blobs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlobs();
  }, []);

  const handleBlobSelection = (blobName: string) => {
    setSelectedBlobs((prev) =>
      prev.includes(blobName)
        ? prev.filter((b) => b !== blobName)
        : [...prev, blobName]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlobs.length === blobs.length) {
      setSelectedBlobs([]);
    } else {
      setSelectedBlobs([...blobs]);
    }
  };

  const handleProcessSingle = async (blobName: string) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const response = await processDocument(blobName, modelId, embeddingModel);
      if ('error' in response) {
        setError((response as EmbeddingErrorResponse).error);
      } else {
        setResult(response as ProcessDocumentResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessBatch = async () => {
    if (selectedBlobs.length === 0) {
      setError('Please select at least one document');
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const response = await processBatchDocuments(selectedBlobs, modelId, embeddingModel);
      if ('error' in response) {
        setError((response as EmbeddingErrorResponse).error);
      } else {
        setResult(response as ProcessBatchResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process batch');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Document Embedding Processing</h1>

      {/* Configuration Section */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0 }}>Configuration</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Model ID:
          </label>
          <input
            type="text"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '300px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Embedding Model:
          </label>
          <input
            type="text"
            value={embeddingModel}
            onChange={(e) => setEmbeddingModel(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '300px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Blob Prefix Filter:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g., documents/"
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 1,
                maxWidth: '300px'
              }}
            />
            <Button
              onClick={loadBlobs}
              disabled={loading}
              variant="primary"
            >
              {loading ? 'Loading...' : 'Refresh Blobs'}
            </Button>
          </div>
        </div>
      </div>

      {/* Blob List Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>Available Documents ({blobs.length})</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={handleSelectAll}
              disabled={blobs.length === 0}
              variant="secondary"
            >
              {selectedBlobs.length === blobs.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              onClick={handleProcessBatch}
              disabled={processing || selectedBlobs.length === 0}
              variant="primary"
              style={{
                backgroundColor: processing || selectedBlobs.length === 0 ? '#ccc' : '#28a745',
                fontWeight: 'bold'
              }}
            >
              {processing ? 'Processing...' : `Process Selected (${selectedBlobs.length})`}
            </Button>
          </div>
        </div>

        {blobs.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            color: '#666'
          }}>
            {loading ? 'Loading blobs...' : 'No documents found'}
          </div>
        ) : (
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {blobs.map((blob, index) => (
              <div
                key={blob}
                style={{
                  padding: '15px',
                  borderBottom: index < blobs.length - 1 ? '1px solid #eee' : 'none',
                  backgroundColor: selectedBlobs.includes(blob) ? '#e3f2fd' : 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={selectedBlobs.includes(blob)}
                    onChange={() => handleBlobSelection(blob)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ wordBreak: 'break-all' }}>{blob}</span>
                </div>
                <Button
                  onClick={() => handleProcessSingle(blob)}
                  disabled={processing}
                  variant="primary"
                  style={{
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Process
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card variant="error" title="Error" style={{ marginBottom: '20px' }}>
          <p>{error}</p>
        </Card>
      )}

      {/* Result Display */}
      {result && (
        <Card variant="success" title="Processing Result" style={{ marginBottom: '20px' }}>
          {('result' in result && result.result) ? (
            // Single document result
            <div>
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Blob Name:</strong> {result.result.blob_name}</p>
              <p><strong>Stored Embeddings:</strong> {result.result.stored_embeddings}</p>
            </div>
          ) : ('results' in result && result.results) ? (
            // Batch result
            <div>
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Total Documents:</strong> {result.total_documents}</p>
              <p><strong>Total Embeddings Stored:</strong> {result.total_embeddings_stored}</p>

              <h3>Individual Results:</h3>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                padding: '10px'
              }}>
                {result.results.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px',
                      color: '#333'
                    }}
                  >
                    <p style={{ margin: '4px 0' }}>
                      <strong>Blob:</strong> {r.blob_name}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Embeddings:</strong> {r.stored_embeddings}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Fallback for unexpected response structure
            <div>
              <p><strong>Status:</strong> {result.status || 'Unknown'}</p>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px',
                fontSize: '12px'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
