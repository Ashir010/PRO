"use client";

import { motion } from "motion/react";
import { LogoMark } from "@/components/ui/Logo";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/** Logo placeholder with a slow continuous spin (off for reduced motion). */
export function SpinningLogo() {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="h-16 w-16"
      style={{ color: "#F4EEE8", ["--accent" as string]: "#E8643C" }}
      animate={reduced ? undefined : { rotate: 360 }}
      transition={
        reduced ? undefined : { duration: 24, ease: "linear", repeat: Infinity }
      }
    >
      <LogoMark className="h-full w-full" />
    </motion.div>
  );
}
