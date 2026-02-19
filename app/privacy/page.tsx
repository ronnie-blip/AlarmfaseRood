export const metadata = {
  title: "Privacy & disclaimer | Alarmfase Rood",
  description:
    "Privacyverklaring en disclaimer van Alarmfase Rood (podcast).",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-red-500">
        Privacy & disclaimer
      </h1>

      <p className="mt-3 text-base leading-relaxed text-white/80">
        Hieronder lees je hoe Alarmfase Rood omgaat met privacy, cookies en de inhoud van de podcast en website.
      </p>

      {/* PRIVACY */}
      <section className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Privacy</h2>

        <p className="text-sm leading-relaxed text-white/80">
          Alarmfase Rood verwerkt zo min mogelijk persoonsgegevens. Als je contact met ons opneemt (bijvoorbeeld via
          “Jouw verhaal delen” of “Gast worden”), gebruik je mail (mailto). De inhoud van je bericht wordt dan via jouw
          e-mailprogramma verstuurd.
        </p>

        <div className="space-y-2 text-sm text-white/80">
          <p className="font-semibold text-white">Welke gegevens kunnen we ontvangen?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Naam (als je die invult)</li>
            <li>E-mailadres (als je die invult)</li>
            <li>Inhoud van je bericht/verhaal</li>
          </ul>

          <p className="font-semibold text-white">Waarvoor gebruiken we dit?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Om contact met je op te nemen</li>
            <li>Om te beoordelen of en hoe je verhaal past binnen de podcast</li>
            <li>Voor het plannen en voorbereiden van opnames (alleen als jij dat wilt)</li>
          </ul>

          <p className="font-semibold text-white">Hoe lang bewaren we dit?</p>
          <p className="text-sm leading-relaxed text-white/80">
            We bewaren berichten niet langer dan nodig is voor contact en eventuele voorbereiding. Wil je dat we jouw
            gegevens verwijderen? Mail ons en we regelen het.
          </p>

          <p className="font-semibold text-white">Jouw rechten</p>
          <p className="text-sm leading-relaxed text-white/80">
            Je kunt vragen om inzage, correctie of verwijdering van je gegevens. Stuur hiervoor een e-mail.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="mailto:info@alarmfaserood.nl"
            className="text-sm font-semibold text-white underline underline-offset-4 hover:text-white/90"
          >
            info@alarmfaserood.nl
          </a>
        </div>
      </section>

      {/* COOKIES */}
      <section className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Cookies</h2>

        <p className="text-sm leading-relaxed text-white/80">
          Deze website gebruikt alleen functionele cookies die nodig kunnen zijn om de site goed te laten werken. We
          plaatsen geen trackingcookies om je over andere websites te volgen.
        </p>

        <p className="text-sm leading-relaxed text-white/80">
          Als we in de toekomst statistieken (analytics) toevoegen, dan vermelden we dat hier duidelijk en kiezen we
          bij voorkeur voor privacyvriendelijke instellingen.
        </p>
      </section>

      {/* DISCLAIMER */}
      <section className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Disclaimer</h2>

        <p className="text-sm leading-relaxed text-white/80">
          De verhalen en meningen die in Alarmfase Rood worden gedeeld zijn persoonlijk en bedoeld voor informatieve en
          journalistieke doeleinden. Ze vertegenwoordigen niet automatisch de mening van werkgevers, organisaties of
          betrokken diensten.
        </p>

        <ul className="list-disc pl-5 space-y-1 text-sm text-white/80">
          <li>We gaan zorgvuldig om met privacy en gevoelige informatie.</li>
          <li>Details kunnen (deels) geanonimiseerd of aangepast zijn om personen te beschermen.</li>
          <li>Luisteraars gebruiken informatie uit de podcast op eigen verantwoordelijkheid.</li>
        </ul>
      </section>

      {/* CONTACT */}
      <section className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Contact</h2>

        <p className="text-sm text-white/80">
          Vragen, feedback of wil je iets doorgeven? Mail ons:
        </p>

        <a
          href="mailto:info@alarmfaserood.nl"
          className="text-sm font-semibold text-white underline underline-offset-4 hover:text-white/90"
        >
          info@alarmfaserood.nl
        </a>

        <p className="text-xs text-white/60">
          (Adres/KvK is niet verplicht voor deze site zolang je duidelijk contactinfo aanbiedt. Voeg het toe als je dat
          later wilt.)
        </p>
      </section>
    </main>
  );
}
