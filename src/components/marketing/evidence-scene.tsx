"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";

import { storyBeatAt } from "./story-progress";

function ResumeLines() {
  const lines = [
    [-1.22, 1.72, 1.45],
    [-1.22, 1.42, 2.3],
    [-1.22, 1.15, 1.92],
    [-1.22, 0.47, 2.72],
    [-1.22, 0.19, 2.34],
    [-1.22, -0.72, 2.5],
    [-1.22, -1, 2.84],
    [-1.22, -1.28, 1.84],
  ] as const;

  return (
    <group position={[0, 0.075, 0]}>
      {lines.map(([x, z, width]) => (
        <mesh key={`${x}-${z}-${width}`} position={[x + width / 2, 0, z]}>
          <boxGeometry args={[width, 0.018, 0.055]} />
          <meshStandardMaterial color="#2d2d2b" roughness={0.86} />
        </mesh>
      ))}
    </group>
  );
}

function GapBracket({ x, z, flip = false }: { x: number; z: number; flip?: boolean }) {
  return (
    <group position={[x, 0.13, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[0.035, 0.035, 0.38]} />
        <meshStandardMaterial color="#ff5a1f" emissive="#ff3b00" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.12, 0, 0.36]}>
        <boxGeometry args={[0.25, 0.035, 0.035]} />
        <meshStandardMaterial color="#ff5a1f" emissive="#ff3b00" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.25, 0.035, 0.035]} />
        <meshStandardMaterial color="#ff5a1f" emissive="#ff3b00" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

function EvidenceChamber() {
  const progress = useRef(0);
  const chamber = useRef<Group>(null);
  const resume = useRef<Group>(null);
  const scanner = useRef<Mesh>(null);
  const claim = useRef<Mesh>(null);
  const gaps = useRef<Group>(null);
  const resolved = useRef<MeshStandardMaterial>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = document.querySelector<HTMLElement>("#evidence-story");
    const pin = section?.querySelector<HTMLElement>("[data-scene-pin]");
    if (!section || !pin) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(pin, { position: "relative", top: "auto" });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              pin,
              pinSpacing: false,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                progress.current = self.progress;
                section.dataset.activeStoryBeat = storyBeatAt(self.progress);
                invalidate();
              },
            },
          });

          timeline.to(progress, { current: 1, duration: 1, ease: "none" });

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );

      return () => media.revert();
    }, section);

    invalidate();
    return () => context.revert();
  }, [invalidate]);

  useFrame(() => {
    const value = progress.current;
    const entrance = Math.min(1, value / 0.2);
    const scan = Math.min(1, Math.max(0, (value - 0.15) / 0.28));
    const lift = Math.min(1, Math.max(0, (value - 0.32) / 0.24));
    const flag = Math.min(1, Math.max(0, (value - 0.56) / 0.18));
    const resolve = Math.min(1, Math.max(0, (value - 0.76) / 0.2));

    if (chamber.current) {
      chamber.current.rotation.y = -0.18 + value * 0.24;
      chamber.current.position.y = -0.72 + entrance * 0.72;
    }
    if (resume.current) {
      resume.current.rotation.z = -0.08 + entrance * 0.08;
    }
    if (scanner.current) {
      scanner.current.position.z = 2.25 - scan * 4.5;
    }
    if (claim.current) {
      claim.current.position.y = 0.1 + lift * 0.82 - resolve * 0.34;
      claim.current.position.x = lift * 0.42;
      claim.current.rotation.z = lift * -0.05;
    }
    if (gaps.current) {
      gaps.current.scale.setScalar(Math.max(0.001, flag * (1 - resolve * 0.78)));
    }
    if (resolved.current) {
      resolved.current.emissiveIntensity = resolve * 0.52;
    }

    camera.position.set(0.3 + value * 0.7, 4.8 - value * 0.8, 7.6 - value * 1.25);
    camera.lookAt(0, -0.15, 0);
  });

  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[-3, 6, 5]} intensity={3.1} color="#fff4df" />
      <pointLight position={[3.5, 1.2, 1.8]} intensity={22} distance={8} color="#ff5a1f" />
      <group ref={chamber} rotation={[-0.72, -0.18, 0]} position={[0, -0.72, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[5.9, 0.34, 7.2]} />
          <meshStandardMaterial color="#101216" metalness={0.68} roughness={0.44} />
        </mesh>

        <group ref={resume}>
          <mesh receiveShadow>
            <boxGeometry args={[4.35, 0.11, 5.65]} />
            <meshStandardMaterial
              ref={resolved}
              color="#e8e2d7"
              emissive="#ffcf9e"
              emissiveIntensity={0}
              metalness={0.02}
              roughness={0.78}
            />
          </mesh>
          <ResumeLines />
          <mesh ref={claim} position={[0.12, 0.1, 0.16]}>
            <boxGeometry args={[3.18, 0.08, 0.42]} />
            <meshStandardMaterial color="#f4eee4" metalness={0.02} roughness={0.7} />
          </mesh>
          <group ref={gaps} scale={0.001}>
            <GapBracket x={-1.74} z={0.16} />
            <GapBracket x={1.72} z={-1.12} flip />
          </group>
        </group>

        <mesh ref={scanner} position={[0, 1.05, 2.25]}>
          <boxGeometry args={[5.25, 0.16, 0.12]} />
          <meshStandardMaterial
            color="#ff5a1f"
            emissive="#ff3b00"
            emissiveIntensity={2.8}
            metalness={0.24}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[-2.75, 0.55, 0]}>
          <boxGeometry args={[0.16, 1.9, 6.4]} />
          <meshStandardMaterial color="#202329" metalness={0.82} roughness={0.3} />
        </mesh>
        <mesh position={[2.75, 0.55, 0]}>
          <boxGeometry args={[0.16, 1.9, 6.4]} />
          <meshStandardMaterial color="#202329" metalness={0.82} roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}

export function EvidenceScene() {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 38, near: 0.1, far: 40, position: [0.3, 4.8, 7.6] }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows={false}
      style={{ background: "#0d0f12" }}
    >
      <EvidenceChamber />
    </Canvas>
  );
}
