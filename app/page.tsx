import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TeamsIntro } from "@/components/TeamsIntro";
import { ServicesShowcase } from "@/components/stack/ServicesShowcase";
import { StackAnchors } from "@/components/stack/StackAnchors";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <StackAnchors />
      <Header />
      <main className="flex-1">
        <Hero />
        <TeamsIntro />

        {/* Peach runway with a rounded bottom; the black contact reveals beneath it */}
        <div className="relative z-10 rounded-b-[2rem] bg-peach">
          <ServicesShowcase />
        </div>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
