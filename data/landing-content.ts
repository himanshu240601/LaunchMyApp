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
  { label: "Pricing", href: "#pricing" },
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
    title: "Generate polished App Store screens",
    description: "Turn raw captures into branded App Store screens in one flow.",
    icon: ImagePlus,
  },
  {
    title: "Built-in screenshot copy layouts",
    description: "Add headlines and supporting copy that fit the layout automatically.",
    icon: Sparkles,
  },
  {
    title: "Reusable styles for every release",
    description: "Reuse styles across launches, updates, and ASO tests.",
    icon: Layers3,
  },
  {
    title: "Templates built for mobile apps",
    description: "Start from templates tuned for common mobile app flows.",
    icon: Rocket,
  },
  {
    title: "Clean exports without cleanup",
    description: "Export screenshot sets without bouncing through design tools.",
    icon: BrushCleaning,
  },
];

export const steps: StepItem[] = [
  {
    title: "Upload your app screenshots",
    description:
      "Bring in raw simulator or device screenshots from your product as-is. No prep work required.",
  },
  {
    title: "Apply a screenshot style and message",
    description:
      "Choose a polished direction with brand colors, backgrounds, captions that match your app.",
  },
  {
    title: "Export your App Store set",
    description:
      "Download a consistent screenshot set sized and ready for your App Store listing or release update.",
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
