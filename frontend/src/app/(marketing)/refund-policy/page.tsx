import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Srishti Roy',
  description:
    'Refund and cancellation policy for counselling sessions.',
};

export default function RefundPolicyPage() {
  return (
    <main className="bg-[#F8F6F2] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#9A8F80] mb-4">
            Legal
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#2D2A26] mb-6">
            Refund Policy
          </h1>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-[#ECE6DC] p-8 md:p-14 prose prose-lg max-w-none prose-headings:text-[#2D2A26] prose-p:text-[#5F574D] prose-li:text-[#5F574D] prose-strong:text-[#2D2A26]">
          <h2>Cancellation Policy</h2>
          <p>
            Appointments cancelled at least 24 hours before the session may be
            eligible for rescheduling or refund.
          </p>

          <h2>Late Cancellation</h2>
          <p>
            Sessions cancelled within 24 hours of the appointment are generally
            non-refundable.
          </p>

          <h2>No Show</h2>
          <p>
            If a client does not attend the session without prior notice, the
            payment may be forfeited.
          </p>

          <h2>Refund Timeline</h2>
          <p>
            Approved refunds are processed within 5–10 business days depending
            on payment provider timelines.
          </p>

          <h2>Technical Issues</h2>
          <p>
            In case of verified technical issues from our side, sessions may be
            rescheduled or refunded.
          </p>
        </div>
      </div>
    </main>
  );
}