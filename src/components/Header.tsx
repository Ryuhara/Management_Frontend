import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      backgroundColor: '#0070f3',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none'
        }}>
          Knowledge Researcher
        </Link>

        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2rem',
          margin: 0,
          padding: 0
        }}>
          <li>
            <Link href="/" style={{
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/app/solution" style={{
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>
              Solution
            </Link>
          </li>
          <li>
            <Link href="/app/upload" style={{
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>
              Upload
            </Link>
          </li>
          <li>
            <Link href="/app/embedding" style={{
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>
              Embedding
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
