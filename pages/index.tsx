import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Management Frontend</h1>
      <p>Next.js frontend application integrated with backend API</p>

      <div style={{ marginTop: '40px' }}>
        <h2>Available Features:</h2>

        <div style={{ marginTop: '20px' }}>
          <Link
            href="/app/solution"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            Search Solution
          </Link>

          <Link
            href="/app/upload"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            Upload Document
          </Link>

          <Link
            href="/app/embedding"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          >
            Document Embedding
          </Link>
        </div>

        <div style={{ marginTop: '40px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>API Endpoints:</h3>
          <ul>
            <li>
              <strong>GET</strong> <code>/api/solution_service/:code_id</code> - Get Solution by Query
            </li>
            <li>
              <strong>POST</strong> <code>/api/upload_service</code> - Upload Document
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fffacd', borderRadius: '4px' }}>
          <h3>Setup:</h3>
          <ol>
            <li>
              <code>.env.local</code>create file and set the backend URL:
              <pre style={{ backgroundColor: '#fff', padding: '8px', marginTop: '8px', borderRadius: '4px' }}>
                NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
              </pre>
            </li>
            <li>Ensure the backend server is running</li>
            <li>Start the development server: <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
