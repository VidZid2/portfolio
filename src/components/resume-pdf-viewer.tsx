"use client";

import dynamic from "next/dynamic";

// embedpdf is ~400 KB — stream it in after the page shell paints. The
// loading placeholder holds the viewer's layout so nothing shifts.
const PDFViewer = dynamic(
  () => import("@/components/ui/pdf-viewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full animate-pulse bg-zinc-100 dark:bg-[#0a0a0a]"
        aria-busy="true"
        aria-label="Loading PDF viewer"
      />
    ),
  }
);

export function ResumePdfViewer(props: React.ComponentProps<typeof PDFViewer>) {
  return <PDFViewer {...props} />;
}
