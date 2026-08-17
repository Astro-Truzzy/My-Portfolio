"use client";

import { AdaptiveDpr, ContactShadows, Edges, Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { SkillPill } from "@/components/skill-icon";
import type { Skill } from "@/lib/skills";

export type DeskTheme = {
  accent: string;
  canvas: string;
  ink: string;
  light: boolean;
};

function fibonacciEllipsoid(count: number, rx: number, ry: number, rz: number) {
  const points: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const n = Math.max(count, 1);
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * r * rx, y * ry, Math.sin(theta) * r * rz]);
  }
  return points;
}

type Vec3 = [number, number, number];

function dist2(a: Vec3, b: Vec3) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

function edgeKey(a: number, b: number) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/** MST plus local 2-NN forks so lines branch instead of starring from the desk. */
function branchingEdges(points: Vec3[]): [number, number][] {
  const n = points.length;
  if (n < 2) return [];

  const pairs: { a: number; b: number; d: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({ a: i, b: j, d: dist2(points[i], points[j]) });
    }
  }
  pairs.sort((x, y) => x.d - y.d);

  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number =>
    parent[x] === x ? x : (parent[x] = find(parent[x]));

  const used = new Set<string>();
  const edges: [number, number][] = [];
  const degree = new Array<number>(n).fill(0);

  for (const p of pairs) {
    const pa = find(p.a);
    const pb = find(p.b);
    if (pa === pb) continue;
    parent[pa] = pb;
    used.add(edgeKey(p.a, p.b));
    edges.push([p.a, p.b]);
    degree[p.a] += 1;
    degree[p.b] += 1;
    if (edges.length === n - 1) break;
  }

  for (let i = 0; i < n; i++) {
    const nearest: { j: number; d: number }[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      nearest.push({ j, d: dist2(points[i], points[j]) });
    }
    nearest.sort((a, b) => a.d - b.d);
    for (const nb of nearest.slice(0, 2)) {
      const k = edgeKey(i, nb.j);
      if (used.has(k)) continue;
      if (degree[i] >= 3 && degree[nb.j] >= 3) continue;
      used.add(k);
      edges.push([i, nb.j]);
      degree[i] += 1;
      degree[nb.j] += 1;
    }
  }

  return edges;
}

function networkGeometry(
  points: Vec3[],
  edges: [number, number][],
  inset = 0.9,
) {
  const positions: number[] = [];
  for (const [a, b] of edges) {
    const pa = points[a];
    const pb = points[b];
    positions.push(
      pa[0] * inset,
      pa[1] * inset,
      pa[2] * inset,
      pb[0] * inset,
      pb[1] * inset,
      pb[2] * inset,
    );
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  return geometry;
}

function CodeFace({
  width,
  height,
  accent,
}: {
  width: number;
  height: number;
  accent: string;
}) {
  const lines = [
    { w: 0.78, y: 0.32, o: 0.7 },
    { w: 0.5, y: 0.18, o: 0.45 },
    { w: 0.66, y: 0.04, o: 0.55 },
    { w: 0.36, y: -0.1, o: 0.32 },
    { w: 0.58, y: -0.24, o: 0.5 },
    { w: 0.28, y: -0.38, o: 0.28 },
  ];

  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#10151c" />
      </mesh>
      {lines.map((line, i) => (
        <mesh
          key={i}
          position={[
            -width * 0.42 + (line.w * width) / 2,
            line.y * height,
            0.012,
          ]}
        >
          <planeGeometry args={[line.w * width, height * 0.055]} />
          <meshBasicMaterial color={accent} transparent opacity={line.o} />
        </mesh>
      ))}
    </group>
  );
}

function BoxBody({
  args,
  position,
  rotation,
  color,
  edge,
  roughness = 0.48,
  metalness = 0.16,
  emissive,
}: {
  args: [number, number, number];
  position?: Vec3;
  rotation?: Vec3;
  color: string;
  edge: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? 0.28 : 0}
      />
      <Edges color={edge} threshold={18} />
    </mesh>
  );
}

