export const metadata = {
  title: "Over ons | Alarmfase Rood",
  description:
    "Wie wij zijn, waarom Alarmfase Rood bestaat en wat gasten kunnen verwachten.",
};

export default function OverOnsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-red-500">
        Over ons
      </h1>

      <div className="mt-6 space-y-6 text-white/80 leading-relaxed">
        <p>
          Alarmfase Rood is een podcast over hulpverlening, gemaakt met respect
          voor het vak en de mensen die het uitoefenen. Wanneer de pieper afgaat
          en de sirenes klinken, begint vaak een verhaal dat je zelden volledig
          hoort in het nieuws.
        </p>

        <p>
          In Alarmfase Rood krijgen hulpverleners en andere professionals de
          ruimte om openhartig te vertellen over hun werk, de keuzes die ze
          moeten maken en de impact die incidenten hebben — zowel tijdens als
          na de inzet. Rauw, eerlijk en zonder sensatie.
        </p>

        <p>
          We geloven dat deze verhalen belangrijk zijn. Niet alleen om meer
          begrip te creëren voor het werk van hulpverleners, maar ook om te
          laten zien wat het menselijk betekent om onder druk te werken, soms
          met ingrijpende gevolgen.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-white">
          Wat kunnen gasten verwachten?
        </h2>

        <ul className="list-disc space-y-2 pl-5">
          <li>Een gesprek in een veilige en respectvolle setting</li>
          <li>Geen sensatie, maar aandacht voor context en nuance</li>
          <li>Ruimte om grenzen aan te geven</li>
          <li>Mogelijkheid tot (gedeeltelijke) anonimiteit</li>
        </ul>

        <h2 className="pt-4 text-lg font-semibold text-white">
          Zorgvuldigheid en privacy
        </h2>

        <p>
          Verhalen in Alarmfase Rood zijn persoonlijk en worden altijd in overleg
          gedeeld. Namen, locaties of details kunnen worden aangepast om de
          privacy van betrokkenen te beschermen. De inhoud van de podcast
          vertegenwoordigt persoonlijke ervaringen en meningen, geen officiële
          standpunten van organisaties of diensten.
        </p>

        <p>
          Heb je vragen, wil je reageren of overweeg je om jouw verhaal te
          delen? Neem gerust contact met ons op.
        </p>

        <p>
          <a
            href="mailto:info@alarmfaserood.nl"
            className="font-semibold underline underline-offset-4"
          >
            info@alarmfaserood.nl
          </a>
        </p>
      </div>
    </main>
  );
}
