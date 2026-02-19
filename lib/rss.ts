import { XMLParser } from "fast-xml-parser";

const RSS_URL = process.env.PODCAST_RSS_URL!;

export async function getEpisodes() {
  try {
    const response = await fetch(RSS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AlarmfaseRoodBot/1.0)",
        "Accept": "application/rss+xml, application/xml"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false
    });

    const json = parser.parse(xml);

    const items = json?.rss?.channel?.item;

    if (!items) return [];

    const episodes = Array.isArray(items) ? items : [items];

    return episodes.map((item: any) => ({
      title: item.title,
      pubDate: item.pubDate,
      audioUrl: item.enclosure?.["@_url"]
    }));

  } catch (error) {
    console.error("RSS Error:", error);
    return [];
  }
}
