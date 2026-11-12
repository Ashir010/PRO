import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = 2026; // static: avoids a dynamic render under cacheComponents

  return (
    <footer className="bg-[#171827] text-[#E5E1DA]">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[26rem]">
          <Logo tone="light" />
          <p className="mt-4 text-caption">
            A creative production studio with six specialist teams. Brand name,
            logo and all media on this site are replaceable placeholders.
          </p>
        </div>

        <nav aria-label="Go to" className="flex flex-col gap-2.5">
          <span className="eyebrow text-white/55">Go to</span>
          <Link href="#services" className="ul-link text-[0.9rem] text-[#F7F5F0] transition-colors hover:text-[#E66B4B]">
            Services
          </Link>
          <Link href="#contact" className="ul-link text-[0.9rem] text-[#F7F5F0] transition-colors hover:text-[#E66B4B]">
            Contact
          </Link>
          <Link href="#top" className="ul-link text-[0.9rem] text-[#F7F5F0] transition-colors hover:text-[#E66B4B]">
            Back to top
          </Link>
        </nav>
      </div>

      <div className="shell border-t border-[#424354] py-6">
        <p className="text-caption text-[#E5E1DA]">
          © {year} ProMotion (placeholder). Built as a demonstration site.
        </p>
      </div>
    </footer>
  );
}
