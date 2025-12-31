export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#f5f5f5',
      borderTop: '1px solid #e0e0e0',
      padding: '2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <p style={{ margin: 0, color: '#666' }}>
            © {currentYear} Knowledge Researcher. All rights reserved.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1.5rem'
        }}>
          <a
            href="/about"
            style={{
              color: '#666',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            About
          </a>
          <a
            href="/contact"
            style={{
              color: '#666',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Contact
          </a>
          <a
            href="/privacy"
            style={{
              color: '#666',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
