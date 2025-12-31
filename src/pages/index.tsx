import Link from 'next/link';
import Button from '../components/Button';

export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Knowledge Researcher</h1>
      <p>Use this application to explore various knowledge management features.</p>

      <div style={{ marginTop: '40px' }}>
        <h2>Available Features:</h2>

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/app/solution" style={{ textDecoration: 'none' }}>
            <Button variant="primary">
              Solution Generator
            </Button>
          </Link>

          <Link href="/app/upload" style={{ textDecoration: 'none' }}>
            <Button variant="primary">
              Document Upload
            </Button>
          </Link>

          <Link href="/app/embedding" style={{ textDecoration: 'none' }}>
            <Button variant="primary">
              Document Embedding
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
