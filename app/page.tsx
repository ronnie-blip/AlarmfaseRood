export const dynamic = "force-dynamic";

import { getEpisodes } from "../lib/rss";

export default async function Page() {
  let episodes = [];

  try {
    episodes = await getEpisodes();
  } catch (err) {
    console.error("Error loading episodes:", err);
  }

  const latest = episodes?.length > 0 ? episodes[0] : null;

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "60px auto",
        padding: "0 20px",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1 style={{ fontSize: 48, color: "#ff2d2d" }}>
        Alarmfase Rood
      </h1>

      {!latest && (
        <div style={{ marginTop: 40, opacity: 0.7 }}>
          <h2>Afleveringen laden…</h2>
          <p>
            De podcast is momenteel niet bereikbaar of er zijn nog geen afleveringen.
          </p>
        </div>
      )}

      {latest && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 26 }}>{latest.title}</h2>

          {latest.pubDate && (
            <p style={{ opacity: 0.6 }}>
              {new Date(latest.pubDate).toLocaleDateString("nl-NL")}
            </p>
          )}

          {latest.audioUrl && (
            <audio
              controls
              style={{
                width: "100%",
                marginTop: 10
              }}
            >
              <source src={latest.audioUrl} />
              Je browser ondersteunt geen audio.
            </audio>
          )}

          {latest.description && (
            <p style={{ marginTop: 20, lineHeight: 1.6 }}>
              {latest.description}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
