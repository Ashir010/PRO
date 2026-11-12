import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = 2026; // static: avoids a dynamic render under cacheComponents

  return (
    <footer className="text-muted">
      <div className="shell flex flex-col gap-10 border-t border-hairline py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[26rem]">
          <Logo tone="light" />
          <p className="mt-4 text-caption">
            A creative production studio with six specialist teams. Brand name,
            logo and all media on this site are replaceable placeholders.
          </p>
        </div>

        <nav aria-label="Go to" className="flex flex-col gap-2.5">
          <span className="eyebrow text-ink/40">Go to</span>
          <Link href="#services" className="ul-link text-[0.9rem] transition-colors hover:text-ink">
            Services
          </Link>
          <Link href="#contact" className="ul-link text-[0.9rem] transition-colors hover:text-ink">
            Contact
          </Link>
          <Link href="#top" className="ul-link text-[0.9rem] transition-colors hover:text-ink">
            Back to top
          </Link>
        </nav>
      </div>

      <div className="shell border-t border-hairline py-6">
        <p className="text-caption text-muted/70">
          © {year} ProMotion (placeholder). Built as a demonstration site.
        </p>
      </div>
    </footer>
  );
}
