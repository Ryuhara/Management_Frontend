'use client';

import { useState } from 'react';
import { getSolution, SolutionResponse } from '../lib/api/backend-apis';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function SolutionPage() {
  const [query, setQuery] = useState('');
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSolution = async () => {
    if (!query.trim()) {
      setError('Please enter Query Input');
      return;
    }

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await getSolution(query);
      setSolution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Solution Generator</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Search Solution:
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Please enter text for solution generation"
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

      <Button
        onClick={handleGetSolution}
        disabled={loading}
        variant="primary"
      >
        {loading ? 'Loading...' : 'Get Solution'}
      </Button>

      {error && (
        <Card variant="error" title="Error" style={{ marginTop: '20px' }}>
          <p>{error}</p>
        </Card>
      )}

      {solution && (
        <Card variant="default" title="Result Solution" style={{ marginTop: '20px' }}>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            margin: 0
          }}>
            {JSON.stringify(solution, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
