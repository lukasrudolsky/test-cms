"use client";

import { useEffect, useRef, useState } from "react";
import {
  arcBump,
  easeInOutCubic,
  easeSmootherStep,
  generateShape,
  type ShapeName,
} from "./shapes";

const PARTICLE_COUNT = 1320;
const SHAPE_SEQUENCE: ShapeName[] = [
  "apiInfrastructure",
  "connectWallet",
  "gasFree",
  "enterpriseRpc",
];
const HOLD_MS = 2400;
const MORPH_MS = 1900;
const AUTO_ROTATE_SPEED = 0.00012;
const TILT = 0.18;
const MAX_STAGGER = 0.18;
const TRAIL_ALPHA = 0.48;
const ARC_STRENGTH = 0.09;
const BREATH_SPEED = 0.0005;
const BREATH_AMOUNT = 0.012;

function getYRotation(name: ShapeName, orbitAngle: number) {
  switch (name) {
    case "apiInfrastructure":
      return -0.08 + 0.04 * Math.sin(orbitAngle * 0.21);
    case "connectWallet":
      return 0.12 + 0.05 * Math.sin(orbitAngle * 0.2);
    case "gasFree":
      return -0.12 + 0.06 * Math.sin(orbitAngle * 0.23);
    case "enterpriseRpc":
      return 0.08 + 0.05 * Math.sin(orbitAngle * 0.19);
  }
}

