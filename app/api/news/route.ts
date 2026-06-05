import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

const OVERALL_FEEDS = [
  "https://feeds.bbci.co.uk/news/business/rss.xml",
  "https://moxie.foxbusiness.com/google-publisher/market.xml",
];

const INDIAN_FEEDS = [
  "https://www.moneycontrol.com/rss/business/stocks.xml",
  "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  "https://www.livemint.com/market/stock-market-news/rss",
];

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

function extractThumbnail(item: any): string {
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) return item.enclosure.url;
  if (item.mediaContent?.[0]?.$.url) return item.mediaContent[0].$.url;
  if (item.mediaThumbnail?.$.url) return item.mediaThumbnail.$.url;
  if (item["media:content"]?.[0]?.$.url) return item["media:content"][0].$.url;
  return "";
}

async function fetchFeed(url: string) {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items ?? []).map((item: any) => {
      const link = item.link ?? "";
      return {
        title: (item.title ?? "").replace(/\[[^\]]*\]/g, "").trim(),
        link,
        pubDate: item.isoDate ?? item.pubDate ?? "",
        pubTime: parseDate(item.isoDate ?? item.pubDate ?? ""),
        source: item.creator ?? (link ? new URL(link).hostname.replace("www.", "") : "Unknown"),
        snippet: item.contentSnippet ? cleanSnippet(item.contentSnippet) : (item.content ? cleanSnippet(item.content) : ""),
        thumbnail: extractThumbnail(item),
      };
    });
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [overallResults, indianResults] = await Promise.all([
      Promise.allSettled(OVERALL_FEEDS.map(fetchFeed)),
      Promise.allSettled(INDIAN_FEEDS.map(fetchFeed)),
    ]);

    const seen = new Set<string>();

    const overall = overallResults
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .filter((a) => {
        if (!a.title || seen.has(a.link)) return false;
        seen.add(a.link);
        return a.pubTime > Date.now() - 7 * 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.pubTime - a.pubTime)
      .slice(0, 20);

    const indian = indianResults
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      .filter((a) => {
        if (!a.title || seen.has(a.link)) return false;
        seen.add(a.link);
        return a.pubTime > Date.now() - 7 * 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.pubTime - a.pubTime)
      .slice(0, 20);

    return Response.json({ overall, indian }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return Response.json(
      { overall: [], indian: [], error: "Failed to fetch news." },
      { status: 500 }
    );
  }
}
