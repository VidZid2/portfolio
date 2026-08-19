"use client";

import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { motion } from "framer-motion";

export default function PullRequestsPage() {
  return (
    <BlueprintGrid
      headerSlot={
        <SubpageHeader
          title="Pull Requests"
          subtitle="Open Source Contributions"
          backHref="/"
        />
      }
    >
      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] md:mx-0 pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 flex flex-col z-10 relative"
      >
        <div className="mt-4">
          <OpenSourceContributions isFullPage />
        </div>

        {/* Bottom Separator */}
        <div className="relative mt-8">
          <div
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>
      </motion.div>
    </BlueprintGrid>
  );
}

