import Image from "next/image";
import Link from "next/link";
import { getEpisodes } from "@/lib/rss";

function formatDate(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });
}

export default async function HomePage() {
  const episodes = await getEpisodes();

  const latest = episodes[0];
  const more = episodes.slice(1, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* LINKS */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-red-500 sm:text-5xl">
            ALARMFASE ROOD
          </h1>

          <div className="relative w-full max-w-xl">
            <Image
              src="/images/crew-strip.png"
              alt="Crew van hulpverleners"
              width={1100}
              height={460}
              className="object-contain"
              priority
            />
          </div>

          {/* ✅ AANGEPASTE HERO TEKST */}
          <p className="text-base leading-relaxed text-white/80">
            Alarmfase Rood is de podcast waar de pieper afgaat en het echte verhaal begint.
            Hulpverleners en professionals vertellen openhartig over incidenten, keuzes
            en de impact achter de sirenes. Rauw, eerlijk en met respect voor het vak.
            Wil jij jouw verhaal delen?
            {" "}
            <a
              href="mailto:info@alarmfaserood.nl"
              className="font-semibold underline underline-offset-4"
            >
              Mail ons
            </a>.
          </p>
        </div>

        {/* RECHTS */}
        <aside className="space-y-6">
          {latest && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                Nieuwste aflevering
              </p>

              <h2 className="mt-1 text-sm font-semibold leading-snug text-red-500">
                {latest.title}
              </h2>

              <p className="text-xs text-white/60">{formatDate(latest.date)}</p>

              <audio
                controls
                className="mt-3 w-full scale-95 origin-left"
                aria-label={latest.title}
              >
                <source src={latest.audioUrl} />
              </audio>
            </div>
          )}

          <div className="h-4" />

          {more.map((ep) => (
            <div key={ep.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold leading-snug">{ep.title}</h3>
              <p className="text-xs text-white/60">{formatDate(ep.date)}</p>

              <audio
                controls
                className="mt-2 w-full scale-95 origin-left"
                aria-label={ep.title}
              >
                <source src={ep.audioUrl} />
              </audio>
            </div>
          ))}

          <Link
            href="/afleveringen"
            className="pt-2 text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
          >
            Bekijk alle afleveringen →
          </Link>
        </aside>
      </section>
    </main>
  );
}
