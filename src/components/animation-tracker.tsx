"use client";
import { useEffect } from "react";

export function AnimationTracker() {
  useEffect(() => {
    // Set a cookie so the server knows the user has seen the animation
    document.cookie = "hasSeenAboutMe=true; path=/; max-age=31536000"; // 1 year
    document.cookie = "hasSeenScrollAnimations=true; path=/"; // Session cookie
  }, []);
  return null;
}
