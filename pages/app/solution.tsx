'use client';

import { useState } from 'react';
import { getSolution, SolutionResponse } from '../lib/api/backend-apis';

export default function SolutionPage() {
  const [codeId, setCodeId] = useState('');
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSolution = async () => {
    if (!codeId.trim()) {
      setError('Please enter a Code ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await getSolution(codeId);
      setSolution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Search Solution</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Code ID:
        </label>
        <input
          type="text"
          value={codeId}
          onChange={(e) => setCodeId(e.target.value)}
          placeholder="Code IDを入力"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGetSolution();
            }
          }}
        />
      </div>

      <button
        onClick={handleGetSolution}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Get Solution'}
      </button>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {solution && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <h2>Solution Result</h2>
          <pre style={{
            backgroundColor: '#fff',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {JSON.stringify(solution, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
