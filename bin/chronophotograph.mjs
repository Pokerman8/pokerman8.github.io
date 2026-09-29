#!/usr/bin/env node
// Generates _includes/chronophotograph.liquid: one pass of a runner drawn as a
// geometric chronophotograph, after Étienne-Jules Marey (1883). Each exposure
// is the near-side skeleton; older exposures fade out and the latest one has
// its joints marked as keypoints.
//
// Usage: node bin/chronophotograph.mjs [--strides=0.85] [--dp=0.035] [--end=0]

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const opt = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v === undefined ? true : v];
  })
);

const H = 100; // standing height in SVG units
const STRIDE = 2.1 * H; // distance travelled per stride
const STRIDES = Number(opt.strides ?? 0.85); // length of the pass
const dp = Number(opt.dp ?? 0.035); // stride fraction between exposures
const END = Number(opt.end ?? 0); // stride phase of the latest exposure (0 = near foot lands)
const STANCE_END = 0.32; // toe-off, as a fraction of the stride

const L = { thigh: 0.245, shank: 0.246, foot: 0.12, trunk: 0.3, neck: 0.1, head: 0.055, upperArm: 0.186, forearm: 0.16 };

// Sagittal joint angles in degrees through one stride of the near leg, starting at foot contact.
// thigh: from vertical, forward positive; knee: flexion; ankle: plantarflexion.
const LEG = [
  [0.0, 28, 12, -5],
  [0.1, 8, 38, -15],
  [0.21, -14, 30, 0],
  [0.32, -32, 22, 28],
  [0.44, -18, 75, 25],
  [0.56, 12, 112, 12],
  [0.68, 42, 95, 5],
  [0.8, 50, 55, 0],
  [0.92, 38, 18, -5],
];

const rad = (d) => (d * Math.PI) / 180;
const vec = (angle, len) => [Math.sin(rad(angle)) * len * H, Math.cos(rad(angle)) * len * H];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const wrap = (p) => ((p % 1) + 1) % 1;

// Periodic Catmull-Rom interpolation over non-uniform keyframes.
function interp(keys, col, p) {
  const n = keys.length;
  p = wrap(p);
  let i = n - 1;
  while (i > 0 && keys[i][0] > p) i--;
  const at = (k) => {
    const j = ((k % n) + n) % n;
    return [keys[j][0] + Math.floor(k / n), keys[j][col]];
  };
  const [t0, v0] = at(i - 1),
    [t1, v1] = at(i),
    [t2, v2] = at(i + 1),
    [t3, v3] = at(i + 2);
  const m1 = (v2 - v0) / (t2 - t0),
    m2 = (v3 - v1) / (t3 - t1);
  const h = t2 - t1,
    s = (p - t1) / h;
  const s2 = s * s,
    s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * v1 + (s3 - 2 * s2 + s) * h * m1 + (-2 * s3 + 3 * s2) * v2 + (s3 - s2) * h * m2;
}

function leg(p, hip) {
  const thigh = interp(LEG, 1, p),
    knee = interp(LEG, 2, p),
    ankle = interp(LEG, 3, p);
  const shank = thigh - knee;
  const k = add(hip, vec(thigh, L.thigh));
  const a = add(k, vec(shank, L.shank));
  const toe = add(a, vec(shank + 90 - ankle, L.foot));
  // The drawn foot (ankle to toe) is what touches the ground.
  return { knee: k, ankle: a, toe, lowest: Math.max(toe[1], a[1]) - hip[1] };
}

// The near arm swings against the near leg.
function arm(p, shoulder) {
  const upper = 5 + 32 * Math.sin(2 * Math.PI * (p - 0.2));
  const flex = 84 + 14 * Math.sin(2 * Math.PI * (p - 0.2));
  const elbow = add(shoulder, vec(upper, L.upperArm));
  return { elbow, wrist: add(elbow, vec(upper + flex, L.forearm)) };
}

