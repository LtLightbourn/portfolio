import Link from "next/link";
import type { Metadata } from "next";
import { WatchViewerLazy } from "@/components/watch-viewer-lazy";

export const metadata: Metadata = {
  title: "№ 001 — Movement · Labs · LT Lightbourn",
  description:
    "A procedurally-rendered mechanical watch movement — an experiment in WebGL, materials, and real-time lighting.",
};

export default function WatchLabPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#0a0a0a] text-[#f5f1e8]">
      {/* Ambient gradient wash — matches portfolio blobs but dimmer */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 80% 20%, rgba(197,255,62,0.08), transparent 55%), radial-gradient(800px circle at 15% 85%, rgba(217,119,87,0.08), transparent 55%)",
          }}
        />
      </div>

      {/* ─── Top rail: back link + labs marker ─── */}
      <header className="absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#a8a298] transition-colors hover:text-[#f5f1e8]"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a564f]">
            <span className="text-[#c5ff3e]">§</span> Labs ·{" "}
            <span className="text-[#a8a298]">№ 001</span>
          </span>
        </div>
      </header>

      {/* ─── Viewer stage: fills the viewport ─── */}
      <section className="relative h-[100svh] w-full">
        <div
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        >
          <WatchViewerLazy />
        </div>

        {/* Overlay: editorial title, bottom-left */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 px-6 pb-14 md:px-10 md:pb-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-12 items-end gap-6">
              <div className="col-span-12 md:col-span-7">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#c5ff3e]">
                  § An Experiment in Precision
                </p>
                <h1 className="display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-[#f5f1e8]">
                  Movement,
                  <br />
                  <span
                    className="italic text-[#a8a298]"
                    style={{
                      fontVariationSettings: '"opsz" 144, "SOFT" 100',
                    }}
                  >
                    in motion.
                  </span>
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-9">
                <p className="max-w-sm text-sm leading-relaxed text-[#a8a298] md:text-base">
                  A real-time mechanical movement — plates, gears, jewels,
                  and a beating balance wheel. Rendered in WebGL with
                  physical materials and studio lighting.
                </p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5a564f]">
                  Drag to rotate · Scroll to zoom
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Build credits: bottom-right micro-meta */}
        <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-[#5a564f] md:right-10 md:block">
          <span>Three.js · React Three Fiber · MMXXVI</span>
        </div>
      </section>
    </main>
  );
}
