import Link from "next/link";
import type { Episode } from "@/lib/rss";
import { formatDate, minutesFromDuration } from "@/lib/utils";

export function EpisodeCard({ ep }: { ep: Episode }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-panel p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted">
            {formatDate(ep.date)}{ep.duration ? ` • ${minutesFromDuration(ep.duration)} min` : ""}
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-snug">
            <Link href={`/afleveringen/${ep.slug}`}>{ep.title}</Link>
          </h3>
          {ep.subtitle ? <p className="mt-2 text-sm text-muted">{ep.subtitle}</p> : null}
        </div>
        <Link
          href={`/afleveringen/${ep.slug}`}
          className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-xs text-muted hover:text-text hover:border-white/20"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
