export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '24px' }}>About CompareMyMedication</h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#4a5568' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#1a202c' }}>Our Mission</h2>
        <p>CompareMyMedication was created to help people make informed decisions about their prescription medications. We believe everyone deserves access to clear, accurate information about drug effectiveness, side effects, and pricing - without hidden fees or complicated sign-ups.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#1a202c' }}>Why We Built This</h2>
        <p>Prescription drug costs in America are rising faster than ever. Many people struggle to afford their medications or don't know that cheaper alternatives exist. We built CompareMyMedication to solve this problem by providing:</p>
        <ul style={{ marginLeft: '24px', marginTop: '12px' }}>
          <li>Side-by-side medication comparisons</li>
          <li>Real pricing data from pharmacies</li>
          <li>FDA-verified drug information</li>
          <li>Generic and alternative medication suggestions</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#1a202c' }}>Our Data Sources</h2>
        <p>All medication information on our site comes from official, verified sources:</p>
        <ul style={{ marginLeft: '24px', marginTop: '12px' }}>
          <li><strong>FDA Database:</strong> Drug labels, indications, warnings, and adverse events</li>
          <li><strong>Pharmacy Networks:</strong> Real-time pricing data from thousands of pharmacies</li>
          <li><strong>Medical Literature:</strong> Peer-reviewed studies and clinical trials</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#1a202c' }}>Our Commitment to Privacy</h2>
        <p>Your privacy is our top priority. We do not:</p>
        <ul style={{ marginLeft: '24px', marginTop: '12px' }}>
          <li>Require sign-ups or accounts</li>
          <li>Collect personal medical information</li>
          <li>Share your data with third parties</li>
          <li>Track individual medication searches</li>
        </ul>
        <p style={{ marginTop: '12px' }}>We only use Google Analytics to understand general site usage and improve our service.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#1a202c' }}>Who We Are</h2>
        <p>CompareMyMedication is owned and operated by MAD Designs LLC, a technology company focused on making healthcare information more accessible and affordable for everyone.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '32px', marginBottom: '16px', color: '#1a202c' }}>Contact Us</h2>
        <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>
        <p style={{ marginTop: '12px' }}>
          Email: <a href="mailto:support@comparemymedication.com" style={{ color: '#667eea', textDecoration: 'underline' }}>support@comparemymedication.com</a>
        </p>

        <div style={{ marginTop: '48px', padding: '24px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>
            <strong>Medical Disclaimer:</strong> CompareMyMedication provides general information for educational purposes only. This information is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or qualified healthcare provider before making any changes to your medication regimen.
          </p>
        </div>
      </div>
    </div>
  );
}
