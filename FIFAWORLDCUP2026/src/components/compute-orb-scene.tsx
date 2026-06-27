"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export function ComputeOrbScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    const shell = new THREE.Group();
    root.add(shell);
    scene.add(root);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    const key = new THREE.DirectionalLight(0x67e8ae, 2.4);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0xffffff, 0.75);
    fill.position.set(-4, -2, 2);
    scene.add(ambient, key, fill);

    const coreGeometry = new THREE.IcosahedronGeometry(1.02, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0x10281d,
      emissiveIntensity: 0.55,
      metalness: 0.36,
      roughness: 0.42,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    shell.add(core);

    const nodeGeometry = new THREE.BoxGeometry(0.055, 0.055, 0.055);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x67e8ae,
      emissive: 0x67e8ae,
      emissiveIntensity: 0.55,
      metalness: 0.1,
      roughness: 0.25,
    });
    const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, 132);
    const dummy = new THREE.Object3D();
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < 132; i += 1) {
      const t = i / 132;
      const angle = t * Math.PI * 2 * 5.4;
      const y = 1 - 2 * t;
      const radius = Math.sqrt(1 - y * y);
      const point = new THREE.Vector3(
        Math.cos(angle) * radius * 2.16,
        y * 1.36,
        Math.sin(angle) * radius * 2.16,
      );
      positions.push(point);
      dummy.position.copy(point);
      dummy.rotation.set(angle * 0.2, angle, angle * 0.35);
      const scale = i % 7 === 0 ? 1.75 : 1;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    shell.add(nodes);

    const linePositions: number[] = [];
    for (let i = 0; i < positions.length; i += 1) {
      if (i % 2 === 0) {
        const a = positions[i];
        const b = positions[(i + 13) % positions.length];
        linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
      if (i % 5 === 0) {
        const a = positions[i];
        const b = positions[(i + 31) % positions.length];
        linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x67e8ae,
      transparent: true,
      opacity: 0.18,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    shell.add(lines);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(2.54, 0.004, 8, 180), ringMaterial),
      new THREE.Mesh(new THREE.TorusGeometry(2.04, 0.004, 8, 180), ringMaterial),
      new THREE.Mesh(new THREE.TorusGeometry(1.54, 0.004, 8, 180), ringMaterial),
    ];
    rings[0].rotation.x = Math.PI / 2.35;
    rings[1].rotation.y = Math.PI / 2.85;
    rings[2].rotation.z = Math.PI / 2.2;
    rings.forEach((ring) => shell.add(ring));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions: number[] = [];
    for (let i = 0; i < 220; i += 1) {
      const spread = 10;
      particlePositions.push(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 5.2,
        (Math.random() - 0.5) * 3.6,
      );
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(particlePositions, 3),
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x67e8ae,
      size: 0.014,
      transparent: true,
      opacity: 0.36,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    host.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const compact = width < 720;
      shell.scale.setScalar(compact ? 0.86 : 1);
      shell.position.set(0, compact ? -0.05 : 0.16, 0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      frame += 0.01;
      root.rotation.y += (pointer.x * 0.18 - root.rotation.y) * 0.035;
      root.rotation.x += (-pointer.y * 0.1 - root.rotation.x) * 0.035;
      shell.rotation.y = frame * 0.28;
      shell.rotation.x = Math.sin(frame * 0.6) * 0.08;
      particles.rotation.y = -frame * 0.05;
      rings[0].rotation.z += 0.0025;
      rings[1].rotation.x += 0.0018;
      rings[2].rotation.y -= 0.0022;
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      host.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      renderer.dispose();
      host.removeChild(renderer.domElement);
      coreGeometry.dispose();
      coreMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      ringMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn("pointer-events-auto absolute inset-0", className)}
    />
  );
}
