export default function NotFound() {
  return (
    <div className="container py-16">
      <h1 className="text-3xl font-semibold">Pagina niet gevonden</h1>
      <p className="mt-3 text-muted">De pagina bestaat niet (meer).</p>
      <a href="/" className="mt-6 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-muted hover:text-text hover:border-white/20">
        Naar home
      </a>
    </div>
  );
}
