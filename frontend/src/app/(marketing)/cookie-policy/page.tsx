
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Srishti Roy',
  description:
    'Learn how cookies are used on our website.',
};

export default function CookiePolicyPage() {
  return (
    <main className="bg-[#F8F6F2] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#9A8F80] mb-4">
            Legal
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#2D2A26] mb-6">
            Cookie Policy
          </h1>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-[#ECE6DC] p-8 md:p-14 prose prose-lg max-w-none prose-headings:text-[#2D2A26] prose-p:text-[#5F574D] prose-li:text-[#5F574D] prose-strong:text-[#2D2A26]">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device to improve your
            browsing experience.
          </p>

          <h2>How We Use Cookies</h2>
          <ul>
            <li>Website functionality</li>
            <li>Analytics and performance tracking</li>
            <li>Remembering user preferences</li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>
            Some third-party services such as analytics or payment systems may
            place cookies on your device.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            You can disable cookies through your browser settings at any time.
          </p>
        </div>
      </div>
    </main>
  );
}