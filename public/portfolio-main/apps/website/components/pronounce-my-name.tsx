'use client';

import { Volume2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useSound } from '@/lib/hooks/use-sound';
import { useCallback } from 'react';

export function PronounceMyName({
  className,
  namePronunciationUrl,
  name,
}: {
  className?: string;
  namePronunciationUrl?: string;
  name?: string;
}) {
  const playSound = useSound(namePronunciationUrl ?? '');

  const speak = useCallback(() => {
    if (namePronunciationUrl) {
      playSound();
      return;
    }
    if (name && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  }, [namePronunciationUrl, name, playSound]);

  return (
    <button
      type="button"
      className={cn(
        'relative text-muted-foreground transition-all hover:text-foreground active:scale-[0.9]',
        'after:-inset-1 after:absolute',
        className
      )}
      onClick={speak}
    >
      <Volume2Icon className="size-4" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  );
}
