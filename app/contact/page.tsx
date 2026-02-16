import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | CompareMyMedication",
  description: "Get in touch with CompareMyMedication. We're here to help with your medication comparison questions.",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Contact Us</h1>
        <p className="legal-updated">We'd love to hear from you!</p>

        <section className="legal-section">
          <h2>Get in Touch</h2>
          <p>
            Have questions about medication comparisons? Need help using our website? 
            Want to report an issue or provide feedback? We're here to help!
          </p>
        </section>

        <section className="legal-section">
          <h2>Email Us</h2>
          <ul>
            <li><strong>General Inquiries:</strong> info@comparemymedication.com</li>
            <li><strong>Support:</strong> support@comparemymedication.com</li>
            <li><strong>Privacy Questions:</strong> privacy@comparemymedication.com</li>
            <li><strong>Business & Partnerships:</strong> business@comparemymedication.com</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Response Time</h2>
          <p>
            We strive to respond to all inquiries within 24-48 hours during business days. 
            Please note that we may experience higher volumes during peak times.
          </p>
        </section>

        <section className="legal-section">
          <h2>Before You Contact Us</h2>
          <p>Please review our frequently asked questions:</p>
          <ul>
            <li><strong>Is this medical advice?</strong> No, we provide informational comparisons only. Always consult your healthcare provider.</li>
            <li><strong>Are prices accurate?</strong> Prices are sourced from third-party providers and may vary. Check with pharmacies for current pricing.</li>
            <li><strong>How do I compare medications?</strong> Use our search tool on the homepage to compare two medications side-by-side.</li>
            <li><strong>Can I suggest medications to add?</strong> Yes! Email us with your suggestions.</li>
          </ul>
        </section>

        <section className="legal-section legal-disclaimer">
          <h2>Important Notice</h2>
          <p>
            <strong>Medical Emergencies:</strong> If you are experiencing a medical emergency, 
            please call 911 or go to your nearest emergency room immediately. Do not use this 
            contact form for urgent medical situations.
          </p>
          <p>
            <strong>Not Medical Advice:</strong> We cannot provide medical advice, diagnoses, 
            or treatment recommendations. Please consult with a qualified healthcare professional 
            for all medical decisions.
          </p>
        </section>
      </div>
    </main>
  );
}
