"use client";

import { motion } from "motion/react";
import { services } from "@/data/services";
import { ServicePanel } from "@/components/services/ServicePanel";
import { STACK } from "@/config/stack";

/**
 * Natural-flow fallback for reduced-motion and short viewports: a clean vertical
 * sequence of the same panels. No pinning, no scroll-linked movement. Section
 * ids double as the anchor targets. Optional gentle fade-in when motion is allowed.
 */
export function StackFallback({ animate }: { animate: boolean }) {
  return (
    <div id="services" className="shell flex flex-col gap-6 py-10">
      {services.map((service) => (
        <section
          key={service.id}
          id={service.slug}
          aria-label={`${service.title} — ${service.teamLabel}`}
          style={{ scrollMarginTop: "var(--header-h)" }}
        >
          {animate ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: STACK.ease }}
            >
              <ServicePanel service={service} mode="flow" />
            </motion.div>
          ) : (
            <ServicePanel service={service} mode="flow" />
          )}
        </section>
      ))}
    </div>
  );
}
