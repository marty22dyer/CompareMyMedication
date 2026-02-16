import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CompareMyMedication",
  description: "Privacy Policy for CompareMyMedication - Learn how we collect, use, and protect your information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last Updated: February 15, 2026</p>

        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to CompareMyMedication ("we," "our," or "us"), owned and operated by MAD Designs LLC. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website comparemymedication.com.
          </p>
          <p>
            Please read this Privacy Policy carefully. By using our website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <p>We may collect information that you voluntarily provide to us, including:</p>
          <ul>
            <li>Email address (if you subscribe to our newsletter)</li>
            <li>Search queries and medication comparisons you perform</li>
            <li>Feedback or comments you submit</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect certain information, including:</p>
          <ul>
            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, search queries</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type, IP address</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track activity and improve user experience</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li>To provide, maintain, and improve our website</li>
            <li>To understand how users interact with our website</li>
            <li>To send you newsletters and marketing communications (with your consent)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To detect, prevent, and address technical issues or fraudulent activity</li>
            <li>To analyze usage patterns and optimize user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.
          </p>
          
          <h3>Types of Cookies We Use:</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website (e.g., Google Analytics)</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track ad performance</li>
          </ul>

          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Third-Party Services</h2>
          <p>We may use third-party services that collect, monitor, and analyze information:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Tracks and reports website traffic</li>
            <li><strong>GoodRx:</strong> Provides medication pricing information (affiliate links)</li>
            <li><strong>Advertising Networks:</strong> May display ads on our website</li>
          </ul>
          <p>
            These third parties have their own privacy policies. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Affiliate Links and Monetization</h2>
          <p>
            Our website contains affiliate links to third-party services such as GoodRx. When you click on these links and make a purchase or sign up for a service, we may receive a commission. This does not affect the price you pay.
          </p>
          <p>
            We only recommend products and services that we believe will provide value to our users. However, we are not responsible for the content, products, or services offered by third parties.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time</li>
            <li><strong>Do Not Track:</strong> We currently do not respond to Do Not Track signals</li>
          </ul>
          <p>
            To exercise these rights, please contact us at the email address provided below.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. International Users</h2>
          <p>
            Our website is operated in the United States. If you are accessing our website from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located. By using our website, you consent to such transfer.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>By email: privacy@comparemymedication.com</li>
            <li>By visiting our Contact page</li>
          </ul>
        </section>

        <section className="legal-section legal-disclaimer">
          <h2>Medical Disclaimer</h2>
          <p>
            CompareMyMedication is an informational website only. We do not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making any decisions about medications or medical treatments. The information on this website should not be used as a substitute for professional medical advice.
          </p>
        </section>
      </div>
    </main>
  );
}
