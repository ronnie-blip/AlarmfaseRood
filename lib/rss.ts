import Parser from "rss-parser";

const parser = new Parser();

export async function getEpisodes() {
  const feedUrl = process.env.PODCAST_RSS_URL;

  if (!feedUrl) {
    throw new Error("PODCAST_RSS_URL not set");
  }

  const feed = await parser.parseURL(feedUrl);

  return feed.items.map((item: any) => ({
    title: item.title,
    pubDate: item.pubDate,
    audioUrl: item.enclosure?.url,
  }));
}
