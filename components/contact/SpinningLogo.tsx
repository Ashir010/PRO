"use client";

import { motion } from "motion/react";
import { LogoMark } from "@/components/ui/Logo";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/** Tasteful logo placeholder with a slow continuous spin (off for reduced motion). */
export function SpinningLogo() {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="h-16 w-16 text-ink/70"
      animate={reduced ? undefined : { rotate: 360 }}
      transition={
        reduced
          ? undefined
          : { duration: 22, ease: "linear", repeat: Infinity }
      }
    >
      <LogoMark className="h-full w-full" />
    </motion.div>
  );
}
