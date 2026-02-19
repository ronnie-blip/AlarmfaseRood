import { XMLParser } from "fast-xml-parser";
import slugify from "slugify";
import { stripHtml } from "./utils";

async function discoverRssUrlFromPage(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const html = await res.text();

    const m =
      html.match(
        /<link[^>]+type=["']application\/(?:rss\+xml|xml)["'][^>]+href=["']([^"']+)["'][^>]*>/i
      ) ||
      html.match(
        /<link[^>]+href=["']([^"']+)["'][^>]+type=["']application\/(?:rss\+xml|xml)["'][^>]*>/i
      );

    if (!m?.[1]) return null;

    const href = m[1];
    try {
      return new URL(href, pageUrl).toString();
    } catch {
      return href;
    }
  } catch {
    return null;
  }
}

export type Episode = {
  id: string;
  title: string;
  slug: string;
  link?: string;
  date: string;
  subtitle?: string;
  description?: string;
  duration?: string;
  audioUrl?: string;
};

export type PodcastMeta = {
  title: string;
  description: string;
  image?: string;
  link?: string;
};

function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function safeText(v: any): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && "#text" in v) return String((v as any)["#text"]);
  return undefined;
}

function isGenericEpisodeTitle(t?: string) {
  const s = (t ?? "").trim().toLowerCase();
  return s === "" || s === "aflevering" || s === "episode";
}

// Minimal HTML entity decoding (enough for titles)
function decodeHtmlEntities(input: string) {
  return input
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function cleanupPageTitle(raw: string) {
  const t = decodeHtmlEntities(stripHtml(raw)).trim();
  const pipeIdx = t.indexOf("|");
  if (pipeIdx >= 0) return t.slice(pipeIdx + 1).trim();
  return t;
}

async function enrichTitleFromEpisodePageUrl(episodeUrl: string): Promise<string | null> {
  try {
    const res = await fetch(episodeUrl, { next: { revalidate: 24 * 60 * 60 } });
    if (!res.ok) return null;
    const html = await res.text();

    // 1) og:title (most stable)
    const og =
      html.match(
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i
      );
    if (og?.[1]) return cleanupPageTitle(og[1]);

    // 2) <title>
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleTag?.[1]) return cleanupPageTitle(titleTag[1]);

    // 3) first H1/H2
    const h =
      html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
      html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (h?.[1]) return cleanupPageTitle(h[1]);

    return null;
  } catch {
    return null;
  }
}

