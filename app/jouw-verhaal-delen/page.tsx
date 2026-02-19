import InquiryForm from "@/components/InquiryForm";

export const metadata = {
  title: "Jouw verhaal delen | Alarmfase Rood",
  description:
    "Deel jouw verhaal met Alarmfase Rood. Laagdrempelig, met respect voor het vak — anoniem kan ook.",
};

export default function JouwVerhaalDelenPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-red-500">
        Jouw verhaal delen
      </h1>

      <p className="mt-3 text-base leading-relaxed text-white/80">
        Heb jij iets meegemaakt tijdens je werk als hulpverlener dat je bij is gebleven? Een incident, een moment of
        een beslissing die je niet loslaat? Je hoeft niet te weten of het “geschikt” is voor de podcast. Deel je
        verhaal—wij kijken samen of en hoe het past.
      </p>

      <div className="mt-8">
        <InquiryForm variant="verhaal" emailTo="info@alarmfaserood.nl" />
      </div>
    </main>
  );
}
