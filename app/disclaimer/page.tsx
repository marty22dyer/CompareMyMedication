import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Disclaimer | CompareMyMedication",
  description: "Important medical disclaimer for CompareMyMedication. Read before using our medication comparison service.",
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Medical Disclaimer</h1>
        <p className="legal-updated">Last Updated: February 15, 2026</p>

        <section className="legal-section legal-disclaimer">
          <h2>⚠️ Important Notice</h2>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#c53030' }}>
            CompareMyMedication is an informational website only. We do not provide medical advice, 
            diagnosis, or treatment. The information on this website should not be used as a substitute 
            for professional medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section className="legal-section">
          <h2>1. Not Medical Advice</h2>
          <p>
            The content on CompareMyMedication, including but not limited to medication comparisons, 
            drug information, pricing data, and related materials, is provided for informational and 
            educational purposes only. This information is not intended to be a substitute for 
            professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            <strong>Always seek the advice of your physician or other qualified health provider</strong> 
            with any questions you may have regarding a medical condition, medication, or treatment. 
            Never disregard professional medical advice or delay in seeking it because of something 
            you have read on this website.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. No Doctor-Patient Relationship</h2>
          <p>
            Use of this website and the information contained herein does not create a doctor-patient 
            relationship between you and CompareMyMedication, its owners, operators, or contributors. 
            We are not healthcare providers and do not offer medical services.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Medication Information</h2>
          <p>
            The medication information provided on this website is compiled from various sources and 
            is believed to be accurate at the time of publication. However:
          </p>
          <ul>
            <li>Drug information may change over time</li>
            <li>Individual responses to medications vary</li>
            <li>Not all drug interactions, side effects, or contraindications may be listed</li>
            <li>Information may not reflect the most current research or FDA updates</li>
          </ul>
          <p>
            <strong>Always consult your healthcare provider or pharmacist</strong> about the 
            appropriateness of any medication for your specific situation.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Pricing Information</h2>
          <p>
            Medication prices displayed on our website are provided by third-party sources and 
            affiliate partners (such as GoodRx). These prices:
          </p>
          <ul>
            <li>Are estimates and may not reflect actual pharmacy prices</li>
            <li>Can vary by location, pharmacy, and insurance coverage</li>
            <li>May change without notice</li>
            <li>Should be verified directly with pharmacies before purchase</li>
          </ul>
          <p>
            We are not responsible for pricing accuracy or availability of medications at any pharmacy.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Medical Emergencies</h2>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#c53030' }}>
            If you think you may have a medical emergency, call your doctor or 911 immediately. 
            Do not rely on information from this website in emergency situations.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Medication Changes</h2>
          <p>
            <strong>Never start, stop, or change your medication regimen without consulting your healthcare provider.</strong> 
            Doing so can be dangerous and may result in serious health consequences. All medication 
            decisions should be made in consultation with a qualified healthcare professional who 
            knows your medical history.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Third-Party Links and Affiliates</h2>
          <p>
            Our website contains links to third-party websites and services, including affiliate 
            partners like GoodRx. We are not responsible for:
          </p>
          <ul>
            <li>The content, accuracy, or practices of third-party websites</li>
            <li>Products or services offered by third parties</li>
            <li>Privacy policies of external websites</li>
            <li>Transactions conducted through affiliate links</li>
          </ul>
          <p>
            We receive compensation when you use certain affiliate links, but this does not influence 
            the information we provide or constitute an endorsement of any specific product or service.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Accuracy and Completeness</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no representations 
            or warranties of any kind, express or implied, about:
          </p>
          <ul>
            <li>The completeness, accuracy, reliability, or suitability of the information</li>
            <li>The availability or functionality of the website</li>
            <li>That the website will be error-free or uninterrupted</li>
          </ul>
          <p>
            Any reliance you place on information from this website is strictly at your own risk.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, CompareMyMedication, its owners, operators, 
            contributors, and affiliates shall not be liable for any direct, indirect, incidental, 
            consequential, or punitive damages arising from:
          </p>
          <ul>
            <li>Your use of or inability to use this website</li>
            <li>Any information, products, or services obtained through this website</li>
            <li>Decisions made based on information from this website</li>
            <li>Errors, omissions, or inaccuracies in the content</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. User Responsibility</h2>
          <p>
            By using this website, you acknowledge and agree that:
          </p>
          <ul>
            <li>You are responsible for your own health decisions</li>
            <li>You will consult with healthcare professionals before making medication decisions</li>
            <li>You understand the limitations of the information provided</li>
            <li>You will not use this website as a substitute for professional medical care</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>11. FDA and Regulatory Compliance</h2>
          <p>
            This website is not affiliated with, endorsed by, or sponsored by the U.S. Food and 
            Drug Administration (FDA) or any other regulatory agency. Information about medications 
            should not be considered FDA-approved medical advice.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. International Users</h2>
          <p>
            This website is intended for users in the United States. Medication availability, 
            regulations, and pricing may differ in other countries. If you are accessing this 
            website from outside the United States, please consult local healthcare providers 
            and regulatory authorities.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Changes to This Disclaimer</h2>
          <p>
            We reserve the right to update or modify this disclaimer at any time without prior 
            notice. Your continued use of the website after any changes constitutes acceptance 
            of those changes.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Contact Information</h2>
          <p>
            If you have questions about this disclaimer, please contact us at:
          </p>
          <ul>
            <li>Email: info@comparemymedication.com</li>
            <li>Visit our <a href="/contact">Contact Page</a></li>
          </ul>
        </section>

        <section className="legal-section legal-disclaimer">
          <h2>Summary</h2>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>
            CompareMyMedication provides information only. We do not provide medical advice. 
            Always consult your healthcare provider before making any medication decisions. 
            Use this website at your own risk.
          </p>
        </section>
      </div>
    </main>
  );
}
