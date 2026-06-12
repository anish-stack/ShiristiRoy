// lib/therapies.json  ← already exists, just use data

// ─── therepies_action.tsx ───────────────────────────────────────────────────
import React from 'react'
import data from "@/lib/therepies.json"

interface Therapy {
  slug: string
  title: string
  tag: string
  image: string
  bannerImage: string
  metaTitle: string
  metaDescription: string
  shortDescription: string
  definition: string
  heroText: string
  longDescription: string[]
  howItWorks: { title: string; content: string }
  whoCanBenefit: string[]
  commonConcerns: string[]
  techniques: { title: string; description: string }[]
  therapyGoals: string[]
  benefits: { title: string; description: string }[]
  faq: { question: string; answer: string }[]
  quote: { text: string; author: string }
  cta: { title: string; description: string; buttonText: string }
}

const TherapyAction = ({ slug }: { slug: string }) => {
  const therapy = (data as Therapy[]).find((t) => t.slug === slug)
  if (!therapy) return <div style={{ color: '#6b7280', padding: '4rem', textAlign: 'center' }}>Therapy not found.</div>

  return (
    <article style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#faf9f6', color: '#2d2d2d', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${therapy.bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.45) saturate(0.7)',
        }} />
        {/* lavender-to-ivory gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(180,170,210,0.35) 0%, rgba(250,249,246,0.92) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, padding: '4rem 2.5rem 5rem', }}>
          <span style={{
            display: 'inline-block',
            background: '#c8d8c0',
            color: '#2d3d28',
            fontSize: '0.72rem',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '0.35rem 1rem',
            borderRadius: '2px',
            marginBottom: '1.5rem',
          }}>{therapy.tag}</span>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#1a1a2e',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}>{therapy.title}</h1>
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
            lineHeight: 1.7,
            color: '#3a3a5c',
            maxWidth: 680,
            fontStyle: 'italic',
            fontWeight: 400,
          }}>{therapy.heroText}</p>
        </div>
      </section>

      {/* ── DEFINITION BAND ── */}
      <section style={{
        background: 'linear-gradient(135deg, #e8e4f0 0%, #dce8e4 100%)',
        padding: '4rem 2.5rem',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            lineHeight: 1.8,
            color: '#2d2d4e',
            fontWeight: 400,
            borderLeft: '3px solid #8a7aaa',
            paddingLeft: '1.8rem',
          }}>{therapy.definition}</p>
        </div>
      </section>

      {/* ── LONG DESCRIPTION ── */}
      <section style={{ padding: '5rem 2.5rem', maxWidth: 800, margin: '0 auto' }}>
        {therapy.longDescription.map((para, i) => (
          <p key={i} style={{
            fontSize: '1.1rem',
            lineHeight: 1.9,
            color: '#3a3a4a',
            marginBottom: '1.8rem',
            fontWeight: 400,
          }}>{para}</p>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        background: '#eef2f0',
        padding: '5rem 2.5rem',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 300,
            color: '#1a1a2e',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>{therapy.howItWorks.title}</h2>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.85,
            color: '#3a3a5a',
          }}>{therapy.howItWorks.content}</p>
        </div>
      </section>

      {/* ── TECHNIQUES ── */}
      <section style={{ padding: '5rem 2.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 300,
            color: '#1a1a2e',
            marginBottom: '3rem',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>Therapeutic Techniques</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {therapy.techniques.map((t, i) => {
              const colors = ['#e8e4f0','#dce8f0','#e4eede','#f0ece0','#dde4ea']
              return (
                <div key={i} style={{
                  background: colors[i % colors.length],
                  borderRadius: '4px',
                  padding: '2rem',
                }}>
                  <div style={{
                    width: 32, height: 2,
                    background: '#8a7aaa',
                    marginBottom: '1rem',
                  }} />
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#1a1a2e',
                    marginBottom: '0.75rem',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{t.title}</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: '#4a4a6a',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{t.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ background: '#f5f3f8', padding: '5rem 2.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 300,
            color: '#1a1a2e',
            marginBottom: '3rem',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>Why This Approach</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {therapy.benefits.map((b, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #ddd8ea',
                borderRadius: '4px',
                padding: '2rem',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#8a7aaa',
                  marginBottom: '0.6rem',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.03em',
                }}>{b.title}</h3>
                <p style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  color: '#5a5a7a',
                  fontFamily: "'DM Sans', sans-serif",
                }}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO CAN BENEFIT + GOALS ── */}
      <section style={{ padding: '5rem 2.5rem' }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
        }}>
          <div>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 300,
              color: '#1a1a2e',
              marginBottom: '1.5rem',
            }}>Who Can Benefit</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {therapy.whoCanBenefit.map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.95rem',
                  color: '#4a4a6a',
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: '#7a9e8a', marginTop: '0.2rem', flexShrink: 0 }}>◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 300,
              color: '#1a1a2e',
              marginBottom: '1.5rem',
            }}>Therapy Goals</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {therapy.therapyGoals.map((g, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.95rem',
                  color: '#4a4a6a',
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: '#8a7aaa', marginTop: '0.2rem', flexShrink: 0 }}>◆</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── COMMON CONCERNS TAGS ── */}
      <section style={{ background: '#eef2f0', padding: '4rem 2.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 300,
            color: '#1a1a2e',
            marginBottom: '2rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
          }}>Common Concerns Addressed</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {therapy.commonConcerns.map((c, i) => (
              <span key={i} style={{
                background: '#fff',
                border: '1px solid #c8d8c0',
                borderRadius: '2px',
                padding: '0.4rem 1.1rem',
                fontSize: '0.85rem',
                color: '#3a4a36',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.04em',
              }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '5rem 2.5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 300,
            color: '#1a1a2e',
            marginBottom: '3rem',
            textAlign: 'center',
          }}>Frequently Asked Questions</h2>
          {therapy.faq.map((f, i) => (
            <div key={i} style={{
              borderTop: '1px solid #ddd8ea',
              padding: '2rem 0',
            }}>
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#2d2d4e',
                marginBottom: '0.75rem',
                fontFamily: "'DM Sans', sans-serif",
              }}>{f.question}</h3>
              <p style={{
                fontSize: '0.98rem',
                lineHeight: 1.8,
                color: '#5a5a7a',
                fontFamily: "'DM Sans', sans-serif",
              }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section style={{
        background: 'linear-gradient(135deg, #c8c0d8 0%, #b8ccc8 100%)',
        padding: '5rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#1a1a2e',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}>"{therapy.quote.text}"</p>
          <span style={{
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#3a3a5a',
            fontFamily: "'DM Sans', sans-serif",
          }}>— {therapy.quote.author}</span>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: '#1a1a2e',
        padding: '6rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 300,
            color: '#e8e4f0',
            marginBottom: '1.2rem',
            lineHeight: 1.3,
          }}>{therapy.cta.title}</h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: '#a0a0c0',
            marginBottom: '2.5rem',
            fontFamily: "'DM Sans', sans-serif",
          }}>{therapy.cta.description}</p>
          <a href="/book" style={{
            display: 'inline-block',
            background: 'transparent',
            border: '1px solid #c8c0d8',
            color: '#e8e4f0',
            padding: '1rem 2.5rem',
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '2px',
            transition: 'background 0.2s, color 0.2s',
          }}
            // onMouseEnter={e => {
            //   (e.currentTarget as HTMLAnchorElement).style.background = '#c8c0d8'
            //   ;(e.currentTarget as HTMLAnchorElement).style.color = '#1a1a2e'
            // }}
            // onMouseLeave={e => {
            //   (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
            //   ;(e.currentTarget as HTMLAnchorElement).style.color = '#e8e4f0'
            // }}
          >{therapy.cta.buttonText}</a>
        </div>
      </section>

    </article>
  )
}

export default TherapyAction