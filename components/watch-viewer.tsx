"use client";

import { Suspense, useMemo, useRef } from "react";
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
   Individual gear — rotates on its own axis at its own speed
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
  const ref = useRef<THREE.Mesh>(null);
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
    if (ref.current) ref.current.rotation.z += speed * delta;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      geometry={geom}
      material={material}
      castShadow
      receiveShadow
    />
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
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 7) * 0.7;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Outer ring */}
      <mesh castShadow receiveShadow material={material}>
        <torusGeometry args={[0.55, 0.05, 16, 64]} />
      </mesh>
      {/* Spokes (3 arms) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i * Math.PI * 2) / 3]}
          castShadow
          material={material}
        >
          <boxGeometry args={[0.08, 1.0, 0.04]} />
        </mesh>
      ))}
      {/* Center hub */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} />
        <meshPhysicalMaterial
          attach="material"
          color="#999"
          metalness={1}
          roughness={0.2}
        />
      </mesh>
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

  return (
    <group rotation={[-Math.PI / 2.6, 0, 0]}>
      {/* Base plate — the main body of the movement */}
      <mesh receiveShadow castShadow position={[0, 0, -0.1]}>
        <cylinderGeometry args={[3, 3, 0.15, 64]} />
        <meshPhysicalMaterial
          color="#b8934a"
          metalness={1}
          roughness={0.45}
          clearcoat={0.2}
        />
      </mesh>

      {/* Decorative circular graining on the plate — subtle rings */}
      {[0.6, 1.2, 1.8, 2.4].map((r) => (
        <mesh key={r} position={[0, 0, -0.02]}>
          <torusGeometry args={[r, 0.008, 6, 80]} />
          <meshPhysicalMaterial
            color="#8a6f38"
            metalness={1}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Main gears — varied sizes, positions, and rotation speeds.
          Slower speed = lower-level (drive) gear, faster = higher-level. */}
      <Gear
        position={[0, 0, 0.2]}
        teeth={48}
        outerRadius={1.1}
        innerRadius={0.15}
        thickness={0.12}
        speed={0.3}
        material={mats.gold}
      />
      <Gear
        position={[1.4, 0.8, 0.3]}
        teeth={36}
        outerRadius={0.75}
        innerRadius={0.1}
        thickness={0.1}
        speed={-0.9}
        material={mats.roseGold}
      />
      <Gear
        position={[-1.3, 0.9, 0.3]}
        teeth={28}
        outerRadius={0.6}
        innerRadius={0.1}
        thickness={0.1}
        speed={1.2}
        material={mats.gold}
      />
      <Gear
        position={[-1.5, -0.9, 0.25]}
        teeth={22}
        outerRadius={0.5}
        innerRadius={0.09}
        thickness={0.1}
        speed={-1.6}
        material={mats.roseGold}
      />
      <Gear
        position={[1.2, -1.1, 0.25]}
        teeth={20}
        outerRadius={0.45}
        innerRadius={0.08}
        thickness={0.09}
        speed={2.2}
        material={mats.steel}
      />

      {/* Balance wheel — the signature oscillating component */}
      <group position={[0, -1.8, 0.35]}>
        <BalanceWheel position={[0, 0, 0]} material={mats.bluedSteel} />
      </group>

      {/* Curved bridge — elevated plate spanning across the movement */}
      <mesh position={[0.8, 0.2, 0.55]} castShadow>
        <boxGeometry args={[2.4, 0.6, 0.12]} />
        <meshPhysicalMaterial
          color="#c9a24c"
          metalness={1}
          roughness={0.3}
          clearcoat={0.4}
        />
      </mesh>

      {/* Ruby jewel bearings — scattered at gear axis points */}
      <Jewel position={[0, 0, 0.4]} material={mats.ruby} />
      <Jewel position={[1.4, 0.8, 0.5]} material={mats.ruby} />
      <Jewel position={[-1.3, 0.9, 0.5]} material={mats.ruby} />
      <Jewel position={[-1.5, -0.9, 0.45]} material={mats.ruby} />
      <Jewel position={[1.2, -1.1, 0.45]} material={mats.ruby} />
      <Jewel position={[0, -1.8, 0.5]} material={mats.ruby} />

      {/* Tiny screws at bridge corners */}
      {[
        [-0.3, 0.45, 0.65],
        [1.9, 0.45, 0.65],
        [-0.3, -0.05, 0.65],
        [1.9, -0.05, 0.65],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            <meshPhysicalMaterial
              color="#9c9c9c"
              metalness={1}
              roughness={0.25}
            />
          </mesh>
          {/* Screw slot */}
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[0.12, 0.01, 0.02]} />
            <meshBasicMaterial color="#1a1a1a" />
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
  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={35} />

      <Suspense fallback={null}>
        {modelUrl ? <LoadedModel url={modelUrl} /> : <ProceduralMovement />}

        {/* HDR environment — provides realistic PBR reflections.
            "studio" = clean photography-style key/fill/rim lighting. */}
        <Environment preset="studio" background={false} />

        {/* Soft shadow under the object — grounds it in space */}
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.6}
          scale={10}
          blur={2.5}
          far={4}
        />
      </Suspense>

      {/* Key + rim lights for extra sculpting beyond the HDR */}
      <directionalLight
        position={[4, 5, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#8ec5ff" />
      <directionalLight position={[0, -3, 5]} intensity={0.3} color="#c5ff3e" />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.75}
      />
    </Canvas>
  );
}
