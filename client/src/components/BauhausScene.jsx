'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './BauhausScene.css';

/**
 * The hero's 3D layer: a drifting constellation of Bauhaus solids —
 * spheres, arcs, cones, half-discs — in the primary palette.
 *
 *  • idle      : each body bobs and rotates on its own slow cycle
 *  • pointer   : the whole rig parallaxes toward the cursor
 *  • scroll    : bodies push outward and the camera dollies in as the
 *                hero leaves the viewport, so the shapes "open up"
 *
 * Written against raw three.js (no r3f) to keep the bundle small and the
 * rAF loop free of React re-renders.
 */

const PALETTE = {
  red: 0xe0331c,
  blue: 0x1d3fc4,
  yellow: 0xf5b800,
};

// x, y, z, scale, kind, color, spin speed, bob phase
const BODIES = [
  { pos: [-4.2, 1.6, -1], scale: 1.05, kind: 'sphere', color: 'red', spin: 0.18 },
  { pos: [4.0, 2.0, -2], scale: 1.5, kind: 'torus', color: 'blue', spin: 0.3 },
  { pos: [-2.6, -2.2, 0.5], scale: 1.1, kind: 'cone', color: 'yellow', spin: 0.24 },
  { pos: [3.1, -1.9, 0.8], scale: 0.95, kind: 'box', color: 'ink', spin: 0.2 },
  { pos: [-5.4, -0.8, -2.6], scale: 1.25, kind: 'halfdisc', color: 'blue', spin: 0.14 },
  { pos: [5.3, 0.2, -1.4], scale: 0.85, kind: 'sphere', color: 'yellow', spin: 0.26 },
  { pos: [0.4, 3.1, -3.2], scale: 1.15, kind: 'cylinder', color: 'red', spin: 0.16 },
  { pos: [-1.4, 2.4, 1.4], scale: 0.6, kind: 'sphere', color: 'ink', spin: 0.34 },
  { pos: [1.9, -3.1, -0.6], scale: 1.35, kind: 'torus', color: 'yellow', spin: 0.22 },
  { pos: [-3.6, 3.3, 0.2], scale: 0.75, kind: 'box', color: 'blue', spin: 0.28 },
  { pos: [2.4, 1.1, 1.9], scale: 0.7, kind: 'cone', color: 'red', spin: 0.3 },
  { pos: [-0.9, -3.4, 1.2], scale: 0.8, kind: 'halfdisc', color: 'red', spin: 0.19 },
  { pos: [6.0, -2.8, -3], scale: 1.0, kind: 'cylinder', color: 'blue', spin: 0.21 },
  { pos: [-6.1, 2.6, -1.8], scale: 0.65, kind: 'cone', color: 'ink', spin: 0.25 },
];

function makeGeometry(kind) {
  switch (kind) {
    case 'sphere':
      return new THREE.SphereGeometry(0.8, 48, 32);
    case 'torus':
      return new THREE.TorusGeometry(0.72, 0.26, 24, 64);
    case 'cone':
      return new THREE.ConeGeometry(0.72, 1.4, 42);
    case 'box':
      return new THREE.BoxGeometry(1.1, 1.1, 1.1);
    case 'cylinder':
      return new THREE.CylinderGeometry(0.55, 0.55, 1.5, 42);
    case 'halfdisc':
      // A Bauhaus quarter/half round: flat disc cut in half, given depth.
      return new THREE.CylinderGeometry(0.9, 0.9, 0.34, 48, 1, false, 0, Math.PI);
    default:
      return new THREE.SphereGeometry(0.8, 32, 24);
  }
}

export default function BauhausScene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      46,
      host.clientWidth / host.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL — the hero still reads fine without the canvas layer.
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    // Flat, poster-like lighting: matte surfaces, no specular sheen.
    scene.add(new THREE.AmbientLight(0xffffff, 1.45));

    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(4, 6, 8);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.7);
    fill.position.set(-6, -3, 4);
    scene.add(fill);

    const rig = new THREE.Group();
    scene.add(rig);

    const isDark = () => document.documentElement.classList.contains('dark-mode');
    const inkColor = () => (isDark() ? 0xf5f0e4 : 0x14110f);

    const geometries = [];
    const materials = [];

    const bodies = BODIES.map((spec, i) => {
      const geometry = makeGeometry(spec.kind);
      geometries.push(geometry);

      const material = new THREE.MeshLambertMaterial({
        color: spec.color === 'ink' ? inkColor() : PALETTE[spec.color],
      });
      materials.push(material);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...spec.pos);
      mesh.scale.setScalar(spec.scale);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      rig.add(mesh);

      return {
        mesh,
        home: new THREE.Vector3(...spec.pos),
        spin: spec.spin,
        phase: i * 0.7,
        isInk: spec.color === 'ink',
        material,
      };
    });

    // Keep ink-colored bodies legible when the theme flips.
    const themeObserver = new MutationObserver(() => {
      const c = inkColor();
      bodies.forEach((b) => b.isInk && b.material.color.setHex(c));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // ── Pointer parallax ──────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // ── Resize ────────────────────────────────────────────
    // The rig spans roughly ±6 units in x, so on a tall/narrow container the
    // camera has to pull back or the outer bodies clip off the sides.
    let baseZ = 11;

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      baseZ = aspect >= 1.3 ? 11 : THREE.MathUtils.clamp(11 * (1.3 / aspect), 11, 21);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ── Pause when the hero is off screen ─────────────────
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) visible = false;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Loop ──────────────────────────────────────────────
    const start = performance.now();
    const scratch = new THREE.Vector3();
    let frame;
    let scrollEased = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible) return;

      const t = (performance.now() - start) / 1000;

      // How far the hero has scrolled out of view, 0 → 1.
      const rect = host.getBoundingClientRect();
      const raw = THREE.MathUtils.clamp(
        -rect.top / Math.max(rect.height, 1),
        0,
        1
      );
      scrollEased += (raw - scrollEased) * 0.08;

      smoothed.x += (pointer.x - smoothed.x) * 0.05;
      smoothed.y += (pointer.y - smoothed.y) * 0.05;

      bodies.forEach((b) => {
        const { mesh } = b;

        if (!reduced) {
          mesh.rotation.x += b.spin * 0.004;
          mesh.rotation.y += b.spin * 0.006;
        }

        // Bob around home, then push outward as the hero scrolls away.
        const bob = reduced ? 0 : Math.sin(t * 0.5 + b.phase) * 0.28;
        const spread = 1 + scrollEased * 0.85;

        scratch.copy(b.home).multiplyScalar(spread);
        mesh.position.set(
          scratch.x,
          scratch.y + bob - scrollEased * 1.2,
          scratch.z
        );
      });

      // Rig tilts toward the cursor; camera eases in on scroll.
      rig.rotation.y = smoothed.x * 0.22;
      rig.rotation.x = smoothed.y * 0.16;
      camera.position.z = baseZ - scrollEased * 2.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={hostRef} className="bauhaus-scene" aria-hidden="true" />;
}
