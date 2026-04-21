import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

const termsSections = [
  {
    title: "Using LaunchMyApp",
    points: [
      "LaunchMyApp is a tool for creating App Store screenshot assets and related marketing visuals for your own products and projects.",
      "You agree to use the product lawfully and not to upload or create content that infringes rights, breaks the law, or harms the service or other users.",
      "We may update, improve, pause, or remove features over time as the product evolves.",
    ],
  },
  {
    title: "Accounts And Access",
    points: [
      "Some parts of LaunchMyApp may require signing in before you can create, export, or manage content.",
      "You are responsible for activity that happens through your account and for maintaining secure access to your signed-in sessions.",
      "We may suspend access if we believe the service is being abused or used in a way that creates risk for the product or other users.",
    ],
  },
  {
    title: "Your Content",
    points: [
      "You retain responsibility for the screenshots, copy, and other materials you upload or create in LaunchMyApp.",
      "You give us the limited rights needed to host, process, and display that content in order to operate the product.",
      "If you submit a review, testimonial, or feedback, we may use it internally and, where appropriate, publicly in connection with LaunchMyApp.",
    ],
  },
  {
    title: "Exports And Availability",
    points: [
      "We aim to provide reliable exports and previews, but we do not guarantee uninterrupted availability or error-free operation at all times.",
      "You are responsible for reviewing exported assets before submitting them to the App Store or using them in production marketing materials.",
      "We may place reasonable limits on usage, exports, or features as the product grows.",
    ],
  },
  {
    title: "Liability And Changes",
    points: [
      "LaunchMyApp is provided on an as-available basis, and to the extent permitted by law, we do not provide guarantees beyond what is explicitly stated.",
      "We are not responsible for indirect, incidental, or consequential losses arising from your use of the product.",
      "We may update these Terms & Conditions from time to time by revising this page.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:p-12">
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Terms &amp; Conditions
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              These Terms &amp; Conditions describe the rules for using LaunchMyApp, including
              account access, content, exports, and general use of the product. Effective
              date: April 21, 2026.
            </p>

            <div className="mt-12 space-y-10">
              {termsSections.map((section, index) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-base leading-8 text-muted-foreground">
                    {section.points.map((point) => (
                      <p key={point}>{point}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
