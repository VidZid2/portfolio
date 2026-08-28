'use client';

import { Volume2Icon, VolumeOffIcon } from 'lucide-react';
import { useSound } from '@/lib/contexts/sound-context';

export function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="flex h-full w-full items-center justify-center"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <VolumeOffIcon className="size-4" />
      ) : (
        <Volume2Icon className="size-4" />
      )}
    </button>
  );
}
