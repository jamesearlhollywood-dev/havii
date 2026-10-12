'use client'

export const dynamic = 'force-dynamic'

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#0a1e3f',
          color: '#ffffff',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '480px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            RISE USA
          </h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '1.5rem' }}>
            An unexpected error occurred. Please try again, or contact support if the
            problem persists.
          </p>
          {error?.digest && (
            <p style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '1.5rem' }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={retry}
            style={{
              padding: '0.625rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              backgroundColor: '#c8102e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
