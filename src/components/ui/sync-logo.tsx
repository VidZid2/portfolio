"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SyncLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function SyncLogo({ className, ...props }: SyncLogoProps) {
  return (
    <svg
      viewBox="0 0 2048 2048"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
      aria-hidden="true"
      {...props}
    >
      <g transform="translate(0, 2048) scale(0.1, -0.1)">
        <path d="M9515 15593 c-396 -395 -1487 -1480 -2423 -2412 l-1704 -1696 204 -199 c111 -109 339 -334 505 -499 l302 -301 380 385 379 384 -121 122 -121 122 1659 1653 c912 909 1661 1653 1665 1653 4 0 515 -506 1135 -1124 l1128 -1124 -271 -270 -271 -271 -253 250 c-139 137 -533 525 -876 863 l-622 614 -377 -378 -376 -377 174 -172 c96 -94 320 -315 499 -491 179 -176 662 -653 1073 -1059 l748 -739 47 44 c96 90 350 337 800 778 l463 454 156 -155 155 -155 -338 -334 c-550 -543 -1632 -1608 -2157 -2124 -268 -263 -486 -483 -484 -489 2 -5 170 -173 374 -373 l370 -363 364 357 c200 196 614 602 919 902 697 686 2337 2290 2408 2355 28 27 52 54 52 61 0 7 -807 815 -1792 1796 -986 981 -2073 2062 -2416 2404 -342 341 -626 621 -630 622 -4 1 -331 -320 -727 -714z" />
        <path d="M8997 12524 c-208 -203 -611 -598 -947 -929 -162 -160 -491 -482 -730 -715 -967 -944 -1398 -1366 -1647 -1613 -143 -143 -267 -263 -275 -268 -9 -6 258 -279 982 -1002 1596 -1592 3842 -3818 3859 -3825 4 -1 515 505 1136 1126 622 621 1712 1706 2423 2412 l1292 1284 -252 254 c-139 139 -365 362 -501 494 l-248 242 -225 -225 c-124 -123 -293 -295 -376 -382 l-152 -158 116 -116 116 -116 -1654 -1661 c-911 -914 -1660 -1661 -1665 -1661 -5 0 -516 508 -1137 1128 l-1128 1128 268 267 c148 147 274 269 279 271 6 2 138 -122 293 -276 268 -266 1168 -1149 1364 -1338 l93 -89 374 374 374 375 -217 210 c-337 325 -1539 1501 -1923 1882 -190 189 -349 343 -354 343 -11 0 -86 -72 -748 -724 -307 -302 -559 -547 -560 -544 -1 2 -71 73 -155 159 l-152 155 297 294 c314 311 441 436 1820 1795 l863 849 -371 365 c-205 201 -376 368 -381 370 -5 1 -73 -59 -151 -135z" />
      </g>
    </svg>
  );
}

interface AnimatedSyncLogoProps {
  className?: string;
  size?: number | string;
}

export function AnimatedSyncLogo({ className, size }: AnimatedSyncLogoProps) {
  return (
    <motion.div
      className={cn("relative flex items-center justify-center select-none cursor-pointer group", className)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [-4, 4, -4],
        rotate: [-1.2, 1.2, -1.2],
      }}
      transition={{
        opacity: { duration: 0.8, ease: "easeOut" },
        scale: { duration: 0.8, ease: "easeOut" },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.1, rotate: 0 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Dynamic Backlight Aura */}
      <motion.div
        className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#6495ED]/35 via-[#818cf8]/25 to-transparent blur-xl pointer-events-none"
        animate={{
          scale: [0.9, 1.2, 0.9],
          opacity: [0.45, 0.8, 0.45],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SVG Diamond Monogram */}
      <svg
        viewBox="0 0 2048 2048"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size ?? "100%", height: size ?? "100%" }}
        className="relative z-10 size-14 sm:size-16 drop-shadow-[0_4px_16px_rgba(100,149,237,0.45)] dark:drop-shadow-[0_0_20px_rgba(100,149,237,0.65)] transition-transform duration-300"
        aria-label="SYNC Logo"
        role="img"
      >
        <defs>
          <linearGradient id="sync-gradient-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#6495ED" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="sync-gradient-b" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#6495ED" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <g transform="translate(0, 2048) scale(0.1, -0.1)">
          {/* Top-left interlocking chevron */}
          <path
            fill="url(#sync-gradient-a)"
            d="M9515 15593 c-396 -395 -1487 -1480 -2423 -2412 l-1704 -1696 204 -199 c111 -109 339 -334 505 -499 l302 -301 380 385 379 384 -121 122 -121 122 1659 1653 c912 909 1661 1653 1665 1653 4 0 515 -506 1135 -1124 l1128 -1124 -271 -270 -271 -271 -253 250 c-139 137 -533 525 -876 863 l-622 614 -377 -378 -376 -377 174 -172 c96 -94 320 -315 499 -491 179 -176 662 -653 1073 -1059 l748 -739 47 44 c96 90 350 337 800 778 l463 454 156 -155 155 -155 -338 -334 c-550 -543 -1632 -1608 -2157 -2124 -268 -263 -486 -483 -484 -489 2 -5 170 -173 374 -373 l370 -363 364 357 c200 196 614 602 919 902 697 686 2337 2290 2408 2355 28 27 52 54 52 61 0 7 -807 815 -1792 1796 -986 981 -2073 2062 -2416 2404 -342 341 -626 621 -630 622 -4 1 -331 -320 -727 -714z"
          />
          {/* Bottom-right interlocking chevron */}
          <path
            fill="url(#sync-gradient-b)"
            d="M8997 12524 c-208 -203 -611 -598 -947 -929 -162 -160 -491 -482 -730 -715 -967 -944 -1398 -1366 -1647 -1613 -143 -143 -267 -263 -275 -268 -9 -6 258 -279 982 -1002 1596 -1592 3842 -3818 3859 -3825 4 -1 515 505 1136 1126 622 621 1712 1706 2423 2412 l1292 1284 -252 254 c-139 139 -365 362 -501 494 l-248 242 -225 -225 c-124 -123 -293 -295 -376 -382 l-152 -158 116 -116 116 -116 -1654 -1661 c-911 -914 -1660 -1661 -1665 -1661 -5 0 -516 508 -1137 1128 l-1128 1128 268 267 c148 147 274 269 279 271 6 2 138 -122 293 -276 268 -266 1168 -1149 1364 -1338 l93 -89 374 374 374 375 -217 210 c-337 325 -1539 1501 -1923 1882 -190 189 -349 343 -354 343 -11 0 -86 -72 -748 -724 -307 -302 -559 -547 -560 -544 -1 2 -71 73 -155 159 l-152 155 297 294 c314 311 441 436 1820 1795 l863 849 -371 365 c-205 201 -376 368 -381 370 -5 1 -73 -59 -151 -135z"
          />
        </g>
      </svg>
    </motion.div>
  );
}
