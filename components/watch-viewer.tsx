"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────
   Gear shape helper — builds a 2D profile of a cog with N teeth,
   then extrudes it into 3D with a bevel for realistic edges.
   ────────────────────────────────────────────────────────── */
function makeGearGeometry(
  teeth: number,
  outerRadius: number,
  innerRadius: number,
  toothDepth: number,
  thickness: number,
) {
  const shape = new THREE.Shape();
  const steps = teeth * 2;
  const angleStep = (Math.PI * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const a = i * angleStep;
    // Alternate outer (tip of tooth) and inner (valley) radii
    const r = i % 2 === 0 ? outerRadius : outerRadius - toothDepth;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  return new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.008,
    bevelSegments: 3,
    curveSegments: 32,
  });
}

/* ──────────────────────────────────────────────────────────
   Materials — reused across the scene for consistent look
   ────────────────────────────────────────────────────────── */
function useWatchMaterials() {
  return useMemo(() => {
    const gold = new THREE.MeshPhysicalMaterial({
      color: "#d4a85a",
      metalness: 1,
      roughness: 0.28,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      reflectivity: 1,
    });
    const roseGold = new THREE.MeshPhysicalMaterial({
      color: "#c98d6b",
      metalness: 1,
      roughness: 0.22,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
    });
    const steel = new THREE.MeshPhysicalMaterial({
      color: "#b8b8b8",
      metalness: 1,
      roughness: 0.18,
      clearcoat: 0.3,
    });
    const bluedSteel = new THREE.MeshPhysicalMaterial({
      color: "#2a3a7a",
      metalness: 1,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05,
    });
    const ruby = new THREE.MeshPhysicalMaterial({
      color: "#c42a2a",
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      thickness: 0.5,
      ior: 1.76,
      emissive: "#661414",
      emissiveIntensity: 0.3,
    });
    return { gold, roseGold, steel, bluedSteel, ruby };
  }, []);
}

/* ──────────────────────────────────────────────────────────
   Individual gear — rotates on its own axis at its own speed.
   The gear shape is drawn in XY and extruded along +Z, so we
   rotate it -π/2 around X to make it lie flat on a horizontal
   plate (Y-up world). Rotation animation is then around the
   LOCAL z-axis (= world y-axis after the flat rotation).
   ────────────────────────────────────────────────────────── */
