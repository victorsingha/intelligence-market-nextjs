import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

const EXISTING_FEEDS = [
  "https://feeds.bbci.co.uk/news/business/rss.xml",
  "https://moxie.foxbusiness.com/google-publisher/market.xml",
  "https://www.moneycontrol.com/rss/business/stocks.xml",
  "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  "https://www.livemint.com/market/stock-market-news/rss",
];

function buildGoogleNewsUrl(opts: {
  country?: string;
  language?: string;
  search?: string;
}): string {
  const hl = opts.language || "en";
  const gl = opts.country || "US";
  const ceid = `${gl}:${hl}`;

  if (opts.search) {
    return `https://news.google.com/rss/search?q=${encodeURIComponent(opts.search)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
  }

  return `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

function parseDate(dateStr: string): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function cleanSnippet(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\[[^\]]*\]/g, "")
    .trim()
    .slice(0, 300);
}

interface RssFeedItem {
  link?: string;
  title?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  creator?: string;
  enclosure?: { url?: string; type?: string };
  mediaContent?: { $: { url?: string } }[];
  mediaThumbnail?: { $: { url?: string } };
  ["media:content"]?: { $: { url?: string } }[];
}

function extractThumbnail(item: RssFeedItem): string {
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) return item.enclosure.url;
  if (item.mediaContent?.[0]?.$.url) return item.mediaContent[0].$.url;
  if (item.mediaThumbnail?.$.url) return item.mediaThumbnail.$.url;
  if (item["media:content"]?.[0]?.$.url) return item["media:content"][0].$.url;
  return "";
}

type ParsedArticle = {
  title: string;
  link: string;
  pubDate: string;
  pubTime: number;
  source: string;
  snippet: string;
  thumbnail: string;
};

async function fetchFeed(url: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []).map((item: RssFeedItem) => {
      const link = item.link ?? "";
      return {
        title: (item.title ?? "").replace(/\[[^\]]*\]/g, "").trim(),
        link,
        pubDate: item.isoDate ?? item.pubDate ?? "",
        pubTime: parseDate(item.isoDate ?? item.pubDate ?? ""),
        source: "Google News",
        snippet: item.contentSnippet ? cleanSnippet(item.contentSnippet) : (item.content ? cleanSnippet(item.content) : ""),
        thumbnail: extractThumbnail(item),
      };
    });
  } catch {
    return [];
  }
}

async function fetchExistingFeeds(): Promise<ParsedArticle[]> {
  const results = await Promise.allSettled(EXISTING_FEEDS.map(fetchFeed));
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

function applyFilters(
  articles: ParsedArticle[],
  filters: { exclude?: string; urlContains?: string; time?: string }
): ParsedArticle[] {
  let filtered = articles;

  if (filters.exclude) {
    const terms = filters.exclude.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (terms.length > 0) {
      filtered = filtered.filter(
        (a) => !terms.some((t) => a.title.toLowerCase().includes(t) || a.snippet.toLowerCase().includes(t))
      );
    }
  }

  if (filters.urlContains) {
    const term = filters.urlContains.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter((a) => a.link.toLowerCase().includes(term));
    }
  }

  if (filters.time) {
    const now = Date.now();
    const ms = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    }[filters.time] ?? 7 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((a) => a.pubTime > now - ms);
  }

  return filtered;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || undefined;
  const language = searchParams.get("language") || undefined;
  const search = searchParams.get("search") || undefined;
  const exclude = searchParams.get("exclude") || undefined;
  const urlContains = searchParams.get("urlContains") || undefined;
  const time = searchParams.get("time") || "7d";

  try {
    const googleUrl = buildGoogleNewsUrl({ country, language, search });
    const [googleArticles, existingArticles] = await Promise.all([
      fetchFeed(googleUrl),
      search ? Promise.resolve([] as ParsedArticle[]) : fetchExistingFeeds(),
    ]);

    const seen = new Set<string>();
    const allArticles = [...googleArticles, ...existingArticles]
      .filter((a) => {
        if (!a.title || seen.has(a.link)) return false;
        seen.add(a.link);
        return true;
      });

    const filtered = applyFilters(allArticles, { exclude, urlContains, time })
      .sort((a, b) => b.pubTime - a.pubTime)
      .slice(0, 50);

    const googleOnly = applyFilters(googleArticles, { exclude, urlContains, time })
      .sort((a, b) => b.pubTime - a.pubTime)
      .slice(0, 30);

    return Response.json(
      { articles: filtered, googleNews: googleOnly, total: filtered.length },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return Response.json(
      { articles: [], googleNews: [], total: 0, error: "Failed to fetch news." },
      { status: 500 }
    );
  }
}
