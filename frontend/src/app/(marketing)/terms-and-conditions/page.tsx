import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Srishti Roy',
  description:
    'Terms and conditions for therapy and counselling services.',
};

export default function TermsPage() {
  return (
    <main className="bg-[#F8F6F2] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#9A8F80] mb-4">
            Legal
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#2D2A26] mb-6">
            Terms & Conditions
          </h1>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-[#ECE6DC] p-8 md:p-14 prose prose-lg max-w-none prose-headings:text-[#2D2A26] prose-p:text-[#5F574D] prose-li:text-[#5F574D] prose-strong:text-[#2D2A26]">
          <h2>Acceptance of Terms</h2>
          <p>
            By using this website or booking a session, you agree to these
            terms and conditions.
          </p>

          <h2>Appointments</h2>
          <p>
            Sessions are scheduled based on therapist availability and confirmed
            after successful payment.
          </p>

          <h2>Client Responsibility</h2>
          <p>
            Clients are expected to provide accurate information and maintain
            respectful communication.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website including text, branding, graphics, and
            resources belongs to Srishti Roy unless otherwise stated.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Therapy services are supportive in nature and outcomes may vary for
            every individual.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            Terms may be updated periodically without prior notice.
          </p>
        </div>
      </div>
    </main>
  );
}