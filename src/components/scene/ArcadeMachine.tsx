'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DROPS } from '@/lib/drops';

interface ArcadeMachineProps {
  position?: [number, number, number];
  activeIndex: number;
}

export default function ArcadeMachine({
  position = [0, 0, 0],
  activeIndex,
}: ArcadeMachineProps) {
  const drop   = DROPS[activeIndex];
  const accent = drop.accent;

  const [screenTex, setScreenTex] = useState<THREE.CanvasTexture | null>(null);
  const screenTexRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const rotRef       = useRef(0);
  const glowRef      = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = 256;
    canvas.height = 256;
    canvasRef.current    = canvas;
    const tex            = new THREE.CanvasTexture(canvas);
    screenTexRef.current = tex;
    setScreenTex(tex);
  }, []);

  useFrame((_s, dt) => {
    rotRef.current += dt * 0.7;

    if (!canvasRef.current || !screenTexRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const w = 256, h = 256;
    ctx.clearRect(0, 0, w, h);

    // Sfondo CRT scuro
    ctx.fillStyle = '#030a06';
    ctx.fillRect(0, 0, w, h);

    // Scanlines CRT
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 2);

    // Silhouette t-shirt 2D rotante
    const cx = w / 2, cy = h / 2 - 12;
    const scale = 55 + Math.cos(rotRef.current) * 22;
    const sh    = 80 + Math.sin(rotRef.current * 0.7) * 6;

    ctx.save();
    ctx.translate(cx, cy);

    // Corpo
    const bodyGrad = ctx.createLinearGradient(-scale, 0, scale, 0);
    bodyGrad.addColorStop(0,   'rgba(8,6,4,0.92)');
    bodyGrad.addColorStop(0.3, accent + 'CC');
    bodyGrad.addColorStop(0.7, accent + '99');
    bodyGrad.addColorStop(1,   'rgba(8,6,4,0.92)');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-scale * 0.55, -sh * 0.5, scale * 1.1, sh, 3);
    ctx.fill();

    // Maniche
    ctx.fillStyle = accent + '88';
    const sleeveW = scale * 0.36;
    const sleeveH = sh * 0.32;
    // manica sx
    ctx.beginPath();
    ctx.roundRect(-scale * 0.55 - sleeveW, -sh * 0.5 + sh * 0.05, sleeveW, sleeveH, 2);
    ctx.fill();
    // manica dx
    ctx.beginPath();
    ctx.roundRect(scale * 0.55, -sh * 0.5 + sh * 0.05, sleeveW, sleeveH, 2);
    ctx.fill();

    // Colletto (curva in cima)
    ctx.fillStyle = '#030a06';
    ctx.beginPath();
    ctx.arc(0, -sh * 0.5, scale * 0.18, 0, Math.PI);
    ctx.fill();

    ctx.restore();

    // Glow radiale accent
    const radGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 90);
    radGrad.addColorStop(0, accent + '22');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, w, h);

    // Drop code — stile pixel
    ctx.fillStyle = accent;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(drop.code, cx, cy + sh * 0.5 + 22);

    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '8px monospace';
    ctx.fillText(drop.name, cx, cy + sh * 0.5 + 36);

    screenTexRef.current.needsUpdate = true;

    if (glowRef.current) {
      glowRef.current.intensity = 1.4 + Math.sin(rotRef.current * 1.3) * 0.25;
    }
  });

  const accentColor = new THREE.Color(accent);

  // Dimensioni: 0.6 × 1.25 × 0.38 (proporzionate rispetto all'isola radius 1.6)
  const W = 0.6, H = 1.25, D = 0.38;

  return (
    <group position={position}>
      {/* === CABINET PRINCIPALE — materiale plastica nera lucida === */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial
          color="#0e0909"
          roughness={0.18}
          metalness={0.45}
        />
      </mesh>

      {/* Striscia marquee in cima */}
      <mesh position={[0, H / 2 + 0.01, 0]}>
        <boxGeometry args={[W, 0.12, D]} />
        <meshStandardMaterial
          color="#0a0707"
          roughness={0.3}
          metalness={0.6}
          emissive={accentColor}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Cornice schermo */}
      <mesh position={[0, 0.16, D / 2 + 0.002]}>
        <boxGeometry args={[W * 0.88, H * 0.36, 0.018]} />
        <meshStandardMaterial color="#070505" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Schermo con CanvasTexture */}
      <mesh position={[0, 0.16, D / 2 + 0.012]}>
        <planeGeometry args={[W * 0.76, H * 0.30]} />
        <meshBasicMaterial map={screenTex ?? undefined} />
      </mesh>

      {/* Piano di controllo inclinato */}
      <group position={[0, -H * 0.32, D * 0.18]} rotation={[-0.52, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[W * 0.9, H * 0.22, D * 0.55]} />
          <meshStandardMaterial color="#0b0808" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Joystick */}
        <mesh position={[-W * 0.22, H * 0.12, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.095, 8]} />
          <meshStandardMaterial color="#999" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-W * 0.22, H * 0.165, 0]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color="#bbb" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Bottoni con i 3 accent dei drop */}
        {DROPS.map((d, i) => (
          <mesh key={d.code} position={[W * 0.06 + i * 0.098, H * 0.12, 0]}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial
              color={d.accent}
              roughness={0.2}
              metalness={0.1}
              emissive={new THREE.Color(d.accent)}
              emissiveIntensity={i === activeIndex ? 0.7 : 0.12}
            />
          </mesh>
        ))}
      </group>

      {/* Bordatura laterale sinistra — neon sottile */}
      <mesh position={[-W / 2 - 0.006, 0, 0]}>
        <boxGeometry args={[0.01, H + 0.14, D]} />
        <meshStandardMaterial
          color={accent}
          emissive={accentColor}
          emissiveIntensity={0.55}
          roughness={0.5}
        />
      </mesh>

      {/* Bordatura laterale destra */}
      <mesh position={[W / 2 + 0.006, 0, 0]}>
        <boxGeometry args={[0.01, H + 0.14, D]} />
        <meshStandardMaterial
          color={accent}
          emissive={accentColor}
          emissiveIntensity={0.55}
          roughness={0.5}
        />
      </mesh>

      {/* Bordatura top */}
      <mesh position={[0, H / 2 + 0.065, 0]}>
        <boxGeometry args={[W + 0.014, 0.008, D]} />
        <meshStandardMaterial
          color={accent}
          emissive={accentColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Base / piedistallo */}
      <mesh position={[0, -H / 2 - 0.04, 0]}>
        <boxGeometry args={[W + 0.06, 0.07, D + 0.04]} />
        <meshStandardMaterial color="#0a0808" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* PointLight schermo — glow accent */}
      <pointLight
        ref={glowRef}
        position={[0, 0.16, D / 2 + 0.35]}
        color={accent}
        intensity={1.4}
        distance={2.0}
        decay={2}
      />
    </group>
  );
}
