import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo image (plaats bestand in /public/images/alarmfase-logo.png) */}
      <div className="relative h-10 w-[64px] shrink-0">
        <Image
          src="/images/alarmfase-logo.png"
          alt="Alarmfase Rood logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="leading-tight">
        <div className="text-sm font-semibold text-white">Alarmfase Rood</div>
        <div className="text-xs text-muted">Podcast</div>
      </div>
    </div>
  );
}
