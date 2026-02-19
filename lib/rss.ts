import Parser from "rss-parser";

const parser = new Parser();

export async function getEpisodes() {
  const feedUrl = process.env.PODCAST_RSS_URL;
  if (!feedUrl) throw new Error("PODCAST_RSS_URL not set");

  // Fetch zelf, met headers (voorkomt vaak 403)
  const res = await fetch(feedUrl, {
    cache: "no-store",
    headers: {
      "user-agent": "AlarmfaseRoodSite/1.0 (+https://alarmfaserood.nl)",
      "accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const feed = await parser.parseString(xml);

  return feed.items.map((item: any) => ({
    title: item.title ?? "Aflevering",
    pubDate: item.pubDate,
    audioUrl: item.enclosure?.url,
  }));
}
