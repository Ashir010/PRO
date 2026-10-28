"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/40 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
      style={{ height: "var(--header-h)" }}
    >
      <div className="shell flex h-full items-center justify-between gap-4">
        <Link href="#top" aria-label="ProMotion — back to top" className="rounded-sm">
          <Logo tone="light" />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-8">
          <Link
            href="#services"
            className="ul-link hidden text-[0.95rem] text-white/70 transition-colors hover:text-white sm:inline-flex"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="ul-link hidden text-[0.95rem] text-white/70 transition-colors hover:text-white sm:inline-flex"
          >
            Contact
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center rounded-full bg-[#F4EEE8] px-4 py-2 text-[0.9rem] font-semibold text-ink transition-opacity duration-300 hover:opacity-90"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
