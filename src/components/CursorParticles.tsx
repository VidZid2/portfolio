"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ASCII_CHARS = ['*', '+', '#', '~', 'x', '.', ':', '-', '<', '>', '/', '\\', 'o', '0', '1'];

interface Particle {
  id: string;
  angle: number;
  distance: number;
  char: string;
  fontSize: number;
  duration: number;
  rotation: number;
  isTrail: boolean;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const ScramblingParticle = ({ burst, p }: { burst: Burst, p: Particle }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nodeRef.current) {
        nodeRef.current.innerText = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
        
        const blueX = (Math.random() - 0.5) * 4;
        const whiteX = (Math.random() - 0.5) * 4;
        nodeRef.current.style.textShadow = `${blueX}px 0px 0 rgba(100, 149, 237, 0.8), ${whiteX}px 0px 0 rgba(255, 255, 255, 0.8)`;
      }
    }, 50); 
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      ref={nodeRef}
      initial={{
        x: burst.x,
        y: burst.y,
        scale: 0,
        rotate: 0,
      }}
      animate={{
        x: burst.x + Math.cos(p.angle) * p.distance,
        y: burst.y + Math.sin(p.angle) * p.distance,
        scale: [0, 1.2, 0], 
        rotate: p.rotation,
        color: ['#000000', '#6495ED'], // Morph color from Black to Cornflower Blue
      }}
      transition={{
        duration: p.duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute font-bold pointer-events-none flex items-center justify-center mix-blend-multiply dark:mix-blend-screen"
      style={{
        fontSize: p.fontSize,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {p.char}
    </motion.div>
  );
};

export function CursorParticles() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  
  const pointerPos = useRef({ x: 0, y: 0 });
  const isHolding = useRef(false);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const lastTrailDrop = useRef(0);

  const fireParticles = useCallback((x: number, y: number, particleCount: number, maxSpread = 30, minSpread = 10, isTrail = false) => {
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: Math.random() + '-' + i,
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * maxSpread + minSpread,
      char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
      fontSize: Math.random() * 6 + 8,
      // Trails last ~2 seconds, standard bursts last ~0.5s - 0.9s
      duration: isTrail ? (Math.random() * 0.5 + 1.6) : (Math.random() * 0.5 + 0.4),
      rotation: (Math.random() - 0.5) * 360,
      isTrail // Tag the particle so the canvas knows if it should draw constellation lines
    }));

    const burstId = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id: burstId, x, y, particles: newParticles }]);

    // Allow the 2-second animations to finish before cleaning up
    const cleanupDelay = isTrail ? 2500 : 1200;
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, cleanupDelay);
  }, []);



  useEffect(() => {
    // Disable particle simulations on mobile devices to save massive main-thread work
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.('.hide-cursor-particles')) return;
      
      const isMargin = e.clientX < window.innerWidth * 0.26 || e.clientX > window.innerWidth * 0.74;
      
      isHolding.current = true;
      if (isMargin) {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
      }

      fireParticles(e.clientX, e.clientY, 12, 30, 10, false);

      if (holdInterval.current) clearInterval(holdInterval.current);
      holdInterval.current = setInterval(() => {
        fireParticles(pointerPos.current.x, pointerPos.current.y, 2, 30, 10, false);
      }, 60);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.('.hide-cursor-particles')) {
        isHolding.current = false;
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        if (holdInterval.current) clearInterval(holdInterval.current);
        return;
      }

      pointerPos.current = { x: e.clientX, y: e.clientY };
      
      // Throttled spawn rate to prevent exponential math lag
      if (isHolding.current && Date.now() - lastTrailDrop.current > 50) {
        // Drop 1 particle to maintain a beautiful trail with zero lag!
        fireParticles(e.clientX, e.clientY, 1, 8, 0, true);
        lastTrailDrop.current = Date.now();
      }
    };

    const stopHolding = () => {
      isHolding.current = false;
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      if (holdInterval.current) clearInterval(holdInterval.current);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopHolding);
    window.addEventListener('pointercancel', stopHolding);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopHolding);
      window.removeEventListener('pointercancel', stopHolding);
      if (holdInterval.current) clearInterval(holdInterval.current);
    };
  }, [fireParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden font-mono">
      {bursts.map((burst) => (
        <React.Fragment key={burst.id}>
          {burst.particles.map((p) => (
            <ScramblingParticle 
              key={p.id} 
              burst={burst} 
              p={p} 
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
