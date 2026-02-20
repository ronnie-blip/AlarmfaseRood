// /lib/rss.ts
export const dynamic = "force-dynamic";

export type Episode = {
  title: string;
  slug: string;
  pubDate: string;
  description: string;
  audioUrl: string;
  duration?: string;
  imageUrl?: string;
};

export type PodcastMeta = {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
};

const RSS_URL =
  process.env.PODCAST_RSS_URL ||
  process.env.NEXT_PUBLIC_PODCAST_RSS_URL ||
  "";

/**
 * Kleine helpers (zonder externe packages)
 */
function firstMatch(haystack: string, re: RegExp): string | null {
  const m = haystack.match(re);
  return m?.[1]?.trim() ?? null;
}

function decodeHtmlEntities(input: string): string {
  // minimale decoding voor de meeste RSS-teksten
  return input
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchRssXml(): Promise<string> {
  if (!RSS_URL) {
    throw new Error(
      "PODCAST_RSS_URL ontbreekt. Zet deze in Vercel → Settings → Environment Variables."
    );
  }

  const res = await fetch(RSS_URL, {
    // Springcast kan soms agressief cachen; dit houdt het fris
    cache: "no-store",
    headers: {
      "User-Agent": "AlarmfaseRoodSite/1.0 (+vercel)",
      Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  return await res.text();
}

/**
 * Haalt show/podcast meta uit het <channel>-gedeelte van de RSS.
 * Wordt gebruikt door /afleveringen en /afleveringen/[slug]
 */
export async function getPodcastMeta(): Promise<PodcastMeta> {
  const xml = await fetchRssXml();

  // pak alleen channel block voor betrouwbaarheid
  const channel =
    firstMatch(xml, /<channel\b[^>]*>([\s\S]*?)<\/channel>/i) ?? xml;

  const title =
    decodeHtmlEntities(firstMatch(channel, /<title>([\s\S]*?)<\/title>/i) ?? "") ||
    "Podcast";

  // prefer itunes:summary, anders description
  const itunesSummary = firstMatch(
    channel,
    /<itunes:summary[^>]*>([\s\S]*?)<\/itunes:summary>/i
  );
  const description = decodeHtmlEntities(
    itunesSummary ??
      firstMatch(channel, /<description>([\s\S]*?)<\/description>/i) ??
      ""
  );

  // image: prefer itunes:image href, anders <image><url>
  const itunesImageHref = firstMatch(
    channel,
    /<itunes:image[^>]*href="([^"]+)"[^>]*\/?>/i
  );
  const imageUrl =
    itunesImageHref ??
    firstMatch(channel, /<image\b[^>]*>[\s\S]*?<url>([\s\S]*?)<\/url>[\s\S]*?<\/image>/i) ??
    undefined;

  const link = firstMatch(channel, /<link>([\s\S]*?)<\/link>/i) ?? undefined;

  return {
    title,
    description,
    imageUrl: imageUrl ? decodeHtmlEntities(imageUrl) : undefined,
    link: link ? decodeHtmlEntities(link) : undefined,
  };
}

/**
 * Episodes uit de RSS <item>-blokken.
 */
export async function getEpisodes(): Promise<Episode[]> {
  const xml = await fetchRssXml();

  const items = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) ?? [];
  const episodes: Episode[] = items.map((itemXml) => {
    const rawTitle = decodeHtmlEntities(
      firstMatch(itemXml, /<title>([\s\S]*?)<\/title>/i) ?? ""
    );

    const pubDate =
      firstMatch(itemXml, /<pubDate>([\s\S]*?)<\/pubDate>/i) ?? "";

    const itunesSummary = firstMatch(
      itemXml,
      /<itunes:summary[^>]*>([\s\S]*?)<\/itunes:summary>/i
    );
    const description = decodeHtmlEntities(
      itunesSummary ??
        firstMatch(itemXml, /<description>([\s\S]*?)<\/description>/i) ??
        ""
    );

    const enclosureUrl =
      firstMatch(itemXml, /<enclosure[^>]*url="([^"]+)"[^>]*\/?>/i) ?? "";

    const duration =
      firstMatch(itemXml, /<itunes:duration[^>]*>([\s\S]*?)<\/itunes:duration>/i) ??
      undefined;

    const itunesImageHref = firstMatch(
      itemXml,
      /<itunes:image[^>]*href="([^"]+)"[^>]*\/?>/i
    );

    const slug =
      // als er ergens al een slug/uid zit in guid, gebruiken we die (optioneel)
      makeSlug(rawTitle) || `episode-${Math.random().toString(16).slice(2)}`;

    return {
      title: rawTitle || "Aflevering",
      slug,
      pubDate,
      description,
      audioUrl: decodeHtmlEntities(enclosureUrl),
      duration: duration ? decodeHtmlEntities(duration) : undefined,
      imageUrl: itunesImageHref ? decodeHtmlEntities(itunesImageHref) : undefined,
    };
  });

  // nieuwste eerst (meestal al zo, maar we forceren)
  episodes.sort((a, b) => {
    const da = new Date(a.pubDate).getTime() || 0;
    const db = new Date(b.pubDate).getTime() || 0;
    return db - da;
  });

  return episodes;
}
