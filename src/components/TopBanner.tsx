"use client";

import React from "react";
import { CurrentTime } from "@/components/CurrentTime";

export function TopBanner() {
  return (
    <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black">
      {/* Live Digital Clock */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
