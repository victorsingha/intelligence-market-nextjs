"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";

type Article = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
  thumbnail: string;
};

type NewsResponse = {
  articles: Article[];
  googleNews: Article[];
  total: number;
  error?: string;
};

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "IN", label: "India" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "JP", label: "Japan" },
  { code: "BR", label: "Brazil" },
  { code: "SG", label: "Singapore" },
  { code: "AE", label: "UAE" },
  { code: "ZA", label: "South Africa" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ja", label: "Japanese" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
];

const TIME_OPTIONS = [
  { value: "1h", label: "Past hour" },
  { value: "24h", label: "Past 24h" },
  { value: "7d", label: "Past week" },
  { value: "30d", label: "Past month" },
];

const TOPICS = [
  "Business", "Technology", "World", "Science",
  "Health", "Sports", "Entertainment", "Politics",
];

const GEO_REGIONS = [
  { label: "North America", country: "US" },
  { label: "Europe", country: "GB" },
  { label: "Asia Pacific", country: "SG" },
  { label: "India", country: "IN" },
  { label: "Middle East", country: "AE" },
  { label: "South America", country: "BR" },
  { label: "Africa", country: "ZA" },
];

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

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="border border-[var(--hairline)] flex flex-col bg-[var(--canvas)]">
      {article.thumbnail && (
        <div className="h-[160px] overflow-hidden bg-[var(--surface-2)] flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--primary)] font-semibold">
            {article.source}
          </span>
          <span className="text-[11px] leading-[1.33] tracking-[0.32px] text-[var(--ink-subtle)]">
            {formatDate(article.pubDate)}
          </span>
        </div>
        <h3 className="text-[15px] leading-[1.4] tracking-normal text-[var(--ink)] mb-1" style={{ fontWeight: 400 }}>
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {article.title}
          </a>
        </h3>
        <p className="text-[13px] leading-[1.4] text-[var(--ink-muted)] line-clamp-3 mt-auto">{article.snippet}</p>
      </div>
    </article>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { code: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] font-semibold">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="carbon-input !py-1.5 !text-[13px] appearance-none cursor-pointer"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [search, setSearch] = useState("");
  const [exclude, setExclude] = useState("");
  const [urlContains, setUrlContains] = useState("");
  const [time, setTime] = useState("7d");
  const [showFilters, setShowFilters] = useState(false);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (language) params.set("language", language);
    if (search) params.set("search", search);
    if (exclude) params.set("exclude", exclude);
    if (urlContains) params.set("urlContains", urlContains);
    if (time) params.set("time", time);
    return params.toString();
  }, [country, language, search, exclude, urlContains, time]);

  useEffect(() => {
    const params = buildQuery();
    const controller = new AbortController();

    queueMicrotask(() => { setLoading(true); setError(""); });

    fetch(`/api/news?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d: NewsResponse) => {
        if (controller.signal.aborted) return;
        if (d.error) { setError(d.error); setArticles([]); }
        else { setArticles(d.articles); }
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError("Failed to load news.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [buildQuery]);

  function handleTopic(topic: string) {
    setSearch((prev) => (prev === topic ? "" : topic));
  }

  function handleGeo(countryCode: string) {
    setCountry(countryCode);
    setSearch("");
  }

  function clearFilters() {
    setCountry("");
    setLanguage("");
    setSearch("");
    setExclude("");
    setUrlContains("");
    setTime("7d");
  }

  const hasActiveFilters = country || language || search || exclude || urlContains || time !== "7d";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
      <Header />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-[1200px] mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-muted)] no-underline mb-4 hover:text-[var(--ink)] transition-colors duration-80">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            Back
          </Link>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[36px] leading-[1.17] tracking-[-0.4px] text-[var(--ink)]" style={{ fontWeight: 300 }}>
                News
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`btn-ghost !min-h-0 !py-1.5 !px-3 text-[13px] ${showFilters ? "bg-[var(--surface-1)]" : ""}`}
            >
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                )}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-[480px]">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-subtle)] pointer-events-none"
                viewBox="0 0 16 16" fill="none" aria-hidden="true"
              >
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news…"
                className="carbon-input !pl-9 !text-[13px]"
                aria-label="Search news"
              />
            </div>
            <div className="flex items-center gap-2">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTime(t.value)}
                  className={`text-[11px] leading-[1.33] tracking-[0.32px] uppercase px-2.5 py-1.5 border transition-colors duration-80 ${
                    time === t.value
                      ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--hairline)] text-[var(--ink-muted)] hover:border-[var(--ink-subtle)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`btn-ghost !min-h-0 !py-1.5 !px-2.5 text-[13px] ${showFilters ? "bg-[var(--surface-1)]" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopic(topic)}
                className={`text-[11px] leading-[1.33] tracking-[0.32px] uppercase px-2.5 py-1 border transition-colors duration-80 ${
                  search === topic
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-[var(--hairline)] text-[var(--ink-muted)] hover:border-[var(--ink-subtle)]"
                }`}
              >
                {topic}
              </button>
            ))}
            {GEO_REGIONS.map((region) => (
              <button
                key={region.country}
                type="button"
                onClick={() => handleGeo(region.country)}
                className={`text-[11px] leading-[1.33] tracking-[0.32px] uppercase px-2.5 py-1 border transition-colors duration-80 ${
                  country === region.country && !search
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-[var(--hairline)] text-[var(--ink-muted)] hover:border-[var(--ink-subtle)]"
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="border border-[var(--hairline)] p-5 mb-6 bg-[var(--surface-1)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <FilterSelect label="Country" value={country} onChange={setCountry} options={COUNTRIES} />
                </div>
                <div>
                  <FilterSelect label="Language" value={language} onChange={setLanguage} options={LANGUAGES} />
                </div>
                <div>
                  <label className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] font-semibold block mb-1">
                    Exclude keywords
                  </label>
                  <input
                    type="text"
                    value={exclude}
                    onChange={(e) => setExclude(e.target.value)}
                    placeholder="crypto, bitcoin"
                    className="carbon-input !text-[13px]"
                    aria-label="Exclude keywords"
                  />
                </div>
                <div>
                  <label className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] font-semibold block mb-1">
                    URL contains
                  </label>
                  <input
                    type="text"
                    value={urlContains}
                    onChange={(e) => setUrlContains(e.target.value)}
                    placeholder="bloomberg, reuters"
                    className="carbon-input !text-[13px]"
                    aria-label="URL contains"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-tertiary !min-h-0 !py-1.5 !px-3 text-[13px]"
                  >
                    Clear filters
                  </button>
                )}
                <p className="text-[11px] leading-[1.33] tracking-[0.32px] font-mono text-[var(--ink-muted)]">
                  {articles.length} result{articles.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center">
              <span className="analyzing-dot w-2 h-2 rounded-full bg-[var(--primary)] inline-block" />
              <span className="analyzing-dot w-2 h-2 rounded-full bg-[var(--primary)] inline-block" />
              <span className="analyzing-dot w-2 h-2 rounded-full bg-[var(--primary)] inline-block" />
            </div>
          )}

          {error && (
            <p className="text-[14px] tracking-[0.16px] text-[var(--semantic-error)]">{error}</p>
          )}

          {!loading && !error && articles.length === 0 && (
            <p className="text-[14px] tracking-[0.16px] text-[var(--ink-subtle)] py-12 text-center">
              No articles match your filters.
            </p>
          )}

          {!loading && articles.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((a, i) => (
                  <ArticleCard key={`${a.link}-${i}`} article={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="footer-bar">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[12px] leading-[1.33] tracking-[0.32px]">
            © Intelligence Markets · Google News RSS
          </p>
        </div>
      </footer>
    </div>
  );
}
