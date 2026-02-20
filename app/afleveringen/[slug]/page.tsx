import { getEpisodes, getPodcastMeta } from "@/lib/rss";
import { formatDate, stripHtml, minutesFromDuration } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamicParams = false;

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  return episodes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = await getPodcastMeta();
  const episodes = await getEpisodes();
  const ep = episodes.find((e) => e.slug === params.slug);
  const title = ep ? ep.title : "Aflevering";
  const description = ep?.subtitle ?? (ep?.description ? stripHtml(ep.description).slice(0, 180) : meta.description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: meta.image ? [{ url: meta.image }] : undefined
    }
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const episodes = await getEpisodes();
  const ep = episodes.find((e) => e.slug === params.slug);

  if (!ep) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-semibold">Aflevering niet gevonden</h1>
        <p className="mt-3 text-muted">Terug naar de lijst.</p>
        <Link href="/afleveringen" className="mt-6 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-muted hover:text-text hover:border-white/20">
          Naar afleveringen
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Link href="/afleveringen" className="text-sm text-muted hover:text-text">← Terug</Link>

      <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight">{ep.title}</h1>

      <div className="mt-3 text-sm text-muted">
        {formatDate(ep.date)}
        {ep.duration ? ` • ${minutesFromDuration(ep.duration)} min` : ""}
      </div>

      {ep.subtitle ? <p className="mt-4 text-lg text-muted max-w-3xl">{(ep as any).subtitle}</p> : null}

      <div className="mt-8 rounded-2xl border border-white/10 bg-panel p-6">
        {ep.audioUrl ? (
          <audio controls className="w-full">
            <source src={ep.audioUrl} />
          </audio>
        ) : (
          <p className="text-sm text-muted">Geen audio-url gevonden in de RSS. Check je feed-instellingen.</p>
        )}
        {ep.link ? (
          <p className="mt-4 text-sm text-muted">
            Liever via Springcast?{" "}
            <a href={ep.link} target="_blank" rel="noreferrer" className="underline decoration-white/20 hover:decoration-white/50">
              Open aflevering
            </a>
          </p>
        ) : null}
      </div>

      {ep.description ? (
        <div className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">Shownotes</h2>
          <div
            className="mt-4 prose prose-invert prose-sm max-w-none prose-a:text-red prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: ep.description }}
          />
        </div>
      ) : null}
    </div>
  );
}
