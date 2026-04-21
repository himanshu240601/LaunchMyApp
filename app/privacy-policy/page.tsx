import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

const privacySections = [
  {
    title: "Information We Collect",
    points: [
      "We collect account details such as your name, email address, and authentication data when you sign in.",
      "We collect content you create inside LaunchMyApp, including titles, subtitles, export settings, and reviews you choose to submit.",
      "We do not collect or store the screenshots you provide while using the product.",
      "We may collect basic usage information such as pages visited, actions taken in the app, and device or browser details needed to keep the product working well.",
    ],
  },
  {
    title: "How We Use Information",
    points: [
      "We use your information to provide the screenshot creation experience, keep your session active, and let you export your designs.",
      "We use submitted reviews to improve LaunchMyApp and to support the product experience.",
      "We use operational data to monitor product quality, fix bugs, prevent abuse, and improve the overall experience.",
    ],
  },
  {
    title: "Reviews And Public Testimonials",
    points: [
      "If you submit a review through LaunchMyApp, we may store the rating, your name, what you do, and your review message.",
      "Submitted reviews may be stored for product learning, support, and service improvement purposes.",
    ],
  },
  {
    title: "Storage And Security",
    points: [
      "We use third-party infrastructure, including Supabase, to store authentication data and product data securely.",
      "You are responsible for keeping access to your account secure on your own devices and browsers.",
    ],
  },
  {
    title: "Your Choices",
    points: [
      "You can request removal of public testimonials or ask questions about your data by contacting us.",
      "If we materially change this Privacy Policy, we may update this page to reflect those changes.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:p-12">
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              This Privacy Policy explains how LaunchMyApp collects, uses, and protects
              information when you use our App Store screenshot creator. Effective date:
              April 21, 2026.
            </p>

            <div className="mt-12 space-y-10">
              {privacySections.map((section, index) => (
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
