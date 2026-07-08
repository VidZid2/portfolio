"use client";

import { useEffect } from "react";

export function GlobalConsoleWarning() {
  useEffect(() => {
    const isLocal =
      window.location.hostname.includes("localhost") ||
      window.location.hostname.includes("127.0.0.1");

    if (!isLocal) {
      console.log(
        "%cSTOP! %cNo fiddling in the inspect! 😉",
        "color: #ff3333; font-size: 32px; font-weight: bold; font-family: sans-serif; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);",
        "color: #888888; font-size: 16px; font-family: sans-serif;"
      );
      console.log(
        "%cThis is a production environment. Please respect the developer's work.",
        "color: #a1a1aa; font-size: 13px; font-family: sans-serif; line-height: 1.5;"
      );
    }
  }, []);

  return null;
}
