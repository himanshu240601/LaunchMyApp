import { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type TrustMetric = {
  label: string;
  value: string;
};

export type TrustLogo = {
  name: string;
};

export type ProblemItem = {
  title: string;
  description: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type StepItem = {
  title: string;
  description: string;
};

export type BenefitItem = {
  title: string;
  description: string;
};

export type TestimonialItem = {
  id?: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

export type PricingTier = {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
  ctaLabel: string;
  features: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};
