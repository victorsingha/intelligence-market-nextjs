"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import StockChart, { generateData } from "./StockChart";
import StockAnalysis from "./StockAnalysis";
import Header from "../components/Header";

const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "JPM", name: "JPMorgan Chase" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
];

const USER_KEY = "carbon:user";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("AAPL");

  const chartData = useMemo(() => generateData(selected, 390), [selected]);

  const filtered = search.trim()
    ? STOCKS.filter((s) =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : STOCKS;

  useEffect(() => {
    const raw =
      window.localStorage.getItem(USER_KEY) ??
      window.sessionStorage.getItem(USER_KEY);
    queueMicrotask(() => {
      if (raw) {
        try { setUser(JSON.parse(raw)); } catch {}
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready && user === null) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--canvas)]">
        <p className="text-[14px] tracking-[0.16px] text-[var(--ink-muted)]">
          Redirecting to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[var(--canvas)] px-6 py-12">
        <div className="max-w-[1200px] mx-auto">
        <p className="text-[13px] leading-[1.5] mb-8 flex items-center gap-3 text-[var(--ink-muted)]">
          <span className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase font-semibold px-2 py-0.5" style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}>
            DEMO
          </span>
          Chart data is simulated. News feed is live from BBC Business, Fox Business, Moneycontrol, Economic Times &amp; Livemint.
        </p>

        <section className="mb-8" aria-label="Welcome">
          <p className="text-[14px] leading-[1.29] tracking-[0.16px] text-[var(--ink-muted)] mb-3">
            {greeting()} · {user!.role}
          </p>
          <h1
            className="text-[42px] sm:text-[60px] leading-[1.17] tracking-[-0.4px] text-[var(--ink)] mb-6"
            style={{ fontWeight: 300 }}
          >
            Search a stock to analyze.
          </h1>
          <div className="relative max-w-[480px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by symbol or company name…"
              className="carbon-input pr-4"
              aria-label="Search stocks"
            />
            {search && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--canvas)] border border-[var(--hairline)] z-10 max-h-[320px] overflow-y-auto">
                {filtered.map((s) => (
                  <button
                    key={s.symbol}
                    type="button"
                    onClick={() => { setSelected(s.symbol); setSearch(""); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-1)] transition-colors duration-80 ${
                      selected === s.symbol ? "bg-[var(--surface-1)]" : ""
                    }`}
                  >
                    <span className="font-mono text-[14px] font-semibold text-[var(--ink)] w-[70px]">
                      {s.symbol}
                    </span>
                    <span className="text-[14px] text-[var(--ink-muted)]">
                      {s.name}
                    </span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-4 py-3 text-[14px] text-[var(--ink-subtle)]">
                    No stocks found.
                  </p>
                )}
              </div>
            )}
          </div>
          {!search && (
            <div className="flex flex-wrap gap-2 mt-4">
              {STOCKS.slice(0, 6).map((s) => (
                <button
                  key={s.symbol}
                  type="button"
                  onClick={() => setSelected(s.symbol)}
                  className={`text-[12px] leading-[1.33] tracking-[0.32px] uppercase px-3 py-1.5 border transition-colors duration-80 ${
                    selected === s.symbol
                      ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--hairline)] text-[var(--ink-muted)] hover:border-[var(--ink-subtle)]"
                  }`}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <section className="flex-1 min-w-0 flex flex-col" aria-label="Chart">
            <div className="border border-[var(--hairline)] p-4 sm:p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <p className="text-[12px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] mb-1">
                    Real-time · {selected}
                  </p>
                  <p className="text-[20px] leading-[1.4] tracking-normal text-[var(--ink)] font-mono"
                     style={{ fontWeight: 400 }}>
                    {selected} · {STOCKS.find((s) => s.symbol === selected)?.name ?? selected}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[24px] leading-[1.33] tracking-normal text-[var(--ink)] font-mono"
                     style={{ fontWeight: 300 }}>
                    ${chartData.basePrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <StockChart symbol={selected} data={chartData.bars} />
            </div>
          </section>

          <section className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 flex flex-col">
            <div className="flex-1 flex flex-col">
              <StockAnalysis symbol={selected} data={chartData.bars} />
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