function Workstation({ theme }: { theme: DeskTheme }) {
  const desk = theme.light ? "#5c4638" : "#7a6a5a";
  const chassis = theme.light ? "#1f2228" : "#6a737e";
  const metal = theme.light ? "#3a3f48" : "#9aa3ae";
  const keys = theme.light ? theme.canvas : "#ece7dc";
  const ceramic = theme.light ? theme.canvas : "#f0ebe0";
  const edge = theme.light ? "#2a2018" : "#e8e2d6";
  const plant = theme.light ? "#3f6b52" : "#6fba88";
  const plantDark = theme.light ? "#2f5742" : "#4e9468";

  return (
    <group position={[0, -0.72, 0]}>
      <BoxBody
        args={[3.6, 0.1, 1.7]}
        position={[0, 0.08, 0]}
        color={desk}
        edge={edge}
        roughness={0.62}
        metalness={0.06}
        emissive={theme.light ? undefined : "#3a322c"}
      />
      {[-1.55, 1.55].map((x) => (
        <BoxBody
          key={x}
          args={[0.1, 0.62, 0.1]}
          position={[x, -0.28, 0.55]}
          color={metal}
          edge={edge}
          roughness={0.4}
          metalness={0.35}
        />
      ))}
      {[-1.55, 1.55].map((x) => (
        <BoxBody
          key={`b-${x}`}
          args={[0.1, 0.62, 0.1]}
          position={[x, -0.28, -0.55]}
          color={metal}
          edge={edge}
          roughness={0.4}
          metalness={0.35}
        />
      ))}

      <BoxBody
        args={[0.18, 0.32, 0.12]}
        position={[0, 0.28, -0.52]}
        color={metal}
        edge={edge}
        roughness={0.38}
        metalness={0.42}
      />
      <BoxBody
        args={[0.55, 0.05, 0.18]}
        position={[0, 0.52, -0.52]}
        color={metal}
        edge={edge}
        roughness={0.38}
        metalness={0.42}
      />
      <BoxBody
        args={[1.72, 1.02, 0.08]}
        position={[0, 1.08, -0.48]}
        color={chassis}
        edge={edge}
        roughness={0.32}
        metalness={0.22}
        emissive={theme.light ? undefined : "#2c333c"}
      />
      <group position={[0, 1.08, -0.432]}>
        <CodeFace width={1.56} height={0.88} accent={theme.accent} />
      </group>

      <group position={[-0.95, 0.13, 0.18]} rotation={[0, 0.18, 0]}>
        <BoxBody
          args={[0.95, 0.05, 0.62]}
          position={[0, 0.03, 0.08]}
          color={chassis}
          edge={edge}
          roughness={0.38}
          metalness={0.18}
        />
        <BoxBody
          args={[0.72, 0.02, 0.42]}
          position={[0, 0.035, 0.06]}
          color={keys}
          edge={edge}
          roughness={0.55}
          metalness={0.05}
        />
        <group position={[0, 0.42, -0.22]} rotation={[-0.55, 0, 0]}>
          <BoxBody
            args={[0.95, 0.62, 0.05]}
            color={chassis}
            edge={edge}
            roughness={0.32}
            metalness={0.2}
            emissive={theme.light ? undefined : "#2c333c"}
          />
          <group position={[0, 0, 0.03]}>
            <CodeFace width={0.84} height={0.52} accent={theme.accent} />
          </group>
        </group>
      </group>

      <group position={[0.35, 0.16, 0.32]}>
        <BoxBody
          args={[0.92, 0.05, 0.32]}
          color={chassis}
          edge={edge}
          roughness={0.38}
          metalness={0.15}
        />
        <BoxBody
          args={[0.84, 0.018, 0.24]}
          position={[0, 0.028, 0]}
          color={keys}
          edge={edge}
          roughness={0.58}
          metalness={0.04}
        />
      </group>
      <BoxBody
        args={[0.16, 0.04, 0.24]}
        position={[0.98, 0.155, 0.38]}
        rotation={[0, -0.2, 0]}
        color={chassis}
        edge={edge}
        roughness={0.38}
        metalness={0.15}
      />

      <group position={[1.42, 0.22, 0.22]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.22, 20]} />
          <meshStandardMaterial
            color={ceramic}
            roughness={0.5}
            metalness={0.05}
          />
          <Edges color={edge} threshold={18} />
        </mesh>
        <mesh position={[0.12, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.07, 0.016, 8, 16]} />
          <meshStandardMaterial
            color={ceramic}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
      </group>

      <group position={[-1.48, 0.13, 0.42]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.08, 0.1, 12]} />
          <meshStandardMaterial
            color={metal}
            roughness={0.45}
            metalness={0.2}
          />
          <Edges color={edge} threshold={18} />
        </mesh>
        <mesh position={[0.02, 0.16, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={plant} roughness={0.65} metalness={0} />
        </mesh>
        <mesh position={[-0.05, 0.14, 0.04]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color={plantDark}
            roughness={0.65}
            metalness={0}
          />
        </mesh>
      </group>

      <pointLight
        position={[0, 1.08, 0.15]}
        color={theme.accent}
        intensity={theme.light ? 0.35 : 1.6}
        distance={5.5}
      />
    </group>
  );
}

function OrbitScene({
  items,
  theme,
  reduceMotion,
}: {
  items: Skill[];
  theme: DeskTheme;
  reduceMotion: boolean;
}) {
  const points = useMemo(
    () => fibonacciEllipsoid(items.length, 3.55, 2.35, 3.45),
    [items.length],
  );
  const edges = useMemo(() => branchingEdges(points), [points]);
  const lines = useMemo(() => networkGeometry(points, edges), [points, edges]);
  const hubs = useMemo(
    () => points.map((p) => [p[0] * 0.9, p[1] * 0.9, p[2] * 0.9] as Vec3),
    [points],
  );

  return (
    <>
      <ambientLight intensity={theme.light ? 0.85 : 0.82} />
      <hemisphereLight
        color={theme.light ? "#fff8ee" : "#d7e6ff"}
        groundColor={theme.light ? "#c4b8a4" : "#3d342c"}
        intensity={theme.light ? 0.35 : 0.7}
      />
      <directionalLight
        position={[3.4, 5.6, 4.2]}
        intensity={theme.light ? 1.1 : 2.15}
        color={theme.light ? "#fff8ee" : "#fff6ea"}
      />
      <directionalLight
        position={[-4.2, 2.4, -3.2]}
        intensity={theme.light ? 0.25 : 1.15}
        color={theme.light ? theme.accent : "#9ee8d8"}
      />
      <directionalLight
        position={[0, 2.2, 5]}
        intensity={theme.light ? 0.2 : 0.7}
        color="#f3efe6"
      />

      <Workstation theme={theme} />

      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color={theme.accent}
          transparent
          opacity={theme.light ? 0.32 : 0.42}
          depthTest
          depthWrite={false}
        />
      </lineSegments>
      {hubs.map((p, i) => (
        <mesh key={`hub-${i}`} position={p}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color={theme.accent} />
        </mesh>
      ))}

      {items.map((skill, i) => (
        <Html
          key={skill.name}
          position={points[i]}
          center
          sprite
          occlude
          pointerEvents="none"
          zIndexRange={[20, 0]}
        >
          <div className="pointer-events-none select-none">
            <SkillPill skill={skill} />
          </div>
        </Html>
      ))}

      <ContactShadows
        position={[0, -1.34, 0]}
        opacity={theme.light ? 0.22 : 0.18}
        scale={8}
        blur={2.4}
        far={3.2}
        frames={1}
        resolution={256}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.4}
        rotateSpeed={0.5}
        target={[0, 0.15, 0]}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  );
}

export function SkillGlobe({
  items,
  theme,
  reduceMotion,
}: {
  items: Skill[];
  theme: DeskTheme;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative h-[min(78vh,720px)] w-full cursor-grab active:cursor-grabbing">
      <Canvas
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        frameloop={reduceMotion ? "demand" : "always"}
        camera={{ position: [4.4, 2.55, 5.2], fov: 38 }}
      >
        <AdaptiveDpr />
        <OrbitScene items={items} theme={theme} reduceMotion={reduceMotion} />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
        Drag to inspect the desk
      </p>
    </div>
  );
}
