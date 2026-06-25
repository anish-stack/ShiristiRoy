
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Srishti Roy',
  description:
    'Read the privacy policy for Srishti Roy counselling and therapy services.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F8F6F2] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#9A8F80] mb-4">
            Legal
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#2D2A26] mb-6">
            Privacy Policy
          </h1>

          <p className="text-[#6E665D] text-lg leading-8 max-w-2xl mx-auto">
            Your privacy and emotional safety are important to us.
          </p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-[#ECE6DC] p-8 md:p-14 prose prose-lg max-w-none prose-headings:text-[#2D2A26] prose-p:text-[#5F574D] prose-li:text-[#5F574D] prose-strong:text-[#2D2A26]">
          <h2>Information We Collect</h2>
          <p>
            We may collect personal details such as your name, email address,
            phone number, appointment details, and session preferences.
          </p>

          <h2>How We Use Information</h2>
          <ul>
            <li>To manage therapy appointments</li>
            <li>To provide counselling services</li>
            <li>To improve user experience</li>
            <li>To communicate updates and support</li>
          </ul>

          <h2>Confidentiality</h2>
          <p>
            Therapy sessions and personal information are handled with strict
            confidentiality except where disclosure is legally required.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website may use cookies and analytics tools to improve browsing
            experience.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Payment gateways, scheduling tools, and communication platforms may
            process limited information securely.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related concerns, contact us at
            contact@awarenesswithroy.com.
          </p>
        </div>
      </div>
    </main>
  );
}
    