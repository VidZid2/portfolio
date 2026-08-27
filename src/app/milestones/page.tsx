"use client";

import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import { GoalMilestoneList } from "@/components/GoalMilestoneList";
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

export default function AllMilestonesPage() {
  return (
    <BlueprintGrid
      headerSlot={
        <SubpageHeader
          title="All Goal Milestones"
          subtitle="Future milestones & current progress archive"
          backHref="/"
        />
      }
    >
      {/* Content Section */}
      <div className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] md:mx-0 pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 flex flex-col z-10 relative">
        <div className="relative pt-6 pb-6">
          <GoalMilestoneList showAll={true} />
        </div>

        {/* Bottom Separator */}
        <div className="relative mt-8">
          <div
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                DOT_MASK_HORIZONTAL.maskImage,
              WebkitMaskImage:
                DOT_MASK_HORIZONTAL.WebkitMaskImage,
            }}
          />
        </div>
      </div>
    </BlueprintGrid>
  );
}

