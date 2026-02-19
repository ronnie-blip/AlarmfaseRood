import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/afleveringen", label: "Afleveringen" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/gast-worden", label: "Gast worden" },
  { href: "/jouw-verhaal-delen", label: "Jouw verhaal delen" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="no-underline">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="hover:text-text transition-colors"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        {/* Primary CTA */}
        <Link
          href="/jouw-verhaal-delen"
          className="inline-flex items-center rounded-xl bg-red px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,45,45,0.25)] hover:bg-red2"
        >
          Jouw verhaal delen
        </Link>
      </div>
    </header>
  );
}
