import { MouseSpotlight } from "@/components/mouse-spotlight";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Replace with your Calendly link once created.
const CALENDLY_URL = "https://calendly.com/ltlightbourn/30min";

const SHIPPED_PRODUCTS = [
  {
    index: "01",
    name: "AfterCast",
    tagline:
      "AI-powered podcast content repurposing. Episodes become transcripts, highlight clips, and social-ready assets automatically.",
    url: "https://aftercast.io",
    urlLabel: "aftercast.io",
    year: "2025",
    stack: ["Next.js 15", "Supabase", "Stripe", "Claude API"],
  },
  {
    index: "02",
    name: "Decksmith",
    tagline:
      "MTG Commander deck builder that generates a full 100-card deck from a feeling or theme. Format-aware, synergy-tuned, instantly playable.",
    url: "https://decksmith.gg",
    urlLabel: "decksmith.gg",
    year: "2025",
    stack: ["Next.js 15", "Supabase", "Tailwind", "Claude API"],
  },
];

const STACK_MARQUEE = [
  "Next.js 15",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Supabase",
  "Stripe",
  "Anthropic Claude",
  "Vercel",
  "PostgreSQL",
  "React 19",
];

const PROCESS = [
  {
    phase: "Days 01–02",
    title: "Scoping",
    body: "Kickoff call. Written scope doc. Stack confirmed. Repo and environments provisioned.",
  },
  {
    phase: "Days 03–12",
    title: "Building",
    body: "Daily Loom updates. Staging URL by day 5. Core features locked by day 10.",
  },
  {
    phase: "Days 13–14",
    title: "Launch",
    body: "Production deploy. Handoff doc. Stripe and Supabase access transferred to your accounts. Live URL delivered.",
  },
];

const FAQ = [
  {
    q: "What if it takes longer than 14 days?",
    a: "It won't, because scope is locked on day 2. If something outside the scope comes up, we either cut it or move it to a second engagement.",
  },
  {
    q: "What if I need changes after launch?",
    a: "One revision round is included within 7 days of launch. Additional changes after that are billed at $150/hr.",
  },
  {
    q: "What about hosting costs?",
    a: "You own all hosting accounts: Vercel, Supabase, Stripe, Anthropic. I set them up with you during kickoff. Costs are typically $0–25/mo at MVP stage.",
  },
  {
    q: "Do you do equity deals?",
    a: "No. Cash only. Fixed price, fixed timeline.",
  },
  {
    q: "Can you work in a stack other than Next.js?",
    a: "No. Speed comes from specialization. If you need Rails, Django, or React Native, I'm not the right person.",
  },
  {
    q: "Do you do ongoing maintenance?",
    a: "Not currently. I'll hand off a clean, documented codebase your team or next developer can take over.",
  },
];

const OFFER_CHECKLIST = [
  "Full-stack Next.js 15 application",
  "Authentication via Supabase Auth",
  "Stripe payments and subscriptions",
  "One core AI feature (Claude API)",
  "Deployed live on Vercel",
  "One revision round in week 3",
];

