import InquiryForm from "@/components/InquiryForm";

export const metadata = {
  title: "Gast worden | Alarmfase Rood",
  description:
    "Wil je als gast aanschuiven bij Alarmfase Rood? Vertel wie je bent en waar je over wilt praten.",
};

export default function GastWordenPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-red-500">
        Gast worden
      </h1>

      <p className="mt-3 text-base leading-relaxed text-white/80">
        Wil je als gast aanschuiven bij Alarmfase Rood? We zoeken hulpverleners en professionals die open en eerlijk
        willen vertellen over hun werk, keuzes en de impact daarvan. Vul het formulier in, dan nemen we contact met je op.
      </p>

      <div className="mt-8">
        <InquiryForm variant="gast" emailTo="info@alarmfaserood.nl" />
      </div>
    </main>
  );
}
