"use client";

import { useEffect, useRef } from "react";
import {
  arcBump,
  easeInOutCubic,
  easeSmootherStep,
  generateShape,
  type ShapeName,
} from "./shapes";

const PARTICLE_COUNT = 1250;
const SHAPE_SEQUENCE: ShapeName[] = ["globe", "computer", "rocket"];
const HOLD_MS = 5000; // time a fully-formed shape stays still
const MORPH_MS = 3400; // time spent interpolating into the next shape
const AUTO_ROTATE_SPEED = 0.00014; // radians / ms, drives spin + wobble phase
const TILT = 0.22; // base camera tilt (radians) around X, same for every shape
const MAX_STAGGER = 0.32; // fraction of the morph a particle's start can be delayed by
const TRAIL_ALPHA = 0.3; // higher = shorter motion trails
const ARC_STRENGTH = 0.22; // how far particles bow off the straight line while morphing
const BREATH_SPEED = 0.00055; // rad/ms for the idle "breathing" scale pulse
const BREATH_AMOUNT = 0.018; // +/- fraction the whole cloud gently scales by

/**
 * Volumetric shapes (globe) look good from any angle, so they get a
 * full continuous spin. Flat shapes would periodically rotate
 * edge-on and collapse into a sliver if spun the same way, so they instead
 * hold a fixed, pleasant angle with only a small bounded wobble.
 */
function getYRotation(name: ShapeName, orbitAngle: number): number {
  switch (name) {
    case "globe":
      return orbitAngle;
    case "computer":
      return -0.18 + 0.06 * Math.sin(orbitAngle * 0.24);
    case "rocket":
      return 0.18 + 0.08 * Math.sin(orbitAngle * 0.22);
  }
}

interface Props {
  className?: string;
}

/**
 * Canvas-based particle system that idles as a rotating globe and
 * periodically morphs into other point-cloud shapes. Everything below
 * runs off refs inside a single rAF loop, so no React state updates
 * (and therefore no re-renders) happen during the animation.
 */
export default function ParticleMorph({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Precompute every shape's point cloud once.
    const shapeCache = new Map<ShapeName, Float32Array>();
    SHAPE_SEQUENCE.forEach((name) => {
      if (!shapeCache.has(name)) shapeCache.set(name, generateShape(name, PARTICLE_COUNT));
    });

    // shapeIndex tracks the shape currently displayed (or being morphed toward).
    let shapeIndex = 0;
    let fromPositions = shapeCache.get(SHAPE_SEQUENCE[0])!;
    let toPositions = fromPositions;
    const current = new Float32Array(fromPositions); // reused live buffer

    let phase: "hold" | "morph" = "hold";
    let phaseStart = performance.now();
    let orbitAngle = 0;
    let rotationY = getYRotation(SHAPE_SEQUENCE[0], 0);

    // Per-particle visual variance, computed once (not per frame).
    const sizeSeed = new Float32Array(PARTICLE_COUNT);
    const twinkleFreq = new Float32Array(PARTICLE_COUNT);
    const twinklePhase = new Float32Array(PARTICLE_COUNT);
    // Staggered start so particles don't all move in lockstep during a morph —
    // each one waits a random fraction of the transition before it starts easing.
    const morphDelay = new Float32Array(PARTICLE_COUNT);
    const hue = new Float32Array(PARTICLE_COUNT); // 0 = cool blue-violet, 1 = warm white
    // A random unit axis per particle that its morph path bows around, plus how
    // strongly — this is what turns a straight-line lerp into an organic swirl.
    const arcAxisX = new Float32Array(PARTICLE_COUNT);
    const arcAxisY = new Float32Array(PARTICLE_COUNT);
    const arcAxisZ = new Float32Array(PARTICLE_COUNT);
    const arcStrength = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizeSeed[i] = Math.random();
      twinkleFreq[i] = 0.0015 + Math.random() * 0.003;
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

    let rafId = 0;
    let lastTime = performance.now();

    const advanceShape = () => {
      shapeIndex = (shapeIndex + 1) % SHAPE_SEQUENCE.length;
      fromPositions = new Float32Array(current);
      toPositions = shapeCache.get(SHAPE_SEQUENCE[shapeIndex])!;
      phase = "morph";
      phaseStart = performance.now();
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
          // Each particle eases over its own [delay, 1] window so the swarm
          // flows into the new shape instead of snapping in unison.
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

          // Bow the straight-line path outward along a per-particle axis so the
          // swarm swirls into place instead of flying in flat, robotic lines.
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

    const draw = (now: number) => {
      // Soft-fade trail instead of a hard clear: gives moving particles a
      // faint glowing tail, which reads as far more premium than a crisp wipe.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, width, height);

      // Gentle idle "breathing" so the cloud never feels perfectly static.
      const breath = 1 + Math.sin(now * BREATH_SPEED) * BREATH_AMOUNT;
      const scale = Math.min(width, height) * 0.32 * breath;
      const focal = 2.6;
      const cx = width / 2;
      const cy = height / 2;
      const effectiveRotation = rotationY;
      const effectiveTilt = TILT;
      const cosR = Math.cos(effectiveRotation);
      const sinR = Math.sin(effectiveRotation);
      const cosT = Math.cos(effectiveTilt);
      const sinT = Math.sin(effectiveTilt);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const x0 = current[idx];
        const y0 = current[idx + 1];
        const z0 = current[idx + 2];

        // Rotate around Y then a slight tilt around X for a 3D feel.
        const x1 = x0 * cosR + z0 * sinR;
        const z1 = -x0 * sinR + z0 * cosR;
        const y1 = y0 * cosT - z1 * sinT;
        const z2 = y0 * sinT + z1 * cosT;

        const perspective = focal / (focal + z2);
        const px = cx + x1 * scale * perspective;
        // Canvas Y grows downward; shape-space Y grows upward, so flip.
        const py = cy - y1 * scale * perspective;

        const depthAlpha = 0.22 + 0.78 * ((z2 + 1.4) / 2.8);
        const twinkle =
          0.72 + 0.28 * Math.sin(now * twinkleFreq[i] + twinklePhase[i]);
        const alpha = Math.min(1, depthAlpha) * twinkle;
        const size = Math.max(0.9, 1.85 * perspective * (0.85 + sizeSeed[i] * 0.45));

        // Cool blue-violet tint blended toward warm white per particle,
        // biased brighter/whiter for particles nearer the camera.
        const warmth = Math.min(1, hue[i] * 0.6 + (1 - depthAlpha) * 0.4);
        const r = Math.round(170 + warmth * 85);
        const g = Math.round(185 + warmth * 70);
        const b = 255;

        // Soft halo first (kept subtle so dense clusters don't blow out to
        // solid white), then a crisp core dot on top for definition.
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.1).toFixed(3)})`;
        ctx.arc(px, py, size * 1.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
