import {
  BrushCleaning,
  ImagePlus,
  Layers3,
  Rocket,
  Sparkles,
} from "lucide-react";

import type {
  BenefitItem,
  FaqItem,
  FeatureItem,
  NavItem,
  PricingTier,
  ProblemItem,
  Stat,
  StepItem,
  TestimonialItem,
  TrustLogo,
  TrustMetric,
} from "@/types/landing";

export const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  // { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const heroStats: Stat[] = [
  { value: "< 5 min", label: "to create a polished screenshot set" },
  { value: "10x", label: "faster than manual design workflows" },
  { value: "0 design tools", label: "required to get started" },
];

export const trustMetrics: TrustMetric[] = [
  { value: "4.9/5", label: "design confidence from early testers" },
  { value: "3 hrs", label: "saved on average per screenshot refresh" },
  { value: "12+ launches", label: "represented in early access feedback" },
];

export const trustLogos: TrustLogo[] = [
  { name: "Indie Launchers" },
  { name: "YC-style Teams" },
  { name: "Product Hunt Makers" },
  { name: "Mobile Studios" },
  { name: "Bootstrapped SaaS" },
];

export const problemItems: ProblemItem[] = [
  {
    title: "Raw screenshots look unfinished",
    description:
      "Most developers can ship a great product, but App Store screenshots still feel like a last-minute design chore.",
  },
  {
    title: "Design help adds cost and delay",
    description:
      "Agencies and freelancers add cost, rounds of feedback, and extra coordination when you just need clean screenshot screens now.",
  },
  {
    title: "Every release needs a fresh screenshot set",
    description:
      "New features, new UI, and new messaging mean rebuilding screenshot layouts over and over right when launch pressure is highest.",
  },
];

export const featureItems: FeatureItem[] = [
  {
    title: "Made for iPhone App Store screenshots",
    description: "Create polished App Store-ready iPhone screenshots without jumping into a full design tool.",
    icon: ImagePlus,
  },
  {
    title: "Add title and subtitle copy fast",
    description: "Write clear headline and subtitle messaging for every screen in a layout built for mobile listings.",
    icon: Sparkles,
  },
  {
    title: "Keep every screenshot consistent",
    description: "Apply the same visual style across your set so your listing feels clean, intentional, and on-brand.",
    icon: Layers3,
  },
  {
    title: "Preview like an App Store listing",
    description: "Review your screenshot sequence in a storefront-style preview before you export.",
    icon: Rocket,
  },
  {
    title: "Export in the right iPhone sizes",
    description: "Download screenshot sets prepared for the iPhone frame sizes you want to ship.",
    icon: BrushCleaning,
  },
];

export const steps: StepItem[] = [
  {
    title: "Upload your iPhone screenshots",
    description:
      "Bring in up to four raw iPhone screenshots from your app. Start with the real product screens you want to show on the App Store.",
  },
  {
    title: "Write your message and style it",
    description:
      "Add titles, subtitles, layout, colors, and frame settings so each screenshot explains the value of your app clearly.",
  },
  {
    title: "Preview and export your listing set",
    description:
      "Check how the sequence will look in an App Store-style preview, then export a finished set ready for your listing.",
  },
];

export const benefits: BenefitItem[] = [
  {
    title: "Made for developers, not designers",
    description: "Move fast without learning a full design workflow.",
  },
  {
    title: "Looks premium out of the box",
    description: "Strong defaults make your screenshots look sharper instantly.",
  },
  {
    title: "Scales with every release",
    description: "Keep releases consistent as your product evolves.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote:
      "We used to patch screenshots together the night before every release. LaunchMyApp made the whole listing feel polished.",
    name: "Ananya Patel",
    role: "Founder, HabitLoop",
  },
  {
    quote:
      "We went from scattered screenshots to a premium App Store set in one afternoon.",
    name: "Marcus Reed",
    role: "Indie iOS Developer",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "For trying the generator with a simple screenshot set.",
    ctaLabel: "Start free for $0",
    features: [
      "Generate 5 screens",
      "Default resolution downloads",
      "Basic layouts",
    ],
  },
  {
    name: "Starter",
    price: "$19",
    description: "For builders creating more complete screenshot sets.",
    featured: true,
    ctaLabel: "Try Starter for $19",
    features: [
      "Generate up to 25 screens",
      "Default resolution downloads",
      "Basic layouts",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    description: "For teams that need more output and better presentation control.",
    ctaLabel: "Try Premium for $49",
    features: [
      "Unlimited screens",
      "High-resolution exports",
      "Premium layouts",
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Is LaunchMyApp a design tool?",
    answer: "Not in the traditional sense. It is a focused tool for creating App Store screenshots fast.",
  },
  {
    question: "Can I use my own brand colors and messaging?",
    answer: "Yes. You can apply your own colors, copy, and visual direction.",
  },
  {
    question: "Does it only focus on App Store screenshots?",
    answer: "Yes. This version is focused on App Store screenshots only.",
  },
  {
    question: "Who is this best for?",
    answer:
      "LaunchMyApp is especially useful for indie developers, startup teams, and agencies shipping mobile apps without dedicated design bandwidth.",
  },
];
