'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageCircle, Instagram, ArrowRight, Loader2 } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';

const contacts = [
  { icon: Mail, label: 'Email', value: 'contact@awarenesswithroy.com', href: 'mailto:contact@awarenesswithroy.com' },
  { icon: Phone, label: 'Phone (India)', value: '+91 8448 009 694', href: 'tel:+918448009694' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+1 647 500 8349', href: 'https://wa.me/16475008349' },
  { icon: Instagram, label: 'Instagram', value: '@awakenwithsrishti', href: 'https://instagram.com/awakenwithsrishti' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast('Please fill required fields.', 'error');
    setLoading(true);
    try {
      await publicApi.contact(form);
      setDone(true);
      toast('Message sent! We will be in touch soon.', 'success');
    } catch (err: any) {
      toast(err.message ?? 'Could not send message. Please try again.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <>
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-[#EDE8F8]/40 to-brand-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-tag mb-4">Reach out</p>
          <h1 className="font-serif text-5xl text-brand-ink mb-6">Get in touch</h1>
          <p className="text-lg text-brand-ink/60">Have questions or ready to book? I'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl text-brand-ink">Contact details</h2>
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-2xl bg-brand-lavender/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-lavender/20 transition-colors">
                  <Icon size={18} className="text-brand-lavender" />
                </div>
                <div>
                  <p className="text-xs text-brand-ink/40 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-brand-ink group-hover:text-brand-lavender transition-colors">{value}</p>
                </div>
              </a>
            ))}

            <div className="card-soft mt-8">
              <h3 className="font-serif text-lg text-brand-ink mb-2">Session enquiry?</h3>
              <p className="text-sm text-brand-ink/60 mb-4">Book directly via the booking flow or WhatsApp us for a quick response.</p>
              <Link href="/book" className="btn-primary text-sm py-2 px-4">Book a session <ArrowRight size={14} /></Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {done ? (
              <div className="card-soft text-center py-16">
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="font-serif text-2xl text-brand-ink mb-2">Thank you</h3>
                <p className="text-brand-ink/60">Your message has been received. I'll be in touch within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="card-soft space-y-5">
                <h2 className="font-serif text-2xl text-brand-ink mb-1">Send a message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-ink/50 mb-1.5">Name <span className="text-brand-lavender">*</span></label>
                    <input name="name" value={form.name} onChange={onChange} required
                      className="w-full border border-brand-lavender/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-lavender transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-ink/50 mb-1.5">Email <span className="text-brand-lavender">*</span></label>
                    <input name="email" type="email" value={form.email} onChange={onChange} required
                      className="w-full border border-brand-lavender/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-lavender transition-colors" placeholder="you@email.com" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-ink/50 mb-1.5">Phone (optional)</label>
                    <input name="phone" value={form.phone} onChange={onChange}
                      className="w-full border border-brand-lavender/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-lavender transition-colors" placeholder="+91 ..." />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-ink/50 mb-1.5">Subject</label>
                    <select name="subject" value={form.subject} onChange={onChange}
                      className="w-full border border-brand-lavender/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-lavender transition-colors">
                      <option value="">Select...</option>
                      <option>Booking enquiry</option>
                      <option>Service information</option>
                      <option>General question</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-brand-ink/50 mb-1.5">Message <span className="text-brand-lavender">*</span></label>
                  <textarea name="message" rows={5} value={form.message} onChange={onChange} required
                    className="w-full border border-brand-lavender/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-lavender transition-colors resize-none"
                    placeholder="Tell me a little about what brings you here..." />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send message <ArrowRight size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
