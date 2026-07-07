"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"

interface ScrambleInProps {
  text: string
  scrambleSpeed?: number
  scrambledLetterCount?: number
  characters?: string
  className?: string
  scrambledClassName?: string
  autoStart?: boolean
  skipAnimation?: boolean
  onStart?: () => void
  onComplete?: () => void
}

export interface ScrambleInHandle {
  start: () => void
  reset: () => void
}

const ScrambleIn = forwardRef<ScrambleInHandle, ScrambleInProps>(
  (
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
      className = "",
      scrambledClassName = "",
      autoStart = true,
      skipAnimation = false,
      onStart,
      onComplete,
    },
    ref
  ) => {
    const [displayText, setDisplayText] = useState(skipAnimation ? text : "")
    const [isAnimating, setIsAnimating] = useState(false)
    const [visibleLetterCount, setVisibleLetterCount] = useState(skipAnimation ? text.length : 0)
    const [scrambleOffset, setScrambleOffset] = useState(0)

    const startAnimation = useCallback(() => {
      if (skipAnimation) return;
      setIsAnimating(true)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      onStart?.()
    }, [onStart, skipAnimation])

    const reset = useCallback(() => {
      setIsAnimating(false)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      setDisplayText("")
    }, [])

    useImperativeHandle(ref, () => ({
      start: startAnimation,
      reset,
    }))

    useEffect(() => {
      if (skipAnimation) {
        setDisplayText(text)
        setVisibleLetterCount(text.length)
        setIsAnimating(false)
        return
      }
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart, startAnimation, skipAnimation, text])

    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isAnimating) {
        interval = setInterval(() => {
          // Increase visible text length
          if (visibleLetterCount < text.length) {
            setVisibleLetterCount((prev) => prev + 1)
          }
          // Start sliding scrambled text out
          else if (scrambleOffset < scrambledLetterCount) {
            setScrambleOffset((prev) => prev + 1)
          }
          // Complete animation
          else {
            clearInterval(interval)
            setIsAnimating(false)
            onComplete?.()
          }

          // Calculate how many scrambled letters we can show
          const remainingSpace = Math.max(0, text.length - visibleLetterCount)
          const currentScrambleCount = Math.min(
            remainingSpace,
            scrambledLetterCount
          )

          // Generate scrambled text by mapping over the actual next characters
          // This preserves spaces and word lengths, preventing layout shifts
          const scrambledPart = text
            .slice(visibleLetterCount, visibleLetterCount + currentScrambleCount)
            .split("")
            .map((char) => {
              if (char === " " || char === "\n") return char
              return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("")

          setDisplayText(text.slice(0, visibleLetterCount) + scrambledPart)
        }, scrambleSpeed)
      }

      return () => {
        if (interval) clearInterval(interval)
      }
    }, [
      isAnimating,
      text,
      visibleLetterCount,
      scrambleOffset,
      scrambledLetterCount,
      characters,
      scrambleSpeed,
      onComplete,
    ])

    const renderText = () => {
      const revealed = displayText.slice(0, visibleLetterCount)
      const scrambled = displayText.slice(visibleLetterCount)

      return (
        <>
          <span className={className}>{revealed}</span>
          <span className={scrambledClassName}>{scrambled}</span>
        </>
      )
    }

    return (
      <>
        <span className="sr-only">{text}</span>
        <span className="relative grid whitespace-pre-wrap" aria-hidden="true">
          <span className="invisible col-start-1 row-start-1">{text}</span>
          <span className="absolute top-0 left-0 w-full h-full">{renderText()}</span>
        </span>
      </>
    )
  }
)

ScrambleIn.displayName = "ScrambleIn"
export default ScrambleIn
