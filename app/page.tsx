import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceCards } from "@/components/services/ServiceCards";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[var(--header-h)]">
        <Hero />
        <ServiceCards />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
