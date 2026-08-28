"use client";

import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { motion } from "framer-motion";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

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
            className="absolute bleed-x h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={DOT_MASK_HORIZONTAL}
          />
        </div>
      </motion.div>
    </BlueprintGrid>
  );
}

