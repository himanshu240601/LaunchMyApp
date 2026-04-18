"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { navItems } from "@/data/landing-content";

import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
            <Image
              src="/brand-icon-2026.png"
              alt="LaunchMyApp logo"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">LaunchMyApp</p>
            <p className="text-xs text-muted-foreground">App Store Screenshot Generator</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/create" className={buttonVariants({ size: "lg", className: "gap-2" })}>
          Try it for Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
