import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/50 py-8">
      <div className="container flex flex-col gap-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden">
              <Image
                src="/brand-icon-2026.png"
                alt="LaunchMyApp logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">LaunchMyApp</p>
              <p>&copy; 2026 LaunchMyApp. All rights reserved.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <Link href="#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          {/* <Link href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link> */}
          <Link href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}
