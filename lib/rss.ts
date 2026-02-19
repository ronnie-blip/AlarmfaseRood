import { XMLParser } from "fast-xml-parser";

export type Episode = {
  title: string;
  pubDate: string;
  description?: string;
  audioUrl?: string;
  duration?: string;
};

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function stripHtml(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Fetch & parse Springcast RSS safely.
 * - Uses browser-like headers to reduce 403 blocks
 * - Never throws: returns [] on any error (so your page doesn't crash)
 */
export async function getEpisodes(): Promise<Episode[]> {
  const rssUrl = process.env.PODCAST_RSS_URL;

  if (!rssUrl) {
    console.error("PODCAST_RSS_URL is not set");
    return [];
  }

  try {
    const res = await fetch(rssUrl, {
      headers: {
        // Springcast is stricter for server-to-server requests; this helps
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept:
          "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
      },
      // prevent build-time caching issues, refresh every 5 minutes
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`RSS fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      processEntities: false,
      removeNSPrefix: false,
    });

    const data = parser.parse(xml);

    const channel = data?.rss?.channel;
    const items = toArray<any>(channel?.item);

    const episodes = items
      .map((it) => {
        const enclosureUrl = it?.enclosure?.["@_url"];
        const title = (it?.title ?? "").toString().trim();
        const pubDate = (it?.pubDate ?? "").toString().trim();

        const descriptionRaw =
          (it?.["itunes:summary"] ??
            it?.description ??
            it?.["content:encoded"] ??
            "") + "";

        const duration = (it?.["itunes:duration"] ?? "").toString().trim();

        return {
          title: title || "Aflevering",
          pubDate,
          description: stripHtml(descriptionRaw),
          audioUrl: (enclosureUrl ?? "").toString().trim(),
          duration,
        } as Episode;
      })
      // alleen afleveringen met audio tonen
      .filter((e) => !!e.audioUrl);

    return episodes;
  } catch (err) {
    console.error("RSS fetch/parse error:", err);
    return [];
  }
}
