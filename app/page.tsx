import { getEpisodes } from "../lib/rss";

export default async function Page() {
  const episodes = await getEpisodes();
  const latest = episodes[0];

  return (
    <main style={{ maxWidth: 900, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 48, color: "#ff2d2d" }}>Alarmfase Rood</h1>

      {latest && (
        <div style={{ marginTop: 40 }}>
          <h2>{latest.title}</h2>
          <p style={{ opacity: 0.6 }}>{new Date(latest.pubDate).toLocaleDateString("nl-NL")}</p>
          <audio controls style={{ width: "100%", marginTop: 10 }}>
            <source src={latest.audioUrl} />
          </audio>
        </div>
      )}
    </main>
  );
}
