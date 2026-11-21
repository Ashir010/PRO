import { ContactForm } from "@/components/contact/ContactForm";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact ProMotion"
      className="text-ink"
      style={
        { scrollMarginTop: "var(--header-h)", ["--accent" as string]: "#E66B4B" } as React.CSSProperties
      }
    >
      <div className="shell pb-20 pt-8 lg:pb-28 lg:pt-10">
        <ContactForm />
      </div>
    </section>
  );
}
