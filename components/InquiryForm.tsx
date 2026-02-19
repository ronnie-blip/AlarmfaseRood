"use client";

import React from "react";

type Variant = "verhaal" | "gast";

type Props = {
  variant: Variant;
  emailTo?: string;
};

function labelForVariant(variant: Variant) {
  return variant === "verhaal" ? "Jouw verhaal delen" : "Gast worden";
}

function subjectForVariant(variant: Variant) {
  return variant === "verhaal" ? "Jouw verhaal delen - Alarmfase Rood" : "Gast worden - Alarmfase Rood";
}

function buildMailBody(data: Record<string, string>) {
  const lines = Object.entries(data)
    .filter(([, v]) => v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`);
  return lines.join("\n");
}

export default function InquiryForm({ variant, emailTo = "info@alarmfaserood.nl" }: Props) {
  const [status, setStatus] = React.useState<"idle" | "ok">("idle");
  const [form, setForm] = React.useState({
    naam: "",
    email: "",
    rol: "",
    organisatie: "",
    onderwerp: "",
    verhaal: "",
    anoniem: false,
  });

  const isVerhaal = variant === "verhaal";
  const title = labelForVariant(variant);

  const requiredOk = isVerhaal
    ? form.verhaal.trim().length >= 20
    : form.email.trim().length > 3 && form.onderwerp.trim().length > 3;

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
    setStatus("idle");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!requiredOk) return;

    const body = buildMailBody({
      Type: title,
      Naam: form.naam,
      "E-mail": form.email,
      Functie: form.rol,
      Organisatie: form.organisatie,
      Onderwerp: form.onderwerp,
      "Anoniem blijven": form.anoniem ? "Ja" : "Nee",
      Bericht: form.verhaal,
    });

    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(
      subjectForVariant(variant)
    )}&body=${encodeURIComponent(body)}`;

    // Open mail client
    window.location.href = mailto;
    setStatus("ok");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/70">
        {isVerhaal ? (
          <>
            Deel je verhaal. Je hoeft niet zeker te weten of het “geschikt” is—wij kijken samen wat past.
          </>
        ) : (
          <>
            Wil je als gast aanschuiven? Vertel kort wie je bent en waar je over wilt praten, dan nemen we contact op.
          </>
        )}
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Naam {isVerhaal ? "(optioneel)" : ""}</label>
            <input
              value={form.naam}
              onChange={(e) => onChange("naam", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              placeholder="Bijv. Ronnie"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">
              E-mail {isVerhaal ? "(optioneel, maar handig)" : "(verplicht)"}
            </label>
            <input
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              placeholder="naam@voorbeeld.nl"
              required={!isVerhaal}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Functie / achtergrond</label>
            <input
              value={form.rol}
              onChange={(e) => onChange("rol", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              placeholder="Brandweer / politie / ambulance / zorg / …"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Organisatie (optioneel)</label>
            <input
              value={form.organisatie}
              onChange={(e) => onChange("organisatie", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              placeholder="Regio / dienst / team"
            />
          </div>
        </div>

        {!isVerhaal && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Onderwerp (verplicht)</label>
            <input
              value={form.onderwerp}
              onChange={(e) => onChange("onderwerp", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              placeholder="Waar wil je over praten?"
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-white/80">
            {isVerhaal ? "Jouw verhaal (verplicht)" : "Toelichting / bericht"}
          </label>
          <textarea
            value={form.verhaal}
            onChange={(e) => onChange("verhaal", e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            placeholder={isVerhaal ? "Schrijf hier je verhaal…" : "Beschrijf kort je voorstel…"}
            required={isVerhaal}
          />
          {isVerhaal && <p className="text-xs text-white/50">Tip: 2–3 alinea’s is genoeg om te starten.</p>}
        </div>

        {isVerhaal && (
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.anoniem}
              onChange={(e) => onChange("anoniem", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/30"
            />
            Ik wil (voorlopig) anoniem blijven
          </label>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!requiredOk}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Versturen via e-mail
          </button>

          <a
            href={`mailto:${emailTo}`}
            className="text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
          >
            Liever mailen? {emailTo}
          </a>
        </div>

        {status === "ok" && (
          <p className="text-xs text-white/60">
            Als je mailprogramma niet opent: klik dan op “Liever mailen” hierboven.
          </p>
        )}
      </form>
    </div>
  );
}
