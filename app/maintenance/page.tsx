export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '60px 40px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          fontSize: '72px',
          marginBottom: '20px'
        }}>💊</div>
        
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          color: '#1a202c',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>
          Coming Soon
        </h1>
        
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#667eea',
          marginBottom: '24px'
        }}>
          CompareMyMedication
        </h2>
        
        <p style={{
          fontSize: '18px',
          color: '#4a5568',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          We're working hard to bring you the best medication comparison tool. 
          Compare drug prices, find alternatives, and make informed healthcare decisions.
        </p>
        
        <div style={{
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#2d3748',
            margin: 0,
            fontWeight: '500'
          }}>
            🚀 Launching very soon with comprehensive drug comparisons and pricing information
          </p>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#718096',
          margin: 0
        }}>
          Check back soon or bookmark this page!
        </p>
      </div>
      
      <p style={{
        color: 'white',
        marginTop: '40px',
        fontSize: '14px',
        opacity: 0.9
      }}>
        © 2026 CompareMyMedication. All rights reserved.
      </p>
    </div>
  );
}
