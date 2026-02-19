import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold">Alarmfase Rood</div>
          <p className="mt-2 text-muted">
            Verhalen uit de frontlinie: brandweer, politie, ambulance, defensie en meldkamer.
          </p>
          <p className="mt-4 text-muted">© {year}</p>
        </div>
        <div className="text-muted">
          <div className="font-semibold text-text">Links</div>
          <ul className="mt-2 space-y-1">
            <li><Link href="/afleveringen">Afleveringen</Link></li>
            <li><Link href="/over-ons">Over ons</Link></li>
            <li><Link href="/gast-worden">Gast worden</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="text-muted">
          <div className="font-semibold text-text">Luister</div>
          <ul className="mt-2 space-y-1">
            <li><a href="https://app.springcast.fm/podcast/alarmfase-rood" target="_blank" rel="noreferrer">Springcast pagina</a></li>
            <li><a href="https://www.instagram.com/alarmfaseroodpodcast/" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
