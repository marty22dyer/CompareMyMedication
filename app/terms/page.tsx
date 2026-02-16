import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | CompareMyMedication",
  description: "Terms of Service for CompareMyMedication - Read our terms and conditions for using our website.",
  robots: { index: true, follow: true },
};

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last Updated: February 15, 2026</p>

        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to CompareMyMedication, owned and operated by MAD Designs LLC. By accessing or using our website at comparemymedication.com (the "Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Website.
          </p>
          <p>
            We reserve the right to modify these Terms at any time. Your continued use of the Website after any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Description of Service</h2>
          <p>
            CompareMyMedication is an informational website that provides:
          </p>
          <ul>
            <li>Medication comparison tools</li>
            <li>Drug information and facts</li>
            <li>Generic and brand name medication information</li>
            <li>Links to third-party pricing services</li>
            <li>Educational content about medications</li>
          </ul>
          <p>
            <strong>Our Website is for informational purposes only and does not provide medical advice, diagnosis, or treatment.</strong>
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Medical Disclaimer</h2>
          <p className="legal-warning">
            <strong>IMPORTANT: THIS WEBSITE DOES NOT PROVIDE MEDICAL ADVICE</strong>
          </p>
          <p>
            The information provided on CompareMyMedication is for general informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. You should:
          </p>
          <ul>
            <li><strong>Always seek the advice of your physician</strong> or other qualified health provider with any questions you may have regarding a medical condition or medication</li>
            <li><strong>Never disregard professional medical advice</strong> or delay in seeking it because of something you have read on this Website</li>
            <li><strong>Never stop, start, or change medications</strong> without consulting your healthcare provider</li>
            <li><strong>Call 911 or seek emergency medical attention</strong> if you think you may have a medical emergency</li>
          </ul>
          <p>
            CompareMyMedication does not recommend or endorse any specific medications, treatments, products, or procedures. We are not responsible for any healthcare decisions you make based on information found on this Website.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind about:
          </p>
          <ul>
            <li>The completeness, accuracy, reliability, or availability of the information</li>
            <li>The suitability of the information for any particular purpose</li>
            <li>The currency of drug information, pricing, or availability</li>
          </ul>
          <p>
            Drug information, pricing, and availability are subject to change. Always verify information with your healthcare provider and pharmacy.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any portion of the Website</li>
            <li>Interfere with or disrupt the Website or servers</li>
            <li>Use automated systems (bots, scrapers) to access the Website without permission</li>
            <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Website without express written permission</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
            <li>Upload or transmit viruses or malicious code</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Intellectual Property Rights</h2>
          <p>
            The Website and its original content, features, and functionality are owned by CompareMyMedication and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            You may not modify, reproduce, distribute, create derivative works, publicly display, or exploit any content from the Website without our express written permission.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Third-Party Links and Services</h2>
          <p>
            Our Website contains links to third-party websites and services, including but not limited to:
          </p>
          <ul>
            <li>GoodRx and other pharmacy pricing services</li>
            <li>Pharmaceutical manufacturer websites</li>
            <li>Healthcare information resources</li>
            <li>Advertising partners</li>
          </ul>
          <p>
            We are not responsible for the content, privacy policies, or practices of any third-party websites or services. Your use of third-party websites is at your own risk and subject to their terms and conditions.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Affiliate Relationships</h2>
          <p>
            CompareMyMedication participates in affiliate marketing programs. This means we may earn a commission when you click on certain links and make a purchase or sign up for services. These affiliate relationships include:
          </p>
          <ul>
            <li>GoodRx affiliate program</li>
            <li>Other pharmacy and healthcare service affiliates</li>
          </ul>
          <p>
            Our affiliate relationships do not influence the information we provide. We strive to provide objective, accurate information regardless of affiliate status.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE WEBSITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy, reliability, or completeness of information</li>
            <li>Uninterrupted or error-free operation</li>
          </ul>
          <p>
            We do not warrant that the Website will be secure, free from bugs, viruses, or other harmful components.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, COMPAREMYMEDICATION SHALL NOT BE LIABLE FOR ANY:
          </p>
          <ul>
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or use</li>
            <li>Personal injury or property damage</li>
            <li>Medical complications or adverse health outcomes</li>
            <li>Damages resulting from your use of or inability to use the Website</li>
          </ul>
          <p>
            This limitation applies even if we have been advised of the possibility of such damages. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so these limitations may not apply to you.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless CompareMyMedication, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
          </p>
          <ul>
            <li>Your use of the Website</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another party</li>
            <li>Any content you submit or transmit through the Website</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>12. Privacy</h2>
          <p>
            Your use of the Website is also governed by our Privacy Policy. Please review our <a href="/privacy">Privacy Policy</a> to understand our practices regarding the collection and use of your information.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the Website immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms.
          </p>
          <p>
            Upon termination, your right to use the Website will immediately cease.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United States and the State of [Your State], without regard to its conflict of law provisions.
          </p>
          <p>
            Any disputes arising from these Terms or your use of the Website shall be resolved in the courts located in [Your County/State].
          </p>
        </section>

        <section className="legal-section">
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
          </p>
        </section>

        <section className="legal-section">
          <h2>16. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and CompareMyMedication regarding your use of the Website and supersede all prior agreements and understandings.
          </p>
        </section>

        <section className="legal-section">
          <h2>17. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <ul>
            <li>By email: legal@comparemymedication.com</li>
            <li>By visiting our Contact page</li>
          </ul>
        </section>

        <section className="legal-section legal-disclaimer">
          <p className="legal-warning">
            <strong>By using CompareMyMedication, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
          </p>
        </section>
      </div>
    </main>
  );
}
