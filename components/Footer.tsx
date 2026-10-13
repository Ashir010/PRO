import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { services } from "@/data/services";

export function Footer() {
  const year = 2026; // static: avoids a dynamic render under cacheComponents

  return (
    <footer className="border-t">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[26rem]">
          <Logo />
          <p className="mt-4 text-caption text-muted">
            A creative production studio with six specialist teams. Brand name,
            logo and all media on this site are replaceable placeholders.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2.5">
          <span className="eyebrow text-faint">Teams</span>
          {services.map((s) => (
            <Link
              key={s.id}
              href={`#${s.slug}`}
              className="ul-link text-[0.9rem] text-muted transition-colors hover:text-ink"
            >
              {s.title}
            </Link>
          ))}
        </nav>

        <nav aria-label="Footer links" className="flex flex-col gap-2.5">
          <span className="eyebrow text-faint">Go to</span>
          <Link
            href="#services"
            className="ul-link text-[0.9rem] text-muted transition-colors hover:text-ink"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="ul-link text-[0.9rem] text-muted transition-colors hover:text-ink"
          >
            Contact
          </Link>
          <Link
            href="#top"
            className="ul-link text-[0.9rem] text-muted transition-colors hover:text-ink"
          >
            Back to top
          </Link>
        </nav>
      </div>

      <div className="shell border-t py-6">
        <p className="text-caption text-faint">
          © {year} ProMotion (placeholder). Built as a demonstration site.
        </p>
      </div>
    </footer>
  );
}
