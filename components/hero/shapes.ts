/**
 * Point-cloud generators for the particle morph animation.
 * Every generator returns [x, y, z] triples in a normalized [-1, 1] space.
 */

export type ShapeName = "globe" | "computer" | "rocket";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function writePoint(points: Float32Array, index: number, x: number, y: number, z: number) {
  points[index * 3] = x;
  points[index * 3 + 1] = y;
  points[index * 3 + 2] = z;
}

function hash(index: number, salt = 0) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Uniform sphere sampling via the Fibonacci lattice. This is the clean reference. */
export function generateGlobe(count: number): Float32Array {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;

    writePoint(points, i, Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY);
  }

  return points;
}

/** A readable 3D laptop/desktop computer made from dots. */
export function generateComputer(count: number): Float32Array {
  const points = new Float32Array(count * 3);
  const screenCount = Math.floor(count * 0.62);
  const standCount = Math.floor(count * 0.12);

  for (let i = 0; i < count; i++) {
    if (i < screenCount) {
      const local = i / screenCount;
      const edgeBias = hash(i, 8);
      const onEdge = edgeBias < 0.34;
      let x: number;
      let y: number;

      if (onEdge) {
        const side = i % 4;
        const t = hash(i, 1);
        if (side === 0) {
          x = lerp(-0.78, 0.78, t);
          y = 0.52;
        } else if (side === 1) {
          x = lerp(-0.78, 0.78, t);
          y = -0.2;
        } else if (side === 2) {
          x = -0.78;
          y = lerp(-0.2, 0.52, t);
        } else {
          x = 0.78;
          y = lerp(-0.2, 0.52, t);
        }
      } else {
        x = lerp(-0.66, 0.66, hash(i, 2));
        y = lerp(-0.1, 0.42, hash(i, 3));
      }

      const subtleCurve = Math.sin((local - 0.5) * Math.PI) * 0.04;
      writePoint(points, i, x, y, subtleCurve + hash(i, 4) * 0.08);
    } else if (i < screenCount + standCount) {
      const local = (i - screenCount) / standCount;
      writePoint(points, i, lerp(-0.12, 0.12, hash(i, 5)), lerp(-0.22, -0.46, local), 0.04);
    } else {
      const local = (i - screenCount - standCount) / Math.max(1, count - screenCount - standCount);
      const x = lerp(-0.72, 0.72, hash(i, 6));
      const y = lerp(-0.62, -0.46, hash(i, 7));
      const z = lerp(-0.22, 0.22, local);
      writePoint(points, i, x, y, z);
    }
  }

  return points;
}

/** A clean rocket launch silhouette: body, nose, fins and a soft flame plume. */
export function generateRocket(count: number): Float32Array {
  const points = new Float32Array(count * 3);
  const bodyCount = Math.floor(count * 0.58);
  const noseCount = Math.floor(count * 0.16);
  const finCount = Math.floor(count * 0.14);

  for (let i = 0; i < count; i++) {
    if (i < bodyCount) {
      const t = i / bodyCount;
      const theta = GOLDEN_ANGLE * i;
      const radial = Math.sqrt(hash(i, 9));
      const radius = 0.26 * (0.88 + 0.12 * Math.sin(t * Math.PI));
      const y = lerp(-0.28, 0.48, t);

      writePoint(
        points,
        i,
        Math.cos(theta) * radius * radial,
        y,
        Math.sin(theta) * radius * 0.55 * radial
      );
    } else if (i < bodyCount + noseCount) {
      const local = (i - bodyCount) / noseCount;
      const theta = GOLDEN_ANGLE * i;
      const radial = Math.sqrt(hash(i, 10));
      const radius = lerp(0.24, 0.02, local);
      const y = lerp(0.48, 0.86, local);

      writePoint(
        points,
        i,
        Math.cos(theta) * radius * radial,
        y,
        Math.sin(theta) * radius * 0.55 * radial
      );
    } else if (i < bodyCount + noseCount + finCount) {
      const local = i - bodyCount - noseCount;
      const side = local % 2 === 0 ? -1 : 1;
      const t = hash(i, 11);
      const spread = hash(i, 12);

      writePoint(
        points,
        i,
        side * lerp(0.18, 0.52, spread),
        lerp(-0.2, -0.46, t),
        (hash(i, 13) - 0.5) * 0.1
      );
    } else {
      const local = (i - bodyCount - noseCount - finCount) /
        Math.max(1, count - bodyCount - noseCount - finCount);
      const theta = GOLDEN_ANGLE * i;
      const radial = Math.sqrt(hash(i, 14));
      const radius = lerp(0.12, 0.42, local) * radial;
      const y = lerp(-0.42, -0.92, local);

      writePoint(
        points,
        i,
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius * 0.35
      );
    }
  }

  return points;
}

export function generateShape(name: ShapeName, count: number): Float32Array {
  switch (name) {
    case "globe":
      return generateGlobe(count);
    case "computer":
      return generateComputer(count);
    case "rocket":
      return generateRocket(count);
  }
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Smootherstep — zero first *and* second derivative at both ends, so
 * motion eases in/out with no perceptible "snap" at the start or finish. */
export function easeSmootherStep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** 0 at t=0 and t=1, peaks at 1 around t=0.5 — used to bow a straight-line
 * lerp outward into an arc so particles swirl rather than fly in a straight line. */
export function arcBump(t: number): number {
  return Math.sin(Math.PI * t);
}
