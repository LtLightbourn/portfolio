"use client";

import dynamic from "next/dynamic";

// Client-side shim: Three.js touches `window`, so never render on the server.
// This must be in a Client Component because Next.js 15+ forbids `ssr: false`
// with next/dynamic inside Server Components.
export const WatchViewerLazy = dynamic(
  () => import("./watch-viewer").then((m) => m.WatchViewer),
  { ssr: false },
);
