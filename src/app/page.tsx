import { Audience } from "@/components/Audience";
import { Curriculum } from "@/components/Curriculum";
import { Faq, FaqJsonLd } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Guarantee } from "@/components/Guarantee";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Instructor } from "@/components/Instructor";
import { Pains } from "@/components/Pains";
import { Pricing } from "@/components/Pricing";
import { StickyCta } from "@/components/StickyCta";
import { Testimonials } from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Hero />
        <Pains />
        <Curriculum />
        <Audience />
        <Instructor />
        <Testimonials />
        <Pricing />
        <Guarantee />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <FaqJsonLd />
    </>
  );
}