export default function ParticleMorph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const shapeCache = new Map<ShapeName, Float32Array>();
    SHAPE_SEQUENCE.forEach((name) => {
      shapeCache.set(name, generateShape(name, PARTICLE_COUNT));
    });

    let shapeIndex = 0;
    let fromPositions = shapeCache.get(SHAPE_SEQUENCE[0])!;
    let toPositions = fromPositions;
    const current = new Float32Array(fromPositions);
    let phase: "hold" | "morph" = "hold";
    let phaseStart = performance.now();
    let orbitAngle = 0;
    let rotationY = getYRotation(SHAPE_SEQUENCE[0], 0);

    const sizeSeed = new Float32Array(PARTICLE_COUNT);
    const twinkleFreq = new Float32Array(PARTICLE_COUNT);
    const twinklePhase = new Float32Array(PARTICLE_COUNT);
    const morphDelay = new Float32Array(PARTICLE_COUNT);
    const hue = new Float32Array(PARTICLE_COUNT);
    const arcAxisX = new Float32Array(PARTICLE_COUNT);
    const arcAxisY = new Float32Array(PARTICLE_COUNT);
    const arcAxisZ = new Float32Array(PARTICLE_COUNT);
    const arcStrength = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizeSeed[i] = Math.random();
      twinkleFreq[i] = 0.0008 + Math.random() * 0.0014;
      twinklePhase[i] = Math.random() * Math.PI * 2;
      morphDelay[i] = Math.random() * MAX_STAGGER;
      hue[i] = Math.random();

      const theta = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const r = Math.sqrt(1 - z * z);
      arcAxisX[i] = Math.cos(theta) * r;
      arcAxisY[i] = Math.sin(theta) * r;
      arcAxisZ[i] = z;
      arcStrength[i] = (0.4 + Math.random() * 0.6) * (Math.random() < 0.5 ? 1 : -1);
    }

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const projX = new Float32Array(PARTICLE_COUNT);
    const projY = new Float32Array(PARTICLE_COUNT);
    const projZ2 = new Float32Array(PARTICLE_COUNT);
    const projPerspective = new Float32Array(PARTICLE_COUNT);

    let rafId = 0;
    let lastTime = performance.now();

    const advanceShape = () => {
      shapeIndex = (shapeIndex + 1) % SHAPE_SEQUENCE.length;
      fromPositions = new Float32Array(current);
      toPositions = shapeCache.get(SHAPE_SEQUENCE[shapeIndex])!;
      phase = "morph";
      phaseStart = performance.now();
    };

    const draw = (now: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const breath = 1 + Math.sin(now * BREATH_SPEED) * BREATH_AMOUNT;
      const scale = Math.min(width, height) * 0.58 * breath;
      const focal = 2.6;
      const cx = width / 2;
      const cy = height / 2;
      const cosR = Math.cos(rotationY);
      const sinR = Math.sin(rotationY);
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);

      let minPx = Infinity;
      let maxPx = -Infinity;
      let minPy = Infinity;
      let maxPy = -Infinity;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const x0 = current[idx];
        const y0 = current[idx + 1];
        const z0 = current[idx + 2];

        const x1 = x0 * cosR + z0 * sinR;
        const z1 = -x0 * sinR + z0 * cosR;
        const y1 = y0 * cosT - z1 * sinT;
        const z2 = y0 * sinT + z1 * cosT;
        const perspective = focal / (focal + z2);
        const rawPx = x1 * scale * perspective;
        const rawPy = -y1 * scale * perspective;

        projX[i] = rawPx;
        projY[i] = rawPy;
        projZ2[i] = z2;
        projPerspective[i] = perspective;
        if (rawPx < minPx) minPx = rawPx;
        if (rawPx > maxPx) maxPx = rawPx;
        if (rawPy < minPy) minPy = rawPy;
        if (rawPy > maxPy) maxPy = rawPy;
      }

      const centerOffsetX = cx - (minPx + maxPx) / 2;
      const centerOffsetY = cy - (minPy + maxPy) / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const px = centerOffsetX + projX[i];
        const py = centerOffsetY + projY[i];
        const z2 = projZ2[i];
        const perspective = projPerspective[i];
        const depthAlpha = 0.36 + 0.64 * ((z2 + 1.4) / 2.8);
        const twinkle =
          0.9 + 0.1 * Math.sin(now * twinkleFreq[i] + twinklePhase[i]);
        const alpha = Math.min(1, depthAlpha) * twinkle * 0.98;
        const size = Math.max(0.72, 1.1 * perspective * (0.92 + sizeSeed[i] * 0.16));
        const violet = Math.min(1, hue[i] * 0.5 + depthAlpha * 0.28);
        const r = Math.round(112 + violet * 84);
        const g = Math.round(78 + violet * 90);
        const b = 255;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, size * 2.15);
        glow.addColorStop(0, `rgba(196, 168, 255, ${(alpha * 0.3).toFixed(3)})`);
        glow.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.18).toFixed(3)})`);
        glow.addColorStop(1, "rgba(115, 87, 255, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, size * 2.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.95).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!prefersReducedMotion) orbitAngle += AUTO_ROTATE_SPEED * dt;

      const elapsed = now - phaseStart;
      const len = SHAPE_SEQUENCE.length;

      if (phase === "hold" && elapsed >= HOLD_MS) {
        advanceShape();
      } else if (phase === "morph") {
        const globalT = Math.min(1, elapsed / MORPH_MS);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const localT = Math.max(
            0,
            Math.min(1, (globalT - morphDelay[i]) / (1 - morphDelay[i]))
          );
          const eased = easeSmootherStep(localT);
          const idx = i * 3;
          const dx = toPositions[idx] - fromPositions[idx];
          const dy = toPositions[idx + 1] - fromPositions[idx + 1];
          const dz = toPositions[idx + 2] - fromPositions[idx + 2];

          let ox = fromPositions[idx] + dx * eased;
          let oy = fromPositions[idx + 1] + dy * eased;
          let oz = fromPositions[idx + 2] + dz * eased;
          const travel = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (travel > 1e-4) {
            const invLen = 1 / travel;
            const ux = dx * invLen;
            const uy = dy * invLen;
            const uz = dz * invLen;
            let px = uy * arcAxisZ[i] - uz * arcAxisY[i];
            let py = uz * arcAxisX[i] - ux * arcAxisZ[i];
            let pz = ux * arcAxisY[i] - uy * arcAxisX[i];
            const plen = Math.sqrt(px * px + py * py + pz * pz) || 1;
            const bow = arcStrength[i] * ARC_STRENGTH * arcBump(localT) * travel;
            px = (px / plen) * bow;
            py = (py / plen) * bow;
            pz = (pz / plen) * bow;
            ox += px;
            oy += py;
            oz += pz;
          }

          current[idx] = ox;
          current[idx + 1] = oy;
          current[idx + 2] = oz;
        }

        if (globalT >= 1) {
          phase = "hold";
          phaseStart = now;
        }
      }

      if (phase === "morph") {
        const t = Math.min(1, elapsed / MORPH_MS);
        const eased = easeInOutCubic(t);
        const fromName = SHAPE_SEQUENCE[(shapeIndex - 1 + len) % len];
        const toName = SHAPE_SEQUENCE[shapeIndex];
        const rotFrom = getYRotation(fromName, orbitAngle);
        const rotTo = getYRotation(toName, orbitAngle);
        rotationY = rotFrom + (rotTo - rotFrom) * eased;
      } else {
        rotationY = getYRotation(SHAPE_SEQUENCE[shapeIndex], orbitAngle);
      }

      draw(now);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [mounted]);

  if (!mounted) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
