import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://launch-my-ras49d059-him83601-6794s-projects.vercel.app";

const routes = [
  "",
  "/contact",
  "/how-to-make-app-store-screenshots",
  "/iphone-app-store-screenshot-sizes",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.5,
  }));
}