const OFFER_TERMS = [
  "50% deposit at kickoff",
  "50% balance on launch day",
  "Scope locked on day 2",
  "Daily Loom updates",
  "Codebase fully transferred at launch",
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f1e8]">
      {/* ═══════════════════════════════════════════════════════════
          NAV
          ═══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#c5ff3e]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a8a298]">
              LT Lightbourn
            </span>
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic group relative hidden items-center gap-2 rounded-full border border-[#1f1d1a] bg-[#0f0f0f]/60 px-4 py-2 text-[11px] font-medium tracking-wide backdrop-blur-md transition-colors hover:border-[#c5ff3e]/40 hover:bg-[#c5ff3e]/5 md:inline-flex"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c5ff3e]">
              Available
            </span>
            <span className="text-[#a8a298] group-hover:text-[#f5f1e8]">
              Book a call →
            </span>
          </a>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="top"
        className="relative flex min-h-[100svh] items-end overflow-hidden border-b border-[#1a1a18] px-6 pb-16 pt-32 md:px-10 md:pb-24"
      >
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob blob-a" />
          <div className="blob blob-b" />
          <div className="blob blob-c" />
        </div>
        {/* Cursor-tracking spotlight */}
        <MouseSpotlight />

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          {/* Meta rail */}
          <div className="mb-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5a564f]">
            <span>№ 001 — Portfolio</span>
            <span className="hidden md:inline">·</span>
            <span>MMXXVI Edition</span>
            <span className="hidden md:inline">·</span>
            <span className="text-[#c5ff3e]">
              <span className="pulse-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#c5ff3e] align-middle" />
              Booking Summer 2026 — 2 slots
            </span>
          </div>

          {/* Headline */}
          <h1 className="display text-[clamp(3.5rem,11vw,10rem)] text-[#f5f1e8]">
            <span className="block">I build</span>
            <span className="block">
              <span className="italic font-[450]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                AI-powered
              </span>{" "}
              SaaS
            </span>
            <span className="block">
              products in{" "}
              <span className="relative inline-block text-[#c5ff3e]">
                <span className="italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                  14 days
                </span>
                <span className="absolute -bottom-2 left-0 h-[3px] w-full bg-[#c5ff3e]/60" />
              </span>
              <span className="text-[#c5ff3e]">.</span>
            </span>
          </h1>

          {/* Subhead and CTAs */}
          <div className="mt-16 flex flex-col gap-10 md:mt-20 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-[#a8a298] md:text-xl">
              Next.js, Supabase, Stripe, Claude API. Fixed price. Fixed
              timeline. Deployed and live, not a prototype.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic group inline-flex h-14 items-center gap-3 rounded-full bg-[#c5ff3e] px-7 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
              >
                Book a 15-min call
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#offer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#f5f1e8]"
              >
                <span className="relative">
                  See the offer
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-[#f5f1e8] transition-transform duration-500 group-hover:scale-x-0" />
                </span>
                <span className="transition-transform group-hover:translate-x-1">
                  ↓
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#5a564f] md:left-10 md:translate-x-0">
          <span className="mr-3">Scroll</span>
          <span>↓</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE — Stack ribbon
          ═══════════════════════════════════════════════════════════ */}
      <section className="marquee-mask overflow-hidden border-b border-[#1a1a18] py-8">
        <div className="marquee-track">
          {[...STACK_MARQUEE, ...STACK_MARQUEE, ...STACK_MARQUEE].map(
            (item, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center gap-8 px-8 text-2xl md:text-3xl"
              >
                <span className="font-mono text-[#5a564f]">{item}</span>
                <span className="text-[#c5ff3e]">◆</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SHIPPED — Editorial products
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative border-b border-[#1a1a18] px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mb-20 flex items-end justify-between">
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5ff3e]">
                  § Selected Works
                </p>
                <h2 className="display max-w-3xl text-5xl md:text-7xl">
                  Real products.
                  <br />
                  <span
                    className="italic text-[#a8a298]"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    Real users.
                  </span>
                </h2>
              </div>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f] md:block">
                02 shipped<br />02 stealth
              </p>
            </div>
          </Reveal>

          <div className="divide-y divide-[#1a1a18]">
            {SHIPPED_PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative grid grid-cols-12 items-baseline gap-x-6 py-10 transition-colors hover:bg-[#0f0f0f]/40 md:py-14"
                >
                  <span className="col-span-12 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f] md:col-span-1">
                    {p.index}
                  </span>
                  <h3 className="display col-span-12 text-5xl leading-[0.95] text-[#f5f1e8] md:col-span-5 md:text-7xl">
                    {p.name}
                    <span
                      className="ml-2 inline-block translate-x-0 italic text-[#c5ff3e] opacity-0 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100"
                      style={{
                        fontVariationSettings: '"opsz" 144, "SOFT" 100',
                      }}
                    >
                      ↗
                    </span>
                  </h3>
                  <p className="col-span-12 mt-4 max-w-xl text-base leading-relaxed text-[#a8a298] md:col-span-4 md:mt-0">
                    {p.tagline}
                  </p>
                  <div className="col-span-12 mt-6 flex flex-col items-start gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#5a564f] md:col-span-2 md:mt-0 md:items-end">
                    <span>{p.urlLabel}</span>
                    <div className="flex flex-wrap gap-1 md:justify-end">
                      {p.stack.map((s) => (
                        <span key={s} className="text-[#5a564f]/80">
                          {s}
                        </span>
                      )).reduce((acc: React.ReactNode[], curr, i, arr) => {
                        acc.push(curr);
                        if (i < arr.length - 1) {
                          acc.push(
                            <span key={`sep-${i}`} className="text-[#1a1a18]">
                              ·
                            </span>
                          );
                        }
                        return acc;
                      }, [])}
                    </div>
                    <span className="text-[#c5ff3e]">{p.year}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Stealth callout */}
          <Reveal delay={200}>
            <div className="mt-16 grid grid-cols-12 items-baseline gap-x-6 border-t border-dashed border-[#1a1a18] pt-12">
              <span className="col-span-12 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f] md:col-span-1">
                03–04
              </span>
              <div className="col-span-12 md:col-span-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                  — In development, under wraps
                </p>
                <p
                  className="display text-3xl italic text-[#a8a298] md:text-4xl"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  Two more SaaS products<br />launching this year.
                </p>
              </div>
              <p className="col-span-12 mt-4 max-w-md text-sm leading-relaxed text-[#a8a298] md:col-span-4 md:mt-0">
                Bilingual field-service tooling for service businesses.
                GTM intelligence for B2B teams. Details available on
                discovery calls.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OFFER — Editorial typographic display
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="offer"
        className="relative overflow-hidden border-b border-[#1a1a18] px-6 py-28 md:px-10 md:py-40"
      >
        {/* Soft accent glow */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(800px circle at 20% 30%, rgba(197,255,62,0.08), transparent 50%)",
          }}
        />

        <div className="relative mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5ff3e]">
              § The Offer
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-12 items-end gap-x-6">
              <div className="col-span-12 md:col-span-7">
                <p
                  className="display text-5xl leading-[0.9] md:text-7xl"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
                >
                  <span className="block text-[#a8a298]">A</span>
                  <span className="block">
                    <span className="text-[#c5ff3e]">Ship-Ready</span>
                  </span>
                  <span className="block">
                    MVP,{" "}
                    <span
                      className="italic"
                      style={{
                        fontVariationSettings: '"opsz" 144, "SOFT" 100',
                      }}
                    >
                      delivered.
                    </span>
                  </span>
                </p>
              </div>
              <div className="col-span-12 md:col-span-5">
                <div className="space-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                  <p>— Fixed scope.</p>
                  <p>— Fixed price.</p>
                  <p>— Two-week delivery.</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Price + Timeline marquee-style display */}
          <Reveal delay={160}>
            <div className="mt-20 grid grid-cols-12 gap-6 border-y border-[#1a1a18] py-12 md:py-16">
              <div className="col-span-12 border-b border-[#1a1a18] pb-8 md:col-span-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                  Investment
                </p>
                <p className="display text-[clamp(4rem,12vw,10rem)] leading-none text-[#f5f1e8]">
                  $6,500
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a298]">
                  USD · Fixed · Non-negotiable
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 md:pl-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                  Delivery
                </p>
                <p className="display text-[clamp(4rem,12vw,10rem)] leading-none text-[#c5ff3e]">
                  <span
                    className="italic"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    14
                  </span>{" "}
                  days
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a298]">
                  Kickoff → Launch · Guaranteed
                </p>
              </div>
            </div>
          </Reveal>

          {/* Checklist and terms */}
          <Reveal delay={240}>
            <div className="mt-16 grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-6">
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                  — What&apos;s included
                </p>
                <ul className="space-y-4">
                  {OFFER_CHECKLIST.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-[#1a1a18] pb-4 text-[#f5f1e8]"
                    >
                      <span className="font-mono text-[10px] text-[#5a564f]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                  — Terms
                </p>
                <ul className="space-y-4">
                  {OFFER_TERMS.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-[#1a1a18] pb-4 text-[#a8a298]"
                    >
                      <span className="font-mono text-[10px] text-[#5a564f]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic group inline-flex h-14 items-center gap-3 rounded-full bg-[#c5ff3e] px-7 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
                  >
                    Book a discovery call
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Add-ons strip */}
          <Reveal delay={320}>
            <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  title: "AI feature retrofit",
                  desc: "Add a Claude-powered feature to your existing app.",
                  price: "$3,500",
                  time: "1 week",
                },
                {
                  title: "Stripe + Auth wiring",
                  desc: "Drop-in payments and authentication for an existing codebase.",
                  price: "$2,500",
                  time: "3–4 days",
                },
              ].map((a) => (
                <div
                  key={a.title}
                  className="group flex flex-col justify-between rounded-2xl border border-[#1a1a18] bg-[#0f0f0f]/40 p-7 transition-colors hover:border-[#c5ff3e]/30"
                >
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                      — Add-on
                    </p>
                    <p
                      className="display mb-2 text-2xl"
                      style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
                    >
                      {a.title}
                    </p>
                    <p className="text-sm text-[#a8a298]">{a.desc}</p>
                  </div>
                  <div className="mt-6 flex items-baseline justify-between border-t border-[#1a1a18] pt-4 font-mono text-[11px] uppercase tracking-[0.15em]">
                    <span className="text-[#c5ff3e]">{a.price}</span>
                    <span className="text-[#5a564f]">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS
          ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#1a1a18] px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5ff3e]">
              § Process
            </p>
            <h2 className="display text-5xl md:text-7xl">
              Two weeks.{" "}
              <span
                className="italic text-[#a8a298]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                No surprises.
              </span>
            </h2>
          </Reveal>

          <div className="mt-20 grid grid-cols-12 gap-6">
            {PROCESS.map((p, i) => (
              <Reveal
                key={p.phase}
                delay={i * 120}
                className="col-span-12 md:col-span-4"
              >
                <div className="group relative h-full border-t border-[#1a1a18] pt-8 transition-colors hover:border-[#c5ff3e]/30">
                  <span
                    className="display absolute -top-0.5 right-0 text-7xl leading-none text-[#1a1a18] transition-colors group-hover:text-[#c5ff3e]/20 md:text-9xl"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
                  >
                    0{i + 1}
                  </span>
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                    {p.phase}
                  </p>
                  <h3
                    className="display mb-4 text-3xl md:text-4xl"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#a8a298]">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT — Editorial column
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[#1a1a18] px-6 py-28 md:px-10 md:py-40">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(700px circle at 80% 50%, rgba(217,119,87,0.08), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="grid grid-cols-12 gap-6">
            <Reveal className="col-span-12 md:col-span-4">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5ff3e]">
                § About
              </p>
              <h2 className="display text-5xl md:text-6xl">
                LT
                <br />
                <span
                  className="italic"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  Lightbourn.
                </span>
              </h2>
              <div className="mt-8 space-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5a564f]">
                <p>— Based remotely</p>
                <p>— Integrator, Social Club Consulting</p>
                <p>— Four SaaS shipped, MMXXIV–MMXXV</p>
              </div>
            </Reveal>
            <Reveal delay={120} className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="dropcap text-lg leading-[1.65] text-[#f5f1e8] md:text-xl">
                I&apos;m the Integrator at Social Club Consulting. Over the
                last 18 months I&apos;ve shipped four SaaS products spanning
                podcast content, gaming, field service, and B2B GTM.
              </p>
              <p className="mt-6 text-lg leading-[1.65] text-[#a8a298] md:text-xl">
                I&apos;m taking a small number of MVP builds this season. One
                client at a time, fixed scope, fixed price, two weeks from
                kickoff to launch.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  "Next.js",
                  "Supabase",
                  "Stripe",
                  "Claude API",
                  "Vercel",
                  "TypeScript",
                ].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[#1a1a18] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a8a298]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#1a1a18] px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mb-16 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5ff3e]">
                  § Common Questions
                </p>
                <h2 className="display text-5xl md:text-6xl">
                  Answered{" "}
                  <span
                    className="italic text-[#a8a298]"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    honestly.
                  </span>
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-8">
                <p className="text-sm leading-relaxed text-[#a8a298]">
                  If your question isn&apos;t here, bring it to the discovery
                  call. There&apos;s no such thing as a stupid one.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Accordion className="w-full">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-[#1a1a18]"
                >
                  <AccordionTrigger className="group items-baseline py-6 text-left transition-colors hover:no-underline">
                    <div className="flex items-baseline gap-4 md:gap-8">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="display text-xl text-[#f5f1e8] transition-colors group-hover:text-[#c5ff3e] md:text-2xl"
                        style={{
                          fontVariationSettings: '"opsz" 144, "SOFT" 30',
                        }}
                      >
                        {item.q}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pl-10 text-base leading-relaxed text-[#a8a298] md:pl-20 md:text-lg">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Final push
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[#1a1a18] px-6 py-40 md:px-10 md:py-56">
        <div className="absolute inset-0">
          <div className="blob blob-a opacity-60" />
          <div className="blob blob-b opacity-40" />
        </div>
        <div className="relative mx-auto max-w-[1400px] text-center">
          <Reveal>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c5ff3e]">
              § Ready when you are
            </p>
            <h2 className="display text-[clamp(3rem,10vw,9rem)] leading-[0.95]">
              Let&apos;s ship
              <br />
              <span
                className="italic text-[#c5ff3e]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                something real.
              </span>
            </h2>
            <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-[#a8a298]">
              Book a 15-min discovery call. We&apos;ll talk scope, confirm
              fit, and you&apos;ll walk away with a go/no-go in under a week.
            </p>
            <div className="mt-12">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic group inline-flex h-16 items-center gap-3 rounded-full bg-[#c5ff3e] px-10 text-base font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
              >
                Book a call
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER — Masthead style
          ═══════════════════════════════════════════════════════════ */}
      <footer className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <p
                className="display text-5xl md:text-6xl"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
              >
                LT
                <br />
                <span
                  className="italic text-[#5a564f]"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  Lightbourn
                </span>
              </p>
            </div>
            <div className="col-span-6 md:col-span-3">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                Contact
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#f5f1e8] hover:text-[#c5ff3e]"
              >
                Book a call →
              </a>
            </div>
            <div className="col-span-6 md:col-span-3">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
                Colophon
              </p>
              <p className="text-sm leading-relaxed text-[#a8a298]">
                Set in Fraunces &amp; Geist.
                <br />
                Built with Next.js on Vercel.
              </p>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-[#1a1a18] pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5a564f] md:flex-row md:items-center">
            <span>© MMXXVI LT Lightbourn. All rights reserved.</span>
            <span>No. 001 — Portfolio Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
