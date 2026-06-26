import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceApi, type Service } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Therapy Services",
  description:
    "Individual counselling, family therapy, online sessions, Adlerian-integrative therapy, emotional regulation, and young adult support with Srishti Roy.",
  path: "/services",
});
export const revalidate = 3600;

const icons: Record<string, string> = {
  "individual-counselling": "🪷",
  "family-therapy": "🌿",
  "online-therapy": "💻",
  "adlerian-integrative-therapy": "🌀",
  "emotional-regulation": "🫧",
  "young-adult-support": "✨",
};

export default async function ServicesPage() {
  let services: any = [];
  try {
    services = await serviceApi.list();
  } catch {}

  return (
    <>
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-[#EDE8F8]/40 to-brand-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-tag mb-4">What I offer</p>
          <h1 className="font-serif text-5xl sm:text-6xl text-brand-ink mb-6">
            Therapy services
          </h1>
          <p className="text-lg text-brand-ink/60 leading-relaxed">
            Each service is tailored to meet you where you are, creating space
            for understanding, healing, and growth.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(services.length > 0
              ? services
              : [
                  {
                    _id: "1",
                    slug: "individual-counselling",
                    name: "Individual Counselling",
                    shortDesc:
                      "One-on-one sessions for emotional well-being and personal growth.",
                    description: "",
                    durationMin: 50,
                    price: { amount: 2500, currency: "INR" },
                    modes: ["online", "in_person"],
                    category: "individual",
                  },
                  {
                    _id: "2",
                    slug: "family-therapy",
                    name: "Family Therapy",
                    shortDesc:
                      "Improve communication and strengthen family dynamics.",
                    description: "",
                    durationMin: 75,
                    price: { amount: 3500, currency: "INR" },
                    modes: ["online", "in_person"],
                    category: "family",
                  },
                  {
                    _id: "3",
                    slug: "online-therapy",
                    name: "Online Therapy",
                    shortDesc:
                      "Secure video counselling from anywhere in the world.",
                    description: "",
                    durationMin: 50,
                    price: { amount: 2500, currency: "INR" },
                    modes: ["online"],
                    category: "individual",
                  },
                  {
                    _id: "4",
                    slug: "workshops",
                    name: "Workshops",
                    shortDesc:
                      "Interactive workshops focused on mental well-being, emotional resilience, and personal growth.",
                    description: "",
                    durationMin: 120, // ya 0 agar duration nahi dikhana
                    price: { amount: 0, currency: "INR" }, // ya actual price
                    modes: ["online", "in_person"],
                    category: "workshop",
                  },
                ]
            ).map((s: Service) => (
              <div
                key={s._id}
                className="card-soft group hover:shadow-md hover:border-brand-lavender/25 transition-all duration-300 flex flex-col"
              >
                <div className="text-4xl mb-5">{icons[s.slug] ?? "🌸"}</div>
                <h2 className="font-serif text-2xl text-brand-ink mb-3 group-hover:text-brand-lavender transition-colors">
                  {s.name}
                </h2>
                <p className="text-sm text-brand-ink/65 leading-relaxed flex-1">
                  {s.shortDesc}
                </p>

                <div className="mt-6 pt-5 border-t border-brand-lavender/10 flex items-center justify-between">
                  <div>
                    {s.price?.amount > 0 && (
                      <p className="text-brand-lavender font-medium text-sm">
                        ₹{s.price.amount.toLocaleString("en-IN")}
                      </p>
                    )}
                    <p className="text-xs text-brand-ink/40">
                      {s.durationMin} min · {s.modes?.join(" & ")}
                    </p>
                  </div>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-brand-lavender hover:underline text-sm font-medium flex items-center gap-1"
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
            <div className="card-soft group hover:shadow-md hover:border-brand-lavender/25 transition-all duration-300 flex flex-col">
              <div className="text-4xl mb-5">🎓</div>

              <h2 className="font-serif text-2xl text-brand-ink mb-3 group-hover:text-brand-lavender transition-colors">
                Workshops
              </h2>

              <p className="text-sm text-brand-ink/65 leading-relaxed flex-1">
                Interactive workshops focused on mental well-being, emotional
                resilience, personal growth, and practical life skills.
              </p>

              <div className="mt-6 pt-5 border-t border-brand-lavender/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-ink/40">
                    Online & In-person
                  </p>
                </div>

                <Link
                  href="/services/workshops"
                  className="text-brand-lavender hover:underline text-sm font-medium flex items-center gap-1"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="section bg-[#EDE8F8]/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-brand-ink mb-4">
            Not sure where to start?
          </h2>
          <p className="text-brand-ink/60 mb-8">
            Reach out and we can discuss which service best fits your needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/book" className="btn-primary">
              Book a session <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-outline">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
