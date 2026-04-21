import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { ContactForm } from "@/components/legal/contact-form";

const aboutPoints = [
  "LaunchMyApp is built for founders, indie developers, and product teams who want cleaner App Store screenshots without a heavy design workflow.",
  "The product helps turn raw iPhone screenshots into polished marketing assets with titles, subtitles, layouts, preview tooling, and exports tailored for App Store listings.",
  "If you want to ask a question, report an issue, share feedback, or talk about partnerships, this is the right place to reach out.",
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <section className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:p-12">
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              Reach out with your questions, feedback, support needs, or partnership inquiries.
            </p>

            <div className="mt-12">
              <ContactForm />
            </div>
            </section>

            <section className="mt-6 rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(251,245,239,0.92))] p-8 shadow-soft backdrop-blur sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                About
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Built to simplify App Store screenshot creation
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                {aboutPoints.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
