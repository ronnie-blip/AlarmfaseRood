import Image from "next/image";
import { getEpisodes, getPodcastMeta } from "@/lib/rss";
import { EpisodeCard } from "@/components/EpisodeCard";

export const dynamic = "force-static";

export default async function Page() {
  const meta = await getPodcastMeta();
  const episodes = await getEpisodes();

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="grid items-start gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Afleveringen
          </h1>

          {/* Mooier uitgelijnde alinea’s */}
          <div className="mt-4 space-y-4 max-w-2xl text-muted leading-relaxed">
            <p>
              Alarmfase Rood is de podcast waar de pieper afgaat en het echte verhaal begint.
              Hulpverleners en andere professionals vertellen openhartig over incidenten
              die je normaal alleen in het nieuws ziet – en over wat dat met je doet als mens.
            </p>

            <p>
              Rauw uit de realiteit, adrenaline, kameraadschap en eerlijke gesprekken
              achter de schermen van de hulpverlening.
              Voor iedereen die wil weten wat er gebeurt ná de sirenes.
            </p>

            <p>
              Ben je enthousiast en wil je jouw verhaal delen?
              Stuur een e-mail naar{" "}
              <a
                href="mailto:info@alarmfaserood.nl"
                className="font-semibold underline underline-offset-4"
              >
                info@alarmfaserood.nl
              </a>.
            </p>
          </div>
        </div>

        {/* Logo rechts */}
        <div className="hidden md:flex items-start">
          <Image
            src="/images/alarmfase-logo.png"
            alt="Alarmfase Rood logo"
            width={140}
            height={140}
            className="object-contain opacity-90"
            priority
          />
        </div>
      </div>

      {/* Afleveringen */}
      <div className="mt-10 grid gap-4">
        {episodes.map((ep) => (
          <EpisodeCard key={ep.id} ep={ep} />
        ))}
      </div>
    </div>
  );
}
