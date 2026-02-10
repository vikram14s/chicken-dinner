"use client";

import dynamic from "next/dynamic";

export const OddsWorkbenchLazy = dynamic(
  async () => {
    const mod = await import("@/components/OddsWorkbench");
    return mod.OddsWorkbench;
  },
  {
    ssr: false,
    loading: () => <p className="subtle">Loading odds workbench...</p>
  }
);
