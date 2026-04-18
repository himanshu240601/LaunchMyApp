"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { UploadDropzone } from "@/components/screenshots/UploadDropzone";
import { Button } from "@/components/ui/button";
import { useCreateFlow } from "@/app/create/create-flow-context";

export default function UploadStepPage() {
  const router = useRouter();
  const { slides, handleFilesSelected, removeSlide } = useCreateFlow();

  function handleUpload(files: File[]) {
    handleFilesSelected(files);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Upload Screenshots
        </h2>
        {slides.length ? (
          <Button onClick={() => router.push("/create/edit")} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Continue
          </Button>
        ) : null}
      </div>
      <UploadDropzone
        onFilesSelected={handleUpload}
        uploadedCount={slides.length}
        slides={slides}
        onRemoveSlide={removeSlide}
      />

      {!slides.length ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-background/70 px-6 py-10 text-center text-sm leading-7 text-muted-foreground">
          Start by uploading PNG or JPG screenshots. When you are ready, continue to the text step.
        </div>
      ) : null}
    </section>
  );
}
