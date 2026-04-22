"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSupabaseSession } from "@/lib/supabase/use-supabase-session";

const INITIAL_FORM = {
  company: "",
  email: "",
  message: "",
  name: "",
};

export function ContactForm() {
  const { isAuthenticated, isLoading } = useSupabaseSession();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    (isAuthenticated || form.name.trim().length > 0) &&
    (isAuthenticated || form.email.trim().length > 0) &&
    form.message.trim().length > 0;

  const updateField = (field: keyof typeof INITIAL_FORM, value: string) => {
    setSubmitted(false);
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    setSubmitted(true);
    setForm(INITIAL_FORM);
  };

  return (
    <section>
      {!isAuthenticated ? (
        <>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Send us a message
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Share your question, feedback, or request and we&apos;ll have this ready
            as the main contact intake flow.
          </p>
        </>
      ) : null}

      <form className={isAuthenticated ? "space-y-4" : "mt-6 space-y-4"} onSubmit={handleSubmit}>
        {!isAuthenticated ? (
          <>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Name</span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Your name"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="you@example.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Company or App</span>
              <input
                value={form.company}
                onChange={(event) => updateField("company", event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Optional"
              />
            </label>
          </>
        ) : null}

        <label className="block space-y-2">
          {!isAuthenticated ? (
            <span className="text-sm font-medium text-foreground">Message</span>
          ) : null}
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="min-h-36 w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            placeholder="Tell us how we can help."
          />
        </label>

        {submitted ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Thanks. Your message is sent.
          </p>
        ) : null}

        <Button type="submit" className="rounded-full" disabled={!isValid || isLoading}>
          Send Message
        </Button>
      </form>
    </section>
  );
}