function Gear({
  position,
  teeth,
  outerRadius,
  innerRadius,
  thickness,
  speed,
  material,
}: {
  position: [number, number, number];
  teeth: number;
  outerRadius: number;
  innerRadius: number;
  thickness: number;
  speed: number;
  material: THREE.Material;
}) {
  const innerRef = useRef<THREE.Mesh>(null);
  const geom = useMemo(
    () =>
      makeGearGeometry(
        teeth,
        outerRadius,
        innerRadius,
        outerRadius * 0.14,
        thickness,
      ),
    [teeth, outerRadius, innerRadius, thickness],
  );

  useFrame((_, delta) => {
    // Rotate around the gear's own axis (local Z, before flat rotation).
    if (innerRef.current) innerRef.current.rotation.z += speed * delta;
  });

  // Outer group positions the gear in world space; inner mesh handles
  // the "lay flat" rotation and the spinning animation.
  return (
    <group position={position}>
      <mesh
        ref={innerRef}
        // +π/2 (not -π/2) so the extrusion rises ABOVE the gear's
        // anchor point instead of sinking through the base plate.
        rotation={[Math.PI / 2, 0, 0]}
        geometry={geom}
        material={material}
        castShadow
        receiveShadow
      />
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Balance wheel — the spinning flywheel at the heart of a watch.
   Oscillates back and forth instead of rotating continuously.
   ────────────────────────────────────────────────────────── */
function BalanceWheel({
  position,
  material,
}: {
  position: [number, number, number];
  material: THREE.Material;
}) {
  const spinRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    // Oscillate around Y (the up axis after flat rotation).
    if (spinRef.current) {
      spinRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 7) * 0.7;
    }
  });

  return (
    <group position={position}>
      <group ref={spinRef}>
        {/* Outer ring — torus lies flat when rotated -π/2 on X */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
          material={material}
        >
          <torusGeometry args={[0.55, 0.05, 16, 64]} />
        </mesh>
        {/* Spokes (3 arms lying in the horizontal plane) */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            rotation={[0, (i * Math.PI * 2) / 3, 0]}
            castShadow
            material={material}
          >
            <boxGeometry args={[1.0, 0.04, 0.08]} />
          </mesh>
        ))}
        {/* Center hub (cylinder's axis is Y = up, already correct) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 32]} />
          <meshPhysicalMaterial
            color="#bbb"
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Jewel bearing — tiny faceted ruby pressed into the plate
   ────────────────────────────────────────────────────────── */
function Jewel({
  position,
  material,
}: {
  position: [number, number, number];
  material: THREE.Material;
}) {
  return (
    <group position={position}>
      {/* Gold setting ring */}
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
        <meshPhysicalMaterial color="#c9a24c" metalness={1} roughness={0.3} />
      </mesh>
      {/* Ruby jewel */}
      <mesh position={[0, 0.025, 0]} material={material}>
        <sphereGeometry args={[0.06, 16, 12]} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Full procedural movement — assembled from all the parts
   ────────────────────────────────────────────────────────── */
function ProceduralMovement() {
  const mats = useWatchMaterials();

  // World convention: Y is up. Base plate lies flat in the XZ plane.
  // Every component's vertical ("stacked") coordinate is Y.
  return (
    <group>
      {/* Base plate — horizontal gold disc, 3 units radius */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 96]} />
        <meshPhysicalMaterial
          color="#b8934a"
          metalness={1}
          roughness={0.38}
          clearcoat={0.25}
        />
      </mesh>

      {/* Decorative concentric rings on the plate surface (sunburst) */}
      {[0.6, 1.2, 1.8, 2.4, 2.7].map((r) => (
        <mesh key={r} position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.006, 6, 120]} />
          <meshPhysicalMaterial
            color="#8a6f38"
            metalness={1}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Main gears — each position uses [x, y, z] where y is vertical.
          Y offsets stack them above the plate at different heights. */}
      <Gear
        position={[0, 0.15, 0]}
        teeth={60}
        outerRadius={1.1}
        innerRadius={0.15}
        thickness={0.14}
        speed={0.3}
        material={mats.gold}
      />
      <Gear
        position={[1.4, 0.2, 0.8]}
        teeth={40}
        outerRadius={0.75}
        innerRadius={0.1}
        thickness={0.12}
        speed={-0.9}
        material={mats.roseGold}
      />
      <Gear
        position={[-1.3, 0.22, 0.9]}
        teeth={32}
        outerRadius={0.6}
        innerRadius={0.1}
        thickness={0.12}
        speed={1.2}
        material={mats.gold}
      />
      <Gear
        position={[-1.5, 0.25, -0.9]}
        teeth={26}
        outerRadius={0.5}
        innerRadius={0.09}
        thickness={0.11}
        speed={-1.6}
        material={mats.roseGold}
      />
      <Gear
        position={[1.2, 0.28, -1.1]}
        teeth={22}
        outerRadius={0.45}
        innerRadius={0.08}
        thickness={0.11}
        speed={2.2}
        material={mats.steel}
      />

      {/* Balance wheel — the signature oscillating component, front-center */}
      <BalanceWheel position={[0, 0.55, -1.8]} material={mats.bluedSteel} />

      {/* Hairspring spiral beneath the balance wheel — a thin coiled torus.
          Builds a subtle blue spiral effect with overlapping rings. */}
      {[0.15, 0.22, 0.3, 0.38].map((r, i) => (
        <mesh
          key={i}
          position={[0, 0.4 + i * 0.005, -1.8]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[r, 0.008, 6, 64]} />
          <meshPhysicalMaterial
            color="#3a4a9a"
            metalness={1}
            roughness={0.15}
          />
        </mesh>
      ))}

      {/* Curved bridge — elevated plate spanning across the top of the
          movement, offset slightly forward so main gears peek beneath. */}
      <mesh position={[0.2, 0.42, 0.85]} castShadow>
        <boxGeometry args={[2.6, 0.15, 0.7]} />
        <meshPhysicalMaterial
          color="#c9a24c"
          metalness={1}
          roughness={0.28}
          clearcoat={0.45}
        />
      </mesh>

      {/* Second smaller bridge on the opposite side for asymmetry */}
      <mesh position={[-0.5, 0.4, -0.4]} castShadow rotation={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 0.12, 0.45]} />
        <meshPhysicalMaterial
          color="#c9a24c"
          metalness={1}
          roughness={0.3}
          clearcoat={0.4}
        />
      </mesh>

      {/* Ruby jewel bearings — at each gear axis, plus one under balance wheel */}
      <Jewel position={[0, 0.5, 0]} material={mats.ruby} />
      <Jewel position={[1.4, 0.54, 0.8]} material={mats.ruby} />
      <Jewel position={[-1.3, 0.56, 0.9]} material={mats.ruby} />
      <Jewel position={[-1.5, 0.52, -0.9]} material={mats.ruby} />
      <Jewel position={[1.2, 0.5, -1.1]} material={mats.ruby} />
      <Jewel position={[0, 0.58, -1.8]} material={mats.ruby} />

      {/* Tiny screws at bridge corners — countersunk with a dark slot */}
      {(
        [
          [-0.9, 0.53, 1.1],
          [1.3, 0.53, 1.1],
          [-0.9, 0.53, 0.6],
          [1.3, 0.53, 0.6],
        ] as const
      ).map((pos, i) => (
        <group key={i} position={pos as unknown as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
            <meshPhysicalMaterial
              color="#a5a5a5"
              metalness={1}
              roughness={0.22}
            />
          </mesh>
          {/* Screw slot — tiny dark box on top */}
          <mesh position={[0, 0.028, 0]} rotation={[0, (i % 2) * 0.4, 0]}>
            <boxGeometry args={[0.13, 0.008, 0.025]} />
            <meshBasicMaterial color="#111" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   GLB loader — swap in a real Sketchfab model later by passing
   a modelUrl prop. Until then, falls back to the procedural one.
   ────────────────────────────────────────────────────────── */
function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/* ──────────────────────────────────────────────────────────
   Main exported viewer
   ────────────────────────────────────────────────────────── */
export function WatchViewer({ modelUrl }: { modelUrl?: string }) {
  // R3F's ResizeObserver can miss the initial size when mounted via
  // next/dynamic — the parent measures 0 before layout settles. Firing
  // a resize event after mount forces R3F to re-measure and resize
  // the WebGL canvas to its true container dimensions.
  useEffect(() => {
    // Fire several times over a ~200ms window to catch the parent once
    // layout settles (parent sometimes measures 0 at initial mount).
    const timers = [0, 50, 150, 300].map((ms) =>
      setTimeout(() => window.dispatchEvent(new Event("resize")), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        // Needed so external tools (e.g. screenshot / readPixels) can
        // sample the rendered frame. Small perf cost is negligible here.
        preserveDrawingBuffer: true,
      }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {/* Watchmaker's 3/4 overhead view — high enough to see the layout,
          angled enough to show depth of bridges and gears */}
      <PerspectiveCamera makeDefault position={[3, 5, 6]} fov={32} />

      <Suspense fallback={null}>
        {modelUrl ? <LoadedModel url={modelUrl} /> : <ProceduralMovement />}

        {/* HDR environment — provides realistic PBR reflections.
            "studio" = clean photography-style key/fill/rim lighting. */}
        <Environment preset="studio" background={false} />

        {/* Soft shadow directly beneath the plate — grounds the object */}
        <ContactShadows
          position={[0, -0.11, 0]}
          opacity={0.7}
          scale={14}
          blur={2.6}
          far={3}
        />
      </Suspense>

      {/* Key + rim lights for extra sculpting beyond the HDR */}
      <directionalLight
        position={[5, 7, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#8ec5ff" />
      <directionalLight position={[0, -2, 5]} intensity={0.25} color="#c5ff3e" />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.6}
        enablePan={false}
        target={[0, 0.2, 0]}
        minDistance={5}
        maxDistance={14}
        // Keep the camera between "slightly above horizon" and "straight down"
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.48}
      />
    </Canvas>
  );
}
