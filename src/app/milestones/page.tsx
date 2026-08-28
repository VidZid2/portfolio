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
      <div className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 flex flex-col z-10 relative">
        <div className="relative pt-0 pb-0">
          <GoalMilestoneList showAll={true} />
        </div>
      </div>
    </BlueprintGrid>
  );
}

