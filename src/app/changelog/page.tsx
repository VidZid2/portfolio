"use client";

import React from "react";
import Markdown from "react-markdown";
import { motion } from "framer-motion";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleIntroScroll,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/components/timescale";

const BIRTH_YEAR = 2000;

type Milestone = {
  year: number;
  content?: string;
};

const MILESTONES: Milestone[] = [
  {
    year: 2000,
    content: "Born in Can Tho, Viet Nam.",
  },
  { year: 2001 },
  { year: 2002 },
  { year: 2003 },
  { year: 2004 },
  { year: 2005 },
  {
    year: 2006,
    content: "Started at Thuan Hung Primary School.",
  },
  { year: 2007 },
  { year: 2008 },
  { year: 2009 },
  { year: 2010 },
  {
    year: 2011,
    content: "Started at Thuan Hung Secondary School.",
  },
  { year: 2012 },
  { year: 2013 },
  {
    year: 2014,
    content: `Started learning to code and built my first website.

Won awards:

- 1st Prize — Can Tho City Young Informatics Contest 2014
- Consolation Prize — National Young Informatics Contest 2014

Visited Ha Noi, the capital, for the first time.`,
  },
  {
    year: 2015,
    content: `Won awards:

- 3rd Prize — Can Tho City Young Informatics Contest 2015
- Consolation Prize — National Young Informatics Contest 2015
- Outstanding Student — Most Outstanding Student of the District
- 2nd Prize — Can Tho City Youth and Children’s Creativity Contest 2015
- 3rd Prize — Can Tho City Science and Engineering Fair 2015

Visited Thu Dau Mot, Binh Duong for the first time.

Admitted to the specialized Computer Science class at Ly Tu Trong High School for the Gifted.`,
  },
  {
    year: 2016,
    content: `Won awards:

- Consolation Prize — Can Tho City Young Informatics Contest 2016
- 1st Prize — Can Tho City Youth and Children’s Creativity Contest 2016
- 3rd Prize — National Young Informatics Contest 2016
- Consolation Prize — National Youth and Children’s Creativity Contest 2016

Visited Quy Nhon, Binh Dinh for the first time, and returned to Ha Noi.`,
  },
  {
    year: 2017,
    content: `Won awards:

- 2nd Prize — Can Tho City Outstanding Student Selection Exam 2016-2017
- Consolation Prize — Can Tho City Young Informatics Contest 2017
- 3rd Prize — Can Tho City Young Informatics Contest 2017
- 2nd Prize — Can Tho City Youth and Children’s Creativity Contest 2017
- Creative Award — Binh Duong Hackathon 2017`,
  },
  {
    year: 2018,
    content: `Won awards:

- 1st Prize — Can Tho City Science and Engineering Fair 2018
- 3rd Prize — Can Tho City Outstanding Student Selection Exam 2017-2018
- 3rd Prize — National Science and Engineering Fair 2018 (ViSEF)
- 3rd Prize — Can Tho City Young Informatics Contest 2018
- 2nd Prize — Can Tho City Youth and Children’s Creativity Contest 2018
- 3rd Prize — National Young Informatics Contest 2018

Earned direct admission to University of Science — VNUHCM, majoring in Information Systems.

Began freelancing and joined Tung Tung as a UI/UX Designer.

Visited Da Lat, Lam Dong and Ba Ria - Vung Tau for the first time.`,
  },
  {
    year: 2019,
    content: `Became a Mobile Developer at Tung Tung.

Won 2nd Prize — Business Startup Competition 2019.`,
  },
  {
    year: 2020,
    content: "Became a Web Developer at Tung Tung.",
  },
  { year: 2021 },
  {
    year: 2022,
    content: `Joined Simplamo as a Senior Frontend Developer and UI Lead.

Launched [ZaDark](https://zadark.com) — 80k+ downloads, 30k+ active users.

Won Bronze Medal — 10th Design, Manufacturing, and Application Award 2022.`,
  },
  { year: 2023 },
  {
    year: 2024,
    content: "Founded [Quaric](https://quaric.com).",
  },
  {
    year: 2025,
    content: `Open-sourced [chanhdai.com](https://github.com/ncdai/chanhdai.com) — 2k+ stars on GitHub.

Released [React Wheel Picker](https://react-wheel-picker.chanhdai.com) — 50k+ weekly downloads, selected for the [Vercel OSS Program](https://vercel.com/open-source-program).

Followed by [shadcn](https://x.com/shadcn) on X.`,
  },
  {
    year: 2026,
    content: `Joined [shadcncraft](https://shadcncraft.com) as a Design Engineer.

Selected for the [Claude for Open Source Program](https://claude.com/contact-sales/claude-for-oss).`,
  },
];

export default function ChangelogPage() {
  return (
    <BlueprintGrid
      headerSlot={
        <SubpageHeader
          title="Timescale & Changelog"
          subtitle="A chronological journey of milestones & evolution"
          backHref="/"
        />
      }
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] md:mx-0 pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 flex flex-col z-10 relative overflow-hidden"
      >
        <div className="relative py-4 w-full">
          <TimescaleIntroScroll>
            <TimescaleRoot className="mt-4">
              <TimescaleHeader>
                <TimescaleAge>Age</TimescaleAge>
                <TimescaleYear>Years</TimescaleYear>
              </TimescaleHeader>

              <TimescaleViewport>
                <TimescaleTrack>
                  <TimescaleRail />

                  {MILESTONES.map((milestone) => (
                    <TimescaleItem key={milestone.year}>
                      <TimescaleTick />

                      <TimescaleAge>{milestone.year - BIRTH_YEAR}</TimescaleAge>
                      <TimescaleYear>{milestone.year}</TimescaleYear>

                      {milestone.content && (
                        <TimescaleContent className="typeset typeset-timescale">
                          <Markdown>{milestone.content}</Markdown>
                        </TimescaleContent>
                      )}
                    </TimescaleItem>
                  ))}
                </TimescaleTrack>
              </TimescaleViewport>
            </TimescaleRoot>
          </TimescaleIntroScroll>
        </div>

        {/* Bottom Blueprint Separator */}
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
