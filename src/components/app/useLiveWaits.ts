"use client";

import { useEffect, useState } from "react";
import type { LiveWaits } from "@/lib/queue-times";

export function useLiveWaits() {
  const [data, setData] = useState<LiveWaits | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/wait-times");
        if (!res.ok) throw new Error("wait-times");
        const json = (await res.json()) as LiveWaits;
        if (cancelled) return;
        setData(json);
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const timer = window.setInterval(load, 120_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return { data, error, loading };
}
