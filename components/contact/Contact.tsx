import { site } from "@/data/services";
import { ContactForm } from "@/components/contact/ContactForm";
import { SpinningLogo } from "@/components/contact/SpinningLogo";
import { CornerLabel } from "@/components/ui/CornerLabel";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact ProMotion"
      className="text-ink"
      style={
        { scrollMarginTop: "var(--header-h)", ["--accent" as string]: "#DC4D01" } as React.CSSProperties
      }
    >
      <div className="shell grid grid-cols-1 gap-x-14 gap-y-10 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div>
          <SpinningLogo />
          <div className="mt-7">
            <CornerLabel>{site.contact.kicker}</CornerLabel>
          </div>
          <h2 className="font-display mt-5 text-[length:var(--text-title)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
            {site.contact.heading}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[length:var(--text-body-lg)] text-muted">
            {site.contact.support}
          </p>
        </div>

        <div className="lg:pt-2">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
