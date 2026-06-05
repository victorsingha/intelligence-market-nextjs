"use client";

import { useEffect, useState } from "react";

type Article = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
  thumbnail: string;
};

type NewsData = {
  overall: Article[];
  indian: Article[];
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NewsRow({ articles, emptyMessage, surface }: { articles: Article[]; emptyMessage: string; surface?: boolean }) {
  if (articles.length === 0) {
    return <p className="text-[14px] tracking-[0.16px] text-[var(--ink-subtle)]">{emptyMessage}</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
      {articles.map((a, i) => (
        <article key={`${a.link}-${i}`} className={`${surface ? "bg-[var(--surface-1)]" : "bg-[var(--canvas)]"} border border-[var(--hairline)] min-w-[280px] max-w-[320px] flex flex-col flex-shrink-0`}>
          {a.thumbnail && (
            <div className="h-[140px] overflow-hidden bg-[var(--surface-2)] flex-shrink-0">
              <img src={a.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--primary)] font-semibold">
                {a.source}
              </span>
              <span className="text-[11px] leading-[1.33] tracking-[0.32px] text-[var(--ink-subtle)]">
                {formatDate(a.pubDate)}
              </span>
            </div>
            <h3 className="text-[15px] leading-[1.4] tracking-normal text-[var(--ink)] mb-1" style={{ fontWeight: 400 }}>
              <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {a.title}
              </a>
            </h3>
            <p className="text-[13px] leading-[1.4] text-[var(--ink-muted)] line-clamp-3 mt-auto">{a.snippet}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function NewsSection() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="mb-12" aria-label="News">
      <div className="mb-8">
        <p className="text-[12px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] mb-2">
          Intelligence Markets · News
        </p>
        <h2
          className="text-[32px] leading-[1.25] tracking-normal text-[var(--ink)]"
          style={{ fontWeight: 400 }}
        >
          Market news
        </h2>
      </div>

      {loading && (
        <p className="text-[14px] tracking-[0.16px] text-[var(--ink-subtle)]">Loading news…</p>
      )}

      {!loading && !data && (
        <p className="text-[14px] tracking-[0.16px] text-[var(--ink-subtle)]">No news available right now.</p>
      )}

      {data && (
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-[20px] leading-[1.4] tracking-normal text-[var(--ink)] mb-4" style={{ fontWeight: 400 }}>
              Overall markets
            </h3>
            <NewsRow articles={data.overall} emptyMessage="No overall market news available." />
          </div>
          <div>
            <h3 className="text-[20px] leading-[1.4] tracking-normal text-[var(--ink)] mb-4" style={{ fontWeight: 400 }}>
              Indian stocks
            </h3>
            <NewsRow articles={data.indian} emptyMessage="No Indian stock market news available." surface />
          </div>
        </div>
      )}
    </section>
  );
}
