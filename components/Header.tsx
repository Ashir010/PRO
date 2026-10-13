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
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-bg/0"
      }`}
      style={{ height: "var(--header-h)" }}
    >
      <div className="shell flex h-full items-center justify-between gap-4">
        <Link
          href="#top"
          aria-label="ProMotion — back to top"
          className="rounded-sm"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-8">
          <Link
            href="#services"
            className="ul-link hidden text-[0.95rem] text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="ul-link hidden text-[0.95rem] text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Contact
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center rounded-full border border-ink px-4 py-2 text-[0.9rem] font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-bg"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
