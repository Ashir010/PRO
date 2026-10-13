import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TeamsIntro } from "@/components/TeamsIntro";
import { ServiceCards } from "@/components/services/ServiceCards";
import { ServiceStack } from "@/components/services/ServiceStack";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />

        {/* Intro + clickable cards; nav "Services" lands here */}
        <section
          id="services"
          aria-label="Our six specialist teams"
          className="pt-8 pb-16 sm:pb-20"
          style={{ scrollMarginTop: "var(--header-h)" }}
        >
          <TeamsIntro />
          <ServiceCards />
        </section>

        {/* Signature stacked panels (desktop) / stacked-reveal (mobile) */}
        <ServiceStack />

        <Contact />
      </main>
      <Footer />
    </>
  );
}
