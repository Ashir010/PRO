import { site } from "@/data/services";
import { ContactForm } from "@/components/contact/ContactForm";
import { SpinningLogo } from "@/components/contact/SpinningLogo";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact ProMotion"
      className="border-t bg-fill/60"
      style={{ scrollMarginTop: "var(--header-h)" }}
    >
      <div className="shell grid grid-cols-1 gap-x-14 gap-y-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
        <div>
          <SpinningLogo />
          <h2 className="font-display mt-7 text-[length:var(--text-h2)] font-medium leading-[1.08] tracking-[-0.015em] text-ink">
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
