"use client";

import { motion, useInView } from "framer-motion";
import { CircleDashed, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const roadmapItems = [
  {
    title: "Backend Persistence",
    description: "I need to integrate a PostgreSQL database (via Supabase) to save chat histories and handle secure lead generation.",
  },
  {
    title: "SEO Optimization",
    description: "The Next.js metadata exports and dynamic sitemap.xml generation must be configured so the agency can actually rank on Google.",
    isSeo: true
  },
  {
    title: "Accessibility (a11y) Auditing",
    description: "I need to learn how to properly conduct screen-reader testing and ensure 100% keyboard navigability.",
  },
  {
    title: "Automated Testing",
    description: "Currently, my testing is entirely manual. Learning how to write Jest and Playwright tests is mandatory to ensure future updates don't break the app.",
  },
  {
    title: "Production Deployment",
    description: "The final step is moving off localhost and migrating to a live production environment on Vercel with a custom domain.",
    isDeploy: true
  }
];

export function AnimatedRoadmap() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      // Wait for the staggered entrance animation to finish (1.5s)
      const timeout = setTimeout(() => {
        let currentArr: number[] = [];
        let i = 0;
        const interval = setInterval(() => {
          currentArr.push(i);
          setCheckedItems([...currentArr]); // Force exact state [0], [0,1]...
          i++;
          if (i >= roadmapItems.length) {
            clearInterval(interval);
          }
        }, 700); // Check the next item every 700ms
        
        return () => clearInterval(interval);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView]);

  const toggleCheck = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      ref={containerRef}
      variants={container} 
      initial="hidden" 
      animate={isInView ? "show" : "hidden"}
      className="space-y-3 my-8"
    >
      {roadmapItems.map((road, idx) => {
        const isChecked = checkedItems.includes(idx);
        return (
          <motion.div 
            key={idx} 
            variants={item}
            onClick={() => toggleCheck(idx)}
            className={cn(
              "group flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-300 select-none",
              isChecked 
                ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10" 
                : "border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 hover:border-emerald-500/30"
            )}
          >
            <div className="mt-0.5 shrink-0 relative w-5 h-5">
              <motion.div
                initial={false}
                animate={{ scale: isChecked ? 0 : 1, opacity: isChecked ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <CircleDashed className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </motion.div>
            </div>
            <div>
              <h4 className={cn(
                "font-semibold mb-1 transition-colors duration-300",
                isChecked ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-100"
              )}>
                {road.title}
              </h4>
              
              {road.isSeo ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">The Next.js <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[13px] font-mono text-zinc-700 dark:text-zinc-300">metadata</code> exports and dynamic <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[13px] font-mono text-zinc-700 dark:text-zinc-300">sitemap.xml</code> generation must be configured so the agency can actually rank on Google.</p>
              ) : road.isDeploy ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">The final step is moving off <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[13px] font-mono text-zinc-700 dark:text-zinc-300">localhost</code> and migrating to a live production environment on Vercel with a custom domain.</p>
              ) : (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{road.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
