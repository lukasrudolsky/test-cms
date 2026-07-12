"use client";

import { useEffect, useRef } from "react";
import CodeTypewriter from "./CodeTypewriter";
import ParticleMorph from "./ParticleMorph";

const TILT_STRENGTH = 26; // degrees at the pointer being fully off to one side
const LERP = 0.14; // per-frame smoothing factor toward the target tilt

export default function ParticleTile() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  // Drives the tilt toward its target every frame instead of via a CSS
  // transition - a transition restarts on every pointermove, while lerping
  // each frame stays smooth no matter how fast the mouse moves.
  useEffect(() => {
    const tick = () => {
      const card = cardRef.current;
      if (card) {
        currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * LERP;
        currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * LERP;
        card.style.setProperty("--tilt-x", `${currentTilt.current.x.toFixed(3)}deg`);
        card.style.setProperty("--tilt-y", `${currentTilt.current.y.toFixed(3)}deg`);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const resetTilt = () => {
    targetTilt.current = { x: 0, y: 0 };
  };

  const updateTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    targetTilt.current = { x: -y * TILT_STRENGTH, y: x * TILT_STRENGTH };
  };

  return (
    <div className="relative [perspective:700px]">
      <div
        ref={cardRef}
        className="relative h-[260px] w-[260px] rounded-[46px] bg-[#06070b] p-[10px] shadow-[0_42px_105px_rgba(20,22,28,0.24),0_0_22px_rgba(139,92,246,0.22),inset_0_1px_0_rgba(196,168,255,0.4)] ring-1 ring-[rgba(139,92,246,0.35)] will-change-transform [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] [transform-style:preserve-3d]"
        onPointerLeave={resetTilt}
        onPointerMove={updateTilt}
      >
        <div className="absolute -inset-[34px] -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.96)_0%,rgba(236,237,239,0.88)_44%,rgba(244,244,246,0)_72%)]" />
        <div className="relative h-full w-full overflow-hidden rounded-[37px] border border-white/10 bg-[#05060a] [transform:translateZ(14px)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(116,88,255,0.22),rgba(6,7,11,0)_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_28%)]" />
          <CodeTypewriter className="absolute inset-6 z-10 overflow-hidden opacity-55 mix-blend-screen blur-[0.2px]" />
          <ParticleMorph className="absolute inset-0 z-20 h-full w-full" />
        </div>
      </div>
    </div>
  );
}
