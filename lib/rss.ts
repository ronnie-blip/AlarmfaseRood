import { XMLParser } from "fast-xml-parser";
import slugify from "slugify";

export type Episode = {
  title: string;
  slug: string;
  pubDate: string;
  description: string;
  subtitle?: string;
  audioUrl: string;
  duration?: string;
  imageUrl?: string;
};

export type PodcastMeta = {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  language?: string;
};

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function pickText(v: any): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v.trim() || undefined;
  // fast-xml-parser can return objects for CDATA: { "#text": "..."} or { "__cdata": "..." }
  if (typeof v === "object") {
    const t = (v["#text"] ?? v["__cdata"] ?? v["text"] ?? "").toString().trim();
    return t || undefined;
  }
  return String(v).trim() || undefined;
}

function firstNonEmpty(...vals: any[]): string | undefined {
  for (const v of vals) {
    const t = pickText(v);
    if (t) return t;
  }
  return undefined;
}

function makeSlug(title: string, id: string) {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  return base ? `${base}-${id.slice(0, 6)}` : id.slice(0, 12);
}

async function fetchRssXml(): Promise<string> {
  const url = process.env.PODCAST_RSS_URL;
  if (!url) {
    throw new Error("PODCAST_RSS_URL is not set (Vercel → Project → Settings → Environment Variables).");
  }

  const res = await fetch(url, {
    // Ensure Vercel doesn't cache a stale feed forever
    cache: "no-store",
    headers: {
      "user-agent": "alarmfase-rood-site/1.0 (+https://alarmfase-rood.vercel.app)",
      accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.1",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 200)}` : ""}`);
  }

  return res.text();
}

function parseRss(xml: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true,
    // keep CDATA as text
    cdataPropName: "__cdata",
  });
  return parser.parse(xml);
}

export async function getPodcastMeta(): Promise<PodcastMeta> {
  const xml = await fetchRssXml();
  const data = parseRss(xml);

  const channel = data?.rss?.channel ?? data?.feed ?? {};
  const image = channel?.image ?? channel?.["itunes:image"] ?? channel?.["itunes:image"]?.["@_href"];

  const imageUrl =
    (typeof image === "string" ? image : undefined) ||
    channel?.image?.url ||
    channel?.["itunes:image"]?.["@_href"] ||
    channel?.["itunes:image"]?.href;

  return {
    title: firstNonEmpty(channel?.title, channel?.["itunes:title"]) ?? "Podcast",
    description: firstNonEmpty(channel?.description, channel?.subtitle, channel?.["itunes:summary"], channel?.["itunes:subtitle"]),
    imageUrl,
    link: firstNonEmpty(channel?.link),
    language: firstNonEmpty(channel?.language),
  };
}

export async function getEpisodes(): Promise<Episode[]> {
  const xml = await fetchRssXml();
  const data = parseRss(xml);

  const channel = data?.rss?.channel ?? {};
  const items = asArray<any>(channel?.item);

  const episodes: Episode[] = items
    .map((item, idx) => {
      const guid = firstNonEmpty(item?.guid?.["#text"], item?.guid, item?.id) ?? String(idx);
      const title = firstNonEmpty(item?.title) ?? `Aflevering ${idx + 1}`;

      const enclosure = item?.enclosure ?? {};
      const audioUrl = enclosure?.["@_url"] ?? enclosure?.url;
      const audioType = enclosure?.["@_type"] ?? enclosure?.type;

      // Prefer iTunes subtitle if available, else a short summary derived from description
      const subtitle = firstNonEmpty(item?.["itunes:subtitle"], item?.subtitle, item?.["itunes:summary"]);

      const description = firstNonEmpty(item?.description, item?.["content:encoded"], item?.["itunes:summary"]);

      const imageUrl = item?.["itunes:image"]?.["@_href"] ?? item?.image?.url ?? undefined;

      if (!audioUrl) return null;

      const ep: Episode = {
        id: guid,
        title,
        slug: makeSlug(title, guid),
        pubDate: firstNonEmpty(item?.pubDate) ?? new Date().toISOString(),
        audioUrl,
        audioType,
        duration: firstNonEmpty(item?.["itunes:duration"], item?.duration),
        subtitle,
        description,
        imageUrl,
      };

      return ep;
    })
    .filter(Boolean) as Episode[];

  // newest first
  episodes.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return episodes;
}
