import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Replace this with your real Calendly link after Step 5 of the setup plan.
const CALENDLY_URL = "https://calendly.com/your-handle/discovery-call";

const SHIPPED_PRODUCTS = [
  {
    name: "AfterCast",
    tagline:
      "AI-powered podcast content repurposing. Episodes become transcripts, highlight clips, and social-ready assets automatically.",
    url: "https://aftercast.io",
    urlLabel: "aftercast.io",
    stack: ["Next.js 15", "Supabase", "Stripe", "Claude API"],
  },
  {
    name: "Decksmith",
    tagline:
      "MTG Commander deck builder that generates a full 100-card deck from a feeling or theme. Format-aware, synergy-tuned, instantly playable.",
    url: "https://decksmith.gg",
    urlLabel: "decksmith.gg",
    stack: ["Next.js 15", "Supabase", "Tailwind", "Claude API"],
  },
];

const STACK = [
  "Next.js 15",
  "TypeScript",
  "Tailwind",
  "shadcn/ui",
  "Supabase",
  "Stripe",
  "Claude API",
  "Vercel",
];

const PROCESS = [
  {
    phase: "Days 1–2",
    title: "Scoping",
    body: "Kickoff call. Written scope doc. Stack confirmed. Repo and environments provisioned.",
  },
  {
    phase: "Days 3–12",
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

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-400/30">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm tracking-tight text-zinc-400">
            lawrence<span className="text-emerald-400">.</span>lightbourn
          </span>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-400 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-300"
          >
            Book a call
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* HERO */}
        <section className="pt-24 pb-20 md:pt-32 md:pb-28">
          <Badge
            variant="outline"
            className="mb-8 rounded-full border-zinc-800 bg-zinc-900/50 px-3 py-1 font-mono text-xs text-zinc-400"
          >
            Booking 2 MVP builds — Summer 2026
          </Badge>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            I build AI-powered SaaS products in{" "}
            <span className="text-emerald-400">14 days.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            Next.js, Supabase, Stripe, Claude API. Fixed price. Fixed timeline.
            Deployed and live, not a prototype.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-base font-medium text-zinc-950 transition-colors hover:bg-emerald-300"
            >
              Book a 20-min call
            </a>
            <a
              href="#offer"
              className="inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            >
              See the offer →
            </a>
          </div>
        </section>

        <Separator className="bg-zinc-900" />

        {/* SHIPPED PRODUCTS */}
        <section className="py-20 md:py-28">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                Shipped &amp; live
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Real products. Real users.
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {SHIPPED_PRODUCTS.map((p) => (
              <Card
                key={p.name}
                className="group border-zinc-900 bg-zinc-900/40 transition-colors hover:border-zinc-800 hover:bg-zinc-900/60"
              >
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {p.name}
                    </h3>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-zinc-500 transition-colors group-hover:text-emerald-400"
                    >
                      {p.urlLabel} ↗
                    </a>
                  </div>
                  <p className="mb-6 text-zinc-400 leading-relaxed">
                    {p.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="rounded-full border-zinc-800 bg-zinc-950/50 font-mono text-[10px] text-zinc-500"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* STEALTH */}
          <div className="mt-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                  Currently building — stealth
                </p>
                <p className="mt-2 text-zinc-300">
                  Two additional SaaS products launching this year. Bilingual
                  field-service tooling and GTM intelligence for B2B teams.
                </p>
              </div>
              <p className="font-mono text-xs text-zinc-500 md:text-right">
                Details on the call.
              </p>
            </div>
          </div>
        </section>

        <Separator className="bg-zinc-900" />

        {/* OFFER */}
        <section id="offer" className="py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            The offer
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Ship-Ready MVP
          </h2>

          <Card className="mt-10 overflow-hidden border-emerald-400/20 bg-gradient-to-b from-emerald-400/5 to-transparent">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold tracking-tight md:text-6xl">
                    $6,500
                  </span>
                  <span className="font-mono text-sm text-zinc-500">
                    fixed price
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold tracking-tight text-emerald-400">
                    14 days
                  </span>
                  <span className="font-mono text-sm text-zinc-500">
                    kickoff to launch
                  </span>
                </div>
              </div>

              <Separator className="my-8 bg-zinc-800" />

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
                    What you get
                  </p>
                  <ul className="space-y-3 text-zinc-300">
                    {[
                      "Full-stack Next.js 15 application",
                      "Authentication via Supabase Auth",
                      "Stripe payments and subscriptions",
                      "One core AI feature (Claude API)",
                      "Deployed live on Vercel",
                      "One revision round in week 3",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 text-emerald-400">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Terms
                  </p>
                  <ul className="space-y-3 text-zinc-300">
                    <li>50% deposit at kickoff</li>
                    <li>50% balance on launch day</li>
                    <li>Scope locked on day 2</li>
                    <li>Daily Loom updates throughout</li>
                    <li>Codebase fully transferred at launch</li>
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-base font-medium text-zinc-950 transition-colors hover:bg-emerald-300"
                >
                  Book a discovery call
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Add-on
              </p>
              <p className="mt-2 font-semibold">AI feature retrofit</p>
              <p className="mt-1 text-sm text-zinc-400">
                Add a Claude-powered feature to your existing app.
              </p>
              <p className="mt-3 font-mono text-sm text-emerald-400">
                $3,500 · 1 week
              </p>
            </div>
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Add-on
              </p>
              <p className="mt-2 font-semibold">Stripe + Auth wiring</p>
              <p className="mt-1 text-sm text-zinc-400">
                Drop-in payments and authentication for an existing codebase.
              </p>
              <p className="mt-3 font-mono text-sm text-emerald-400">
                $2,500 · 3–4 days
              </p>
            </div>
          </div>
        </section>

        <Separator className="bg-zinc-900" />

        {/* PROCESS */}
        <section className="py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Process
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Two weeks. No surprises.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PROCESS.map((p, i) => (
              <div
                key={p.phase}
                className="relative rounded-xl border border-zinc-900 bg-zinc-900/30 p-6"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-zinc-950 px-3 py-1 font-mono text-xs text-emerald-400">
                  0{i + 1}
                </span>
                <p className="font-mono text-xs text-zinc-500">{p.phase}</p>
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-zinc-900" />

        {/* STACK */}
        <section className="py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Stack
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            One stack. Shipped four times.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {STACK.map((s) => (
              <span
                key={s}
                className="rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-sm text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <Separator className="bg-zinc-900" />

        {/* ABOUT */}
        <section className="py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            About
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Lawrence Lightbourn
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-zinc-400">
            <p>
              I&apos;m the Integrator at Social Club Consulting. Over the last
              18 months I&apos;ve shipped four SaaS products spanning podcast
              content, gaming, field service, and B2B GTM.
            </p>
            <p>
              I&apos;m taking a small number of MVP builds this season. One
              client at a time, fixed scope, fixed price, two weeks from
              kickoff to launch.
            </p>
          </div>
        </section>

        <Separator className="bg-zinc-900" />

        {/* FAQ */}
        <section className="py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Common questions
          </h2>
          <Accordion className="mt-10 w-full">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-zinc-900"
              >
                <AccordionTrigger className="text-left text-base text-zinc-200 hover:text-emerald-400 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* FOOTER CTA */}
        <section className="py-20 md:py-28">
          <Card className="border-emerald-400/20 bg-gradient-to-b from-emerald-400/10 to-transparent">
            <CardContent className="p-10 text-center md:p-16">
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Ready to ship?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-400 md:text-lg">
                Book a 20-min discovery call. We&apos;ll talk scope, confirm
                fit, and you&apos;ll walk away with a go/no-go in under a week.
              </p>
              <div className="mt-8">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-base font-medium text-zinc-950 transition-colors hover:bg-emerald-300"
                >
                  Book a call →
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 mt-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 md:flex-row">
          <p className="font-mono text-xs text-zinc-600">
            © 2026 Lawrence Lightbourn
          </p>
          <p className="font-mono text-xs text-zinc-600">
            Built in one afternoon with Next.js, Tailwind, and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  );
}
