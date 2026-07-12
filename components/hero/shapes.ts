/**
 * Point-cloud generators for the hero card animation.
 * Every generator returns [x, y, z] triples in normalized [-1, 1] space.
 */

export type ShapeName = "apiInfrastructure" | "connectWallet" | "gasFree" | "enterpriseRpc";

const TAU = Math.PI * 2;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function roundedRectField(x: number, y: number, width: number, height: number, radius: number) {
  const qx = Math.abs(x) - width / 2 + radius;
  const qy = Math.abs(y) - height / 2 + radius;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  const outside = Math.sqrt(ox * ox + oy * oy) - radius;
  const inside = Math.min(Math.max(qx, qy), 0);
  return -(outside + inside);
}

function ellipseField(x: number, y: number, rx: number, ry: number) {
  return 1 - Math.sqrt((x * x) / (rx * rx) + (y * y) / (ry * ry));
}

function lineField(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  radius: number
) {
  const vx = bx - ax;
  const vy = by - ay;
  const wx = x - ax;
  const wy = y - ay;
  const t = clamp((wx * vx + wy * vy) / (vx * vx + vy * vy), 0, 1);
  const px = ax + vx * t;
  const py = ay + vy * t;
  const dx = x - px;
  const dy = y - py;
  return radius - Math.sqrt(dx * dx + dy * dy);
}

function union(...fields: number[]) {
  return Math.max(...fields);
}

function subtract(base: number, cutout: number) {
  return Math.min(base, -cutout);
}