// Hip height above the ground (y = 0): supported by whichever foot is in stance, ballistic in between.
const SAMPLES = 400;
const hipY = new Array(SAMPLES).fill(null);
for (let s = 0; s < SAMPLES; s++) {
  for (const phase of [s / SAMPLES, wrap(s / SAMPLES + 0.5)]) {
    if (phase <= STANCE_END) hipY[s] = -leg(phase, [0, 0]).lowest;
  }
}
for (let s = 0; s < SAMPLES; s++) {
  if (hipY[s] !== null) continue;
  let a = s,
    b = s;
  while (hipY[(a - 1 + SAMPLES) % SAMPLES] === null) a--;
  while (hipY[(b + 1) % SAMPLES] === null) b++;
  const y0 = hipY[(a - 1 + SAMPLES) % SAMPLES],
    y1 = hipY[(b + 1) % SAMPLES];
  const span = b - a + 2;
  for (let j = a; j <= b; j++) {
    const t = (j - a + 1) / span;
    hipY[(j + SAMPLES) % SAMPLES] = y0 + (y1 - y0) * t - 0.035 * H * 4 * t * (1 - t);
  }
  s = b;
}

// Full pose at time t (in strides); x advances at constant speed.
function pose(t) {
  const p = wrap(t);
  const hip = [t * STRIDE, hipY[Math.round(p * SAMPLES) % SAMPLES]];
  const lean = 9;
  const shoulder = add(hip, [Math.sin(rad(lean)) * L.trunk * H, -Math.cos(rad(lean)) * L.trunk * H]);
  const neck = rad(lean + 6);
  const head = add(shoulder, [Math.sin(neck) * (L.neck + L.head) * H, -Math.cos(neck) * (L.neck + L.head) * H]);
  const headBase = add(shoulder, [Math.sin(neck) * L.neck * H, -Math.cos(neck) * L.neck * H]);
  return { head, headBase, shoulder, hip, near: { ...leg(p, hip), ...arm(p, shoulder) } };
}

const f = (n) => Math.round(n * 10) / 10;
const pt = (q) => `${f(q[0])} ${f(q[1])}`;
const limbs = (q, side) => `M${pt(q.hip)}L${pt(side.knee)}L${pt(side.ankle)}L${pt(side.toe)}M${pt(q.shoulder)}L${pt(side.elbow)}L${pt(side.wrist)}`;
const trunk = (q) => `M${pt(q.headBase)}L${pt(q.shoulder)}L${pt(q.hip)}`;

// Exposures run from the start of the pass up to the latest one at phase END.
const tEnd = Math.ceil(STRIDES) + END;
const count = Math.round(STRIDES / dp);
const poses = Array.from({ length: count + 1 }, (_, i) => pose(tEnd - (count - i) * dp));

// Bounds, with room for the head and the stroke; the ground is y = 0.
const xs = poses.flatMap((q) => [q.head[0], q.near.toe[0], q.near.wrist[0], q.near.ankle[0], q.hip[0]]);
const ys = poses.map((q) => q.head[1]);
const pad = 4;
const x0 = Math.min(...xs) - pad,
  x1 = Math.max(...xs) + pad;
const y0 = Math.min(...ys) - pad,
  y1 = 0; // bottom edge = ground
const W = x1 - x0,
  Ht = y1 - y0;

// Older exposures fade out.
const trail = poses.slice(0, -1).map((q, i) => {
  const recency = i / (poses.length - 1);
  const opacity = Math.round((0.08 + 0.42 * recency ** 1.6) * 100) / 100;
  return `<path stroke-opacity="${opacity}" d="${trunk(q)}${limbs(q, q.near)}"/>`;
});

// The latest exposure is the brightest, with its joints marked as keypoints.
const last = poses[poses.length - 1];
const keypoints = [last.head, last.shoulder, last.near.elbow, last.near.wrist, last.hip, last.near.knee, last.near.ankle];

const svg = `{% comment %}Generated by bin/chronophotograph.mjs. Edit the generator, not this file.{% endcomment %}
<svg class="chrono" viewBox="${f(x0)} ${f(y0)} ${f(W)} ${f(Ht)}" style="aspect-ratio: ${f(W)} / ${f(Ht)}" aria-hidden="true" focusable="false">
  <g class="chrono-trail">${trail.join("")}</g>
  <path class="chrono-latest" d="M${pt(last.head)}L${pt(last.shoulder)}L${pt(last.hip)}${limbs(last, last.near)}"/>
  <path class="chrono-keypoints" d="${keypoints.map((k) => `M${pt(k)}h0`).join("")}"/>
</svg>
`;

const out = opt.out ?? fileURLToPath(new URL("../_includes/chronophotograph.liquid", import.meta.url));
writeFileSync(out, svg);
console.log(`wrote ${out} (${poses.length} exposures, viewBox ${f(W)}x${f(Ht)}, ${(svg.length / 1024).toFixed(1)} KB)`);
