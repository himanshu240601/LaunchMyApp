import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
}: SectionHeadingProps) {
  const titleClass = theme === "dark" ? "text-white" : "text-foreground";
  const descriptionClass = theme === "dark" ? "text-slate-300" : "text-muted-foreground";

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Badge>{eyebrow}</Badge>
      <h2
        className={`font-display mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl ${titleClass}`}
      >
        {title}
      </h2>
      <p className={`mt-4 text-balance text-base leading-7 sm:text-lg ${descriptionClass}`}>
        {description}
      </p>
    </div>
  );
}