function dottedFieldToPoints(
  count: number,
  field: (x: number, y: number) => number,
  depth = 0.055
) {
  const candidates: Array<{ x: number; y: number; score: number }> = [];
  const columns = 72;
  const rows = 72;
  const span = 1.56;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = -span / 2 + (column / (columns - 1)) * span;
      const y = -span / 2 + (row / (rows - 1)) * span;
      const value = field(x, y);
      const edge = smoothstep(-0.08, 0.12, value);
      const organicEdge = (hash(row * 101 + column, 17) - 0.5) * 0.25;
      const latticeRipple =
        Math.sin(column * 0.74 + row * 0.31) * 0.022 +
        Math.cos(row * 0.59) * 0.016;
      const score = value + edge * 0.18 + organicEdge * (1 - edge) + latticeRipple;

      if (score > -0.08) candidates.push({ x, y, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const selected = candidates.slice(0, count);

  while (selected.length < count && candidates.length > 0) {
    selected.push(candidates[selected.length % candidates.length]);
  }

  selected.sort((a, b) => {
    const rowA = Math.round((a.y + span / 2) * 100);
    const rowB = Math.round((b.y + span / 2) * 100);
    return rowA === rowB ? a.x - b.x : rowA - rowB;
  });

  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const point = selected[i];
    const z =
      (hash(i, 41) - 0.5) * depth +
      Math.sin(point.x * 5.8 + point.y * 3.4) * depth * 0.16;
    writePoint(points, i, point.x, point.y, z);
  }

  return points;
}

function generateApiInfrastructure(count: number) {
  return dottedFieldToPoints(count, (x, y) => {
    const rack = roundedRectField(x + 0.08, y, 0.72, 1.02, 0.11);
    const slotOne = roundedRectField(x + 0.08, y - 0.25, 0.44, 0.1, 0.025);
    const slotTwo = roundedRectField(x + 0.08, y, 0.44, 0.1, 0.025);
    const slotThree = roundedRectField(x + 0.08, y + 0.25, 0.44, 0.1, 0.025);
    const dataLines = union(
      lineField(x, y, -0.7, -0.24, -0.32, -0.24, 0.032),
      lineField(x, y, -0.66, 0, -0.32, 0, 0.032),
      lineField(x, y, -0.7, 0.24, -0.32, 0.24, 0.032)
    );
    return union(rack, dataLines, slotOne + 0.02, slotTwo + 0.02, slotThree + 0.02);
  }, 0.07);
}

function generateConnectWallet(count: number) {
  return dottedFieldToPoints(count, (x, y) => {
    const body = roundedRectField(x, y + 0.08, 1.12, 0.64, 0.18);
    const clasp = roundedRectField(x + 0.34, y + 0.08, 0.28, 0.2, 0.06);
    const screenA = roundedRectField(x - 0.42, y - 0.48, 0.34, 0.25, 0.06);
    const screenB = roundedRectField(x + 0.42, y - 0.48, 0.34, 0.25, 0.06);
    const chain = union(
      lineField(x, y, -0.35, -0.34, -0.18, -0.17, 0.03),
      lineField(x, y, 0.35, -0.34, 0.18, -0.17, 0.03)
    );
    return union(body, clasp, screenA, screenB, chain);
  }, 0.06);
}

function generateGasFree(count: number) {
  return dottedFieldToPoints(count, (x, y) => {
    const coin = subtract(ellipseField(x + 0.17, y, 0.45, 0.45), ellipseField(x + 0.17, y, 0.22, 0.22));
    const slash = lineField(x, y, -0.36, 0.38, 0.58, -0.38, 0.07);
    const smallCoin = ellipseField(x - 0.4, y + 0.2, 0.18, 0.18);
    return union(coin, slash, smallCoin);
  }, 0.06);
}

function generateEnterpriseRpc(count: number) {
  return dottedFieldToPoints(count, (x, y) => {
    const tower = union(
      roundedRectField(x, y + 0.35, 0.28, 0.18, 0.035),
      roundedRectField(x, y + 0.1, 0.42, 0.18, 0.035),
      roundedRectField(x, y - 0.15, 0.56, 0.18, 0.035),
      roundedRectField(x, y - 0.4, 0.72, 0.18, 0.035)
    );
    const spine = lineField(x, y, 0, 0.5, 0, -0.52, 0.028);
    const nodes = union(
      ellipseField(x - 0.58, y + 0.28, 0.09, 0.09),
      ellipseField(x + 0.58, y + 0.22, 0.09, 0.09),
      ellipseField(x - 0.66, y - 0.28, 0.09, 0.09),
      ellipseField(x + 0.66, y - 0.32, 0.09, 0.09)
    );
    const links = union(
      lineField(x, y, -0.48, 0.28, -0.14, 0.1, 0.025),
      lineField(x, y, 0.48, 0.22, 0.14, 0.1, 0.025),
      lineField(x, y, -0.56, -0.28, -0.22, -0.3, 0.025),
      lineField(x, y, 0.56, -0.32, 0.22, -0.3, 0.025)
    );
    return union(tower, spine, nodes, links);
  }, 0.07);
}

function centerPoints(points: Float32Array, count: number) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = points[i * 3];
    const y = points[i * 3 + 1];
    const z = points[i * 3 + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const offsetX = (minX + maxX) / 2;
  const offsetY = (minY + maxY) / 2;
  const offsetZ = (minZ + maxZ) / 2;

  for (let i = 0; i < count; i++) {
    points[i * 3] -= offsetX;
    points[i * 3 + 1] -= offsetY;
    points[i * 3 + 2] -= offsetZ;
  }

  return points;
}

export function generateShape(name: ShapeName, count: number) {
  let points: Float32Array;

  switch (name) {
    case "apiInfrastructure":
      points = generateApiInfrastructure(count);
      break;
    case "connectWallet":
      points = generateConnectWallet(count);
      break;
    case "gasFree":
      points = generateGasFree(count);
      break;
    case "enterpriseRpc":
      points = generateEnterpriseRpc(count);
      break;
  }

  return centerPoints(points, count);
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeSmootherStep(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function arcBump(t: number) {
  return Math.sin(Math.PI * t);
}

export function orbitNoise(angle: number) {
  return Math.sin(angle * TAU);
}
