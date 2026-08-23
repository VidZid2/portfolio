"use client";

import { useEffect, useState, useRef, useSyncExternalStore, useMemo } from "react";
import { usePathname } from "next/navigation";

export const homeItems = [
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "projects", label: "Projects", icon: "folder" },
  // { id: "opensource", label: "Open Source", icon: "code" }, // Temporarily hidden
  { id: "skills", label: "Skills", icon: "wrench" },
  { id: "blogs", label: "Blog", icon: "book" },
];

export const primaItems = [
  { id: "part-1", label: "Part 1: The Genesis", icon: "file" },
  { id: "part-2", label: "Part 2: Architecture", icon: "file" },
  { id: "part-3", label: "Part 3: Ask AI Helper", icon: "file" },
  { id: "part-4", label: "Part 4: Visuals & Shaders", icon: "file" },
  { id: "part-5", label: "Part 5: Mobile Perf", icon: "file" },
  { id: "part-6", label: "Part 6: Degradation", icon: "file" },
  { id: "part-7", label: "Part 7: The Future", icon: "file" },
];

export function RightNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPrimaDoc = pathname === "/projects/prima-digital-agency/how-its-made";
  const activeItems = useMemo(
    () => (isHome ? homeItems : isPrimaDoc ? primaItems : []),
    [isHome, isPrimaDoc]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [travelDir, setTravelDir] = useState<'down' | 'up'>('down');
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ignore scroll events while we are animating a click-scroll
      if (isClickScrolling.current) return;

      const sections = activeItems.map(item => document.getElementById(item.id));
      // Trigger area is the top 1/3rd of the viewport
      const scrollPosition = window.scrollY + (window.innerHeight / 3); 

      let currentActiveIndex = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          currentActiveIndex = i;
          break;
        }
      }

      // Update state and direction if we scrolled into a new section
      if (currentActiveIndex !== activeIndex) {
        setTravelDir(currentActiveIndex > activeIndex ? 'down' : 'up');
        setActiveIndex(currentActiveIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, activeItems]);

  const handleItemClick = (index: number, id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor jump
    isClickScrolling.current = true;
    
    if (index > activeIndex) setTravelDir('down');
    else if (index < activeIndex) setTravelDir('up');
    
    setActiveIndex(index);

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Give a nice 80px visual padding from the top
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Clear any existing timeout to prevent premature scroll tracking
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Release scroll tracking lock after animation gives time to finish
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000); // Slightly increased to ensure smooth scroll finishes
  };

  if (activeItems.length === 0) return null;

  const ITEM_HEIGHT = 36; 
  const START_X = 10;
  const END_X = 22;
  const MID_X = 16;
  
  // 1. Start the path exactly at the vertical center of the first item
  let basePathD = `M ${START_X} ${ITEM_HEIGHT / 2}`;
  
  for (let i = 0; i < activeItems.length - 1; i++) {
    const startY = (i * ITEM_HEIGHT) + (ITEM_HEIGHT / 2);
    const startX = i % 2 === 0 ? START_X : END_X;
    const endX = (i + 1) % 2 === 0 ? START_X : END_X;
    
    // SVG Sweep flags determine curve direction (0 = counter-clockwise, 1 = clockwise)
    const sweep1 = i % 2 === 0 ? 0 : 1;
    const sweep2 = i % 2 === 0 ? 1 : 0;
    
    // Draw straight line down -> 1st curve -> 2nd curve -> straight line down
    basePathD += ` L ${startX} ${startY + 12}`;
    basePathD += ` A 6 6 0 0 ${sweep1} ${MID_X} ${startY + 18}`;
    basePathD += ` A 6 6 0 0 ${sweep2} ${endX} ${startY + 24}`;
    basePathD += ` L ${endX} ${startY + ITEM_HEIGHT}`;
  }
  
  // SVG browsers calculate curve lengths with slight floating-point rounding errors.
  // We add a tiny, invisible 2px vertical extension to the tracking path to act as a buffer. 
  const trackingPathD = basePathD + ' l 0 2';
  
  // 2. Exact mathematical length of one complete item-to-item segment
  // Straight 12px + Arc1 (3*PI) + Arc2 (3*PI) + Straight 12px
  const SEGMENT_LENGTH = 24 + 6 * Math.PI;
  
  // 3. Since the path starts exactly at dot 0, no extra offset padding is needed
  const currentOffset = activeIndex * SEGMENT_LENGTH;

  // A large enough value to act as the total maximum length of our path
  const PATH_MAX = 1000;

  // 4. Dynamic line length based on whether the item is indented or not!
  // Indented items get a long tail to connect back to the main axis.
  // Flush items get a short tail to stay clean and straight.
  const isIndented = activeIndex % 2 !== 0;
  const dynamicLineLength = isIndented ? SEGMENT_LENGTH : 12;
  
  // Force tail direction at the boundaries so the line doesn't get clipped
  let effectiveDir = travelDir;
  if (activeIndex === 0) {
    effectiveDir = 'up'; // Force tail downwards from the top item
  } else if (activeIndex === activeItems.length - 1) {
    effectiveDir = 'down'; // Force tail upwards from the bottom item
  }

  // Dynamic offset based on travel direction to put the dot at the leading edge
  const lineDashOffset = effectiveDir === 'down' 
    ? -(currentOffset - dynamicLineLength) 
    : -currentOffset;

  const transitionStyle = isMounted 
    ? 'stroke-dashoffset 0.5s cubic-bezier(0.25, 1, 0.5, 1), stroke-dasharray 0.5s cubic-bezier(0.25, 1, 0.5, 1)' 
    : 'none';

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none hidden lg:block"
      style={{ width: 'calc(100vw - var(--removed-body-scroll-bar-size, 0px))' }}
    >
      <nav className="absolute top-[22vh] right-[24.5%] translate-x-full pl-8 pointer-events-auto flex flex-col mt-2 hide-cursor-particles">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase mb-6 ml-2">Index</h3>
        
        {/* Timeline Container */}
        <div className="relative pl-2">
          
          {/* Overlay SVG for drawing paths */}
          <svg 
            className="absolute left-0 top-0 pointer-events-none z-10 overflow-visible" 
            width="40" 
            height={activeItems.length * ITEM_HEIGHT + 24}
          >
            <defs>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="currentColor" floodOpacity="0.2" className="text-zinc-800 dark:text-zinc-200" />
              </filter>
            </defs>

            {/* 1. Static Gray Background Path */}
            <path 
              d={basePathD} 
              stroke="currentColor" 
              className="text-zinc-200 dark:text-zinc-800/50"
              strokeWidth="2" 
              fill="none" 
            />

            {/* 2. Progress Line (Dynamic stretching segment) */}
            <path 
              d={trackingPathD} 
              stroke="currentColor" 
              className="text-zinc-800 dark:text-[#6495ED]"
              strokeWidth="2" 
              fill="none" 
              strokeDasharray={`${dynamicLineLength} ${PATH_MAX}`}
              strokeDashoffset={lineDashOffset}
              style={{ transition: transitionStyle }}
            />

            {/* 3. Active Dot */}
            <path 
              d={trackingPathD} 
              stroke="currentColor" 
              className="text-zinc-800 dark:text-[#6495ED]"
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.01 1000"
              strokeDashoffset={-currentOffset}
              style={{ transition: transitionStyle }}
            />
          </svg>

          {/* List Items */}
          <ul className="relative z-20 flex flex-col m-0 p-0 list-none">
            {activeItems.map((item, index) => {
              const isActive = activeIndex === index;
              const isIndented = index % 2 !== 0;
              
              return (
                <li 
                  key={item.id} 
                  className="relative flex items-center w-full"
                  style={{ height: `${ITEM_HEIGHT}px` }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleItemClick(index, item.id, e)}
                      className={`
                        w-full text-left transition-all duration-300
                        ${isIndented ? 'pl-[44px]' : 'pl-8'}
                        text-[11px] font-medium tracking-[0.05em]
                        ${isActive 
                          ? 'text-zinc-800 dark:text-[#6495ED]' 
                          : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
                        }
                      `}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

        </div>
      </nav>
    </div>
  );
}
