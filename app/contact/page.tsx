export default function Page() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-muted max-w-3xl leading-relaxed">
        Voor samenwerkingen, vragen of gast-aanmeldingen.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-panel p-6">
          <div className="font-semibold">E-mail</div>
          <p className="mt-2 text-sm text-muted">
            <a className="underline decoration-white/20 hover:decoration-white/50" href="mailto:info@alarmfaserood.nl">
              info@alarmfaserood.nl
            </a>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-panel p-6">
          <div className="font-semibold">Instagram</div>
          <p className="mt-2 text-sm text-muted">
            <a className="underline decoration-white/20 hover:decoration-white/50" target="_blank" rel="noreferrer"
              href="https://www.instagram.com/alarmfaseroodpodcast/">
              @alarmfaseroodpodcast
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
