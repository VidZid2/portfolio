import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

const resumePath = "/Josiah-De-Asis-Resume.pdf";

export const metadata: Metadata = {
  title: "Resume | Josiah De Asis",
  description: "Resume of Josiah De Asis, full-stack developer and open-source contributor.",
};

export default function ResumePage() {
  return (
    <BlueprintGrid
      showRightNavbar={false}
      headerSlot={
        <SubpageHeader
          title="Resume"
          subtitle="Josiah De Asis"
          backHref="/"
        />
      }
    >
      <section className="relative z-10 ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] md:mx-0 flex min-h-screen flex-col px-3 sm:px-4 pb-12 pt-[calc(22vh+112px)]">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-black/10 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-zinc-400">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                Josiah De Asis Resume
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                PDF document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumePath}
              download="Josiah-De-Asis-Resume.pdf"
              aria-label="Download resume"
              title="Download resume"
            >
              <SoftPillButton
                as="span"
                variant="primary"
                className="px-3 py-1.5 !text-[12px]"
              >
                <span className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </span>
              </SoftPillButton>
            </a>
          </div>
        </div>

        <div className="relative flex h-[calc(100vh-200px)] min-h-[600px] w-full flex-col overflow-hidden rounded-[6px] border border-black/10 bg-background shadow-sm dark:border-white/10">
          <PDFViewer src={resumePath} className="flex-1" />
        </div>

        <div className="relative mt-8">
          <div
            className="pointer-events-none absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15]"
            style={{
              maskImage:
                DOT_MASK_HORIZONTAL.maskImage,
              WebkitMaskImage:
                DOT_MASK_HORIZONTAL.WebkitMaskImage,
            }}
          />
          <div className="pointer-events-none absolute -left-4 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" />
          <div className="pointer-events-none absolute -right-4 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" />
        </div>
      </section>
    </BlueprintGrid>
  );
}

