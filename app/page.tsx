import type { Metadata } from "next";

import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { faqItems } from "@/data/landing-content";

export const metadata: Metadata = {
  title: "App Store Screenshot Generator for iPhone Apps",
  description:
    "Create polished iPhone App Store screenshots with better messaging, storefront-style preview, and export-ready layouts.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LaunchMyApp",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    description:
      "LaunchMyApp is an App Store screenshot generator for turning raw iPhone screenshots into polished listing assets.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      {/* <PricingSection /> */}
      <FaqSection />
      <Footer />
    </main>
  );
}
