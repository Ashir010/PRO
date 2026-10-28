import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceCards } from "@/components/services/ServiceCards";
import { StackedServices } from "@/components/StackedServices";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/Footer";
import { ServiceExpandProvider } from "@/components/services/ServiceExpand";
import { GlowBackground } from "@/components/media/GlowBackground";

export default function Home() {
  return (
    <ServiceExpandProvider>
      <GlowBackground />
      <Header />
      <main className="flex-1 pt-[var(--header-h)]">
        <Hero />
        <ServiceCards />
        <StackedServices />
        <Contact />
      </main>
      <Footer />
    </ServiceExpandProvider>
  );
}