/**
 * Run async jobs with a concurrency limit (prevents hammering Springcast).
 */
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length) as any;
  let i = 0;

  const workers = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function fetchRss() {
  /**
   * Springcast can serve a "signed" RSS URL (403 Invalid signature when fetched from outside the dashboard).
   * To keep this site working now and in the future (also for new episodes), we resolve the *public* RSS feed
   * via Apple Podcasts (iTunes Lookup API). That returns the canonical feedUrl.
   *
   * - If ITUNES_PODCAST_ID is set, we use it.
   * - Otherwise we fall back to Alarmfase Rood's current Apple Podcasts ID.
   * - If that fails, we fall back to PODCAST_RSS_URL and finally auto-discovery.
   */

  const itunesId = process.env.ITUNES_PODCAST_ID || "1735587185";

  async function resolveFromItunes(): Promise<string | null> {
    try {
      const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(itunesId)}`;
      const res = await fetch(url, {
        // Always fetch fresh so it picks up feed URL changes.
        cache: "no-store",
        headers: { "User-Agent": "AlarmfaseRoodSite/1.0" },
      });
      if (!res.ok) return null;
      const json = (await res.json()) as any;
      const feedUrl = json?.results?.[0]?.feedUrl;
      return typeof feedUrl === "string" && feedUrl.startsWith("http") ? feedUrl : null;
    } catch {
      return null;
    }
  }

  let rssUrl = (await resolveFromItunes()) || process.env.PODCAST_RSS_URL;

  if (!rssUrl) {
    const pageUrl =
      process.env.NEXT_PUBLIC_PODCAST_PAGE_URL || "https://app.springcast.fm/podcast/alarmfase-rood/";
    const discovered = await discoverRssUrlFromPage(pageUrl);
    if (!discovered) {
      throw new Error(
        `Could not resolve RSS feed.\n\n` +
          `Tried: Apple Podcasts lookup (ITUNES_PODCAST_ID=${itunesId}), PODCAST_RSS_URL, and auto-discovery from ${pageUrl}.\n\n` +
          `Fix: set ITUNES_PODCAST_ID (preferred) or PODCAST_RSS_URL in your Vercel environment variables.`
      );
    }
    rssUrl = discovered;
  }

  const res = await fetch(rssUrl, {
    // Keep reasonably fresh, but let Vercel cache.
    next: { revalidate: 600 },
    headers: { "User-Agent": "AlarmfaseRoodSite/1.0" },
  });
  if (!res.ok) throw new Error(`Failed RSS fetch: ${res.status} (${rssUrl})`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true,
  });

  const json = parser.parse(xml);
  const channel = json?.rss?.channel ?? json?.feed ?? json?.channel;
  if (!channel) throw new Error("RSS parse: no channel");

  const meta: PodcastMeta = {
    title: safeText(channel.title) ?? "Alarmfase Rood",
    description: stripHtml(safeText(channel.description) ?? safeText(channel.subtitle) ?? ""),
    image: safeText(channel["itunes:image"]?.["@_href"]) ?? safeText(channel.image?.url),
    link: safeText(channel.link),
  };

  const items = toArray<any>(channel.item);

  const episodes: Episode[] = items.map((item) => {
    const title = safeText(item.title) ?? "Aflevering";
    const guid = safeText(item.guid) ?? safeText(item.id) ?? title;

    const link = safeText(item.link);

    const enclosureUrl =
      safeText(item.enclosure?.["@_url"]) ??
      safeText(item.enclosure?.url) ??
      safeText(item["media:content"]?.["@_url"]);

    const pubDate =
      safeText(item.pubDate) ?? safeText(item.published) ?? safeText(item.updated) ?? "";

    const subtitle = safeText(item["itunes:subtitle"]) ?? safeText(item.subtitle);

    const desc =
      safeText(item["content:encoded"]) ??
      safeText(item.description) ??
      safeText(item.summary);

    const duration = safeText(item["itunes:duration"]);

    const rawSlug = slugify(title, { lower: true, strict: true });
    const slug = !isGenericEpisodeTitle(title)
      ? rawSlug || slugify(guid, { lower: true, strict: true })
      : slugify(guid, { lower: true, strict: true });

    return {
      id: guid,
      title,
      slug,
      link,
      date: pubDate,
      subtitle: subtitle ? stripHtml(subtitle) : undefined,
      description: desc ? desc : undefined,
      duration,
      audioUrl: enclosureUrl,
    };
  });

  /**
   * IMPORTANT:
   * Older episodes still have title="Aflevering" in RSS.
   * Your /afleveringen page shows more than the homepage, so we must enrich more than 25.
   *
   * - EPISODE_ENRICH_LIMIT controls how many generic-title items we enrich.
   * - Default is now 500 (safe for your catalog), with concurrency limiting.
   */
  const ENRICH_LIMIT = Number(process.env.EPISODE_ENRICH_LIMIT ?? 500);
  const CONCURRENCY = Number(process.env.EPISODE_ENRICH_CONCURRENCY ?? 8);

  const candidates = episodes
    .map((ep, idx) => ({ ep, idx }))
    .filter(({ ep }) => isGenericEpisodeTitle(ep.title) && !!ep.link)
    .slice(0, ENRICH_LIMIT);

  if (candidates.length) {
    const enriched = await mapLimit(
      candidates,
      Math.max(1, CONCURRENCY),
      async ({ ep, idx }) => {
        const t = ep.link ? await enrichTitleFromEpisodePageUrl(ep.link) : null;
        return { idx, title: t };
      }
    );

    for (const r of enriched) {
      if (r.title && !isGenericEpisodeTitle(r.title)) {
        episodes[r.idx].title = r.title;
        episodes[r.idx].slug =
          slugify(r.title, { lower: true, strict: true }) ||
          slugify(episodes[r.idx].id, { lower: true, strict: true });
      }
    }
  }

  episodes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { meta, episodes };
}

export async function getEpisodes() {
  const { episodes } = await fetchRss();
  return episodes;
}

export async function getPodcastMeta() {
  const { meta } = await fetchRss();
  return meta;
}
