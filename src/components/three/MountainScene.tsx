'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { scrollState } from '@/lib/scrollState';
import { horizon } from '@/content/places';

const MOBILE = typeof window !== 'undefined' && (window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches);

/* ---------- deterministic noise (no deps) ---------- */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function ridged(x: number, y: number) {
  let sum = 0, amp = 0.55, freq = 1, weight = 1;
  for (let i = 0; i < 6; i++) {
    let n = 1 - Math.abs(vnoise(x * freq, y * freq) * 2 - 1);
    n *= n * weight;
    weight = Math.min(1, Math.max(0, n * 1.6));
    sum += n * amp;
    freq *= 2.05;
    amp *= 0.5;
  }
  return sum;
}

/* ---------- terrain ---------- */
const terrainVert = /* glsl */ `
  varying float vH; varying vec3 vWorld; varying vec3 vNormal2;
  void main() {
    vH = position.z;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vNormal2 = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const terrainFrag = /* glsl */ `
  uniform float uTime; uniform vec3 uFog; uniform vec3 uBeacon; uniform float uReveal;
  varying float vH; varying vec3 vWorld; varying vec3 vNormal2;
  void main() {
    vec3 low = vec3(0.025, 0.03, 0.05);
    vec3 mid = vec3(0.07, 0.085, 0.13);
    vec3 snow = vec3(0.46, 0.51, 0.62);
    float h = vH;
    vec3 col = mix(low, mid, smoothstep(0.0, 2.2, h));
    float slope = 1.0 - clamp(vNormal2.y, 0.0, 1.0);
    col = mix(col, snow, smoothstep(3.0, 5.2, h) * (1.0 - smoothstep(0.35, 0.7, slope)));
    // moonlight from upper left
    vec3 L = normalize(vec3(-0.6, 0.7, -0.4));
    float diff = clamp(dot(vNormal2, L), 0.0, 1.0);
    col *= 0.45 + diff * 0.9;
    // topographic contour lines (the "lab" signature)
    float lines = abs(fract(h * 2.2 - uTime * 0.04) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.035, lines);
    float sweep = smoothstep(uReveal - 6.0, uReveal, -vWorld.z) * (1.0 - smoothstep(uReveal, uReveal + 0.5, -vWorld.z));
    col += vec3(0.49, 0.95, 0.84) * contour * (0.10 + sweep * 0.5) * smoothstep(0.3, 1.2, h);
    // beacon glow
    float bd = distance(vWorld.xz, uBeacon.xz);
    col += vec3(1.0, 0.7, 0.33) * exp(-bd * 0.9) * 0.35;
    // distance fog
    float d = length(vWorld - cameraPosition);
    float fog = 1.0 - exp(-pow(d * 0.028, 1.6));
    gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
  }
`;

const TERRAIN_Z = -20;
const TERRAIN_Y = -2.2;
const BEACON_LOCAL = { x: 3.2, y: 6 };

function heightAt(x: number, y: number) {
  const depth = THREE.MathUtils.clamp((y + 35) / 70, 0, 1); // 0 front, 1 back
  const valley = Math.min(1, Math.abs(x) / 9); // carve a valley the camera flies through
  let h = ridged(x * 0.07 + 10, y * 0.07 + 3) * 7.5;
  h *= 0.25 + valley * 0.85;
  h *= 0.35 + depth * 0.9;
  const bd = Math.hypot(x - BEACON_LOCAL.x, y - BEACON_LOCAL.y);
  h += Math.exp(-bd * bd * 0.05) * 2.4;
  return h;
}
// local plane (x, y, h) -> world (x, h + TERRAIN_Y, -y + TERRAIN_Z)
const BEACON = new THREE.Vector3(BEACON_LOCAL.x, heightAt(BEACON_LOCAL.x, BEACON_LOCAL.y) + TERRAIN_Y, -BEACON_LOCAL.y + TERRAIN_Z);

function Terrain() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(90, 70, MOBILE ? 100 : 190, MOBILE ? 78 : 146);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, heightAt(pos.getX(i), pos.getY(i)));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFog: { value: new THREE.Color('#06070b') }, uBeacon: { value: BEACON }, uReveal: { value: 0 } }),
    []
  );
  useFrame((s) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = s.clock.elapsedTime;
    mat.current.uniforms.uReveal.value = (s.clock.elapsedTime * 6) % 60;
  });
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, TERRAIN_Y, TERRAIN_Z]}>
      <shaderMaterial ref={mat} vertexShader={terrainVert} fragmentShader={terrainFrag} uniforms={uniforms} />
    </mesh>
  );
}

/* ---------- stars ---------- */
function Stars({ count = 1800 }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3), s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const th = hash(i, 1) * Math.PI * 2, ph = hash(i, 2) * 0.5 * Math.PI;
      const r = 80;
      p[i * 3] = Math.cos(th) * Math.cos(ph) * r;
      p[i * 3 + 1] = Math.sin(ph) * r * 0.6 + 4;
      p[i * 3 + 2] = Math.sin(th) * Math.cos(ph) * r - 30;
      s[i] = hash(i, 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(s, 1));
    return g;
  }, [count]);
  useFrame((st) => mat.current && (mat.current.uniforms.uTime.value = st.clock.elapsedTime));
  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`attribute float aSeed; uniform float uTime; varying float vA;
          void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0);
          vA = 0.35 + 0.65*abs(sin(uTime*(0.4+aSeed*1.6)+aSeed*40.0));
          gl_PointSize = (1.0 + aSeed*2.2) * (60.0/-mv.z); gl_Position = projectionMatrix*mv; }`}
        fragmentShader={`varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard;
          gl_FragColor=vec4(vec3(0.85,0.9,1.0), vA*smoothstep(0.5,0.0,d)); }`}
      />
    </points>
  );
}

/* ---------- drifting snow (animated on the GPU) ---------- */
function Snow({ count = 700 }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3), sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (hash(i, 7) - 0.5) * 30;
      p[i * 3 + 1] = hash(i, 8) * 14;
      p[i * 3 + 2] = -hash(i, 9) * 40 + 4;
      sd[i] = hash(i, 4);
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 1));
    return g;
  }, [count]);
  useFrame((st) => mat.current && (mat.current.uniforms.uTime.value = st.clock.elapsedTime));
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`attribute float aSeed; uniform float uTime;
          void main(){
            vec3 p = position;
            float fall = uTime * (0.25 + aSeed * 0.4);
            p.y = mod(p.y - fall, 14.0) - 2.0;
            p.x += sin(p.y * 0.8 + aSeed * 40.0) * 0.12;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 2.6 * (8.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={`void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
          gl_FragColor = vec4(0.87, 0.91, 1.0, 0.5 * smoothstep(0.5, 0.0, d)); }`}
      />
    </points>
  );
}

/* ---------- moon + beacon ---------- */
function Moon() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grd.addColorStop(0, 'rgba(250,252,255,1)');
    grd.addColorStop(0.13, 'rgba(236,242,255,1)');
    grd.addColorStop(0.145, 'rgba(170,195,255,0.35)');
    grd.addColorStop(0.35, 'rgba(120,150,255,0.08)');
    grd.addColorStop(1, 'rgba(120,150,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={[-18, 15, -60]} scale={[22, 22, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  );
}

function Beacon() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ring.current) return;
    const t = (s.clock.elapsedTime * 0.5) % 1;
    ring.current.scale.setScalar(0.4 + t * 3.5);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.6;
  });
  return (
    <group position={[BEACON.x, BEACON.y, BEACON.z]}>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#ffd08a" toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial color="#ffb454" transparent opacity={0.5} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#ffb454" intensity={6} distance={8} />
    </group>
  );
}

/* ---------- real horizon: photos of Thandiani & Mukshpuri, displaced into relief ---------- */
const rangeVert = /* glsl */ `
  uniform sampler2D uA; uniform sampler2D uB; uniform float uMix; uniform vec2 uCoverA; uniform vec2 uCoverB;
  varying vec2 vUv; varying float vLum;
  vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }
  void main() {
    vUv = uv;
    vec3 a = texture2D(uA, cover(uv, uCoverA)).rgb;
    vec3 b = texture2D(uB, cover(uv, uCoverB)).rgb;
    float lum = dot(mix(a, b, uMix), vec3(0.299, 0.587, 0.114));
    vLum = lum;
    vec3 p = position;
    // bright snow and ridgelines come forward, dark valleys fall back: a 2.5D relief from the real photo
    p.z += lum * 7.0 * smoothstep(0.05, 0.45, uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const rangeFrag = /* glsl */ `
  uniform sampler2D uA; uniform sampler2D uB; uniform float uMix; uniform vec2 uCoverA; uniform vec2 uCoverB;
  uniform vec3 uFog; uniform float uFade; uniform float uTime;
  varying vec2 vUv; varying float vLum;
  vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }
  void main() {
    vec2 drift = vec2(uTime * 0.0015, 0.0);
    vec3 a = texture2D(uA, cover(vUv + drift, uCoverA)).rgb;
    vec3 b = texture2D(uB, cover(vUv + drift, uCoverB)).rgb;
    vec3 c = mix(a, b, uMix);
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    // moonlit grade: cool shadows, snow keeps its glow, sky sinks toward night
    vec3 night = mix(vec3(lum) * vec3(0.42, 0.52, 0.72), c * vec3(0.55, 0.62, 0.78), 0.35);
    night += vec3(0.49, 0.95, 0.84) * smoothstep(0.72, 0.95, lum) * 0.06;
    float sky = smoothstep(0.55, 0.95, vUv.y);
    night = mix(night, night * 0.35, sky);
    // fade into fog at the base and edges so the procedural terrain owns the foreground
    float edge = smoothstep(0.0, 0.12, vUv.x) * (1.0 - smoothstep(0.88, 1.0, vUv.x));
    float base = smoothstep(0.02, 0.32, vUv.y);
    float k = edge * base * uFade;
    gl_FragColor = vec4(night, k * mix(0.9, 0.5, sky));
  }
`;

function coverScale(tex: THREE.Texture, planeAspect: number) {
  const img = tex.image as { width: number; height: number };
  const a = img.width / img.height;
  return a > planeAspect ? new THREE.Vector2(planeAspect / a, 1) : new THREE.Vector2(1, a / planeAspect);
}

function PhotoRange({ urls }: { urls: [string, string] }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const W = 190, H = 95;
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H, MOBILE ? 64 : 128, MOBILE ? 32 : 64), []);
  const uniforms = useMemo(
    () => ({
      uA: { value: null as THREE.Texture | null }, uB: { value: null as THREE.Texture | null },
      uCoverA: { value: new THREE.Vector2(1, 1) }, uCoverB: { value: new THREE.Vector2(1, 1) },
      uMix: { value: 0 }, uFade: { value: 0 }, uTime: { value: 0 }, uFog: { value: new THREE.Color('#06070b') },
    }),
    []
  );
  const ready = useRef(false);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let alive = true;
    Promise.all(urls.map((u) => loader.loadAsync(u))).then(([a, b]) => {
      if (!alive) return;
      for (const t of [a, b]) { t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; }
      uniforms.uA.value = a; uniforms.uB.value = b;
      uniforms.uCoverA.value = coverScale(a, W / H); uniforms.uCoverB.value = coverScale(b, W / H);
      ready.current = true;
    }).catch(() => {});
    return () => { alive = false; };
  }, [urls, uniforms]);
  useFrame((s, dt) => {
    if (!mat.current || !ready.current) return;
    const u = mat.current.uniforms;
    if (u.uA.value !== uniforms.uA.value) {
      // the material may hold its own copy of the uniforms: push the loaded photos onto it
      u.uA.value = uniforms.uA.value; u.uB.value = uniforms.uB.value;
      u.uCoverA.value = uniforms.uCoverA.value; u.uCoverB.value = uniforms.uCoverB.value;
    }
    u.uTime.value = s.clock.elapsedTime;
    u.uFade.value = Math.min(1, u.uFade.value + dt * 0.5);
    const target = THREE.MathUtils.smoothstep(scrollState.progress, 0.3, 0.7);
    u.uMix.value += (target - u.uMix.value) * Math.min(1, dt * 2);
  });
  return (
    <mesh geometry={geo} position={[0, 17, -78]} renderOrder={-1}>
      <shaderMaterial ref={mat} vertexShader={rangeVert} fragmentShader={rangeFrag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}

/* ---------- camera rig: scroll flies the camera through the valley ---------- */
function Rig() {
  const { camera, pointer } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const p = scrollState.progress; // 0..1 over the page
    const z = 8 - p * 26;
    const y = 1.6 + Math.sin(p * Math.PI) * 2.2 + p * 1.2;
    const x = Math.sin(p * Math.PI * 2) * 2.2;
    const k = 1 - Math.exp(-dt * 3);
    camera.position.x += (x + pointer.x * 0.6 - camera.position.x) * k;
    camera.position.y += (y + pointer.y * 0.3 - camera.position.y) * k;
    camera.position.z += (z - camera.position.z) * k;
    look.set(x * 0.4 + pointer.x * 0.8, 1.4 + p * 0.6, z - 14);
    camera.lookAt(look);
  });
  return null;
}

function Visibility() {
  const { gl, setFrameloop } = useThree() as unknown as { gl: THREE.WebGLRenderer; setFrameloop: (m: 'always' | 'never' | 'demand') => void };
  useEffect(() => {
    const on = () => setFrameloop(document.hidden ? 'never' : MOBILE ? 'demand' : 'always');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [gl, setFrameloop]);
  return null;
}

/** On phones the landscape renders at 30 fps so scrolling and pinned sections keep the rest of each frame. */
function Throttle({ fps }: { fps: number }) {
  const invalidate = useThree((st) => st.invalidate);
  useEffect(() => {
    let raf = 0, last = 0;
    const step = (t: number) => {
      if (t - last >= 1000 / fps - 2) { last = t; invalidate(); }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);
  return null;
}

function SceneReady() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => window.dispatchEvent(new Event('scene-ready')));
  });
  return null;
}

export default function MountainScene() {
  const urls = useMemo(
    () => (MOBILE ? horizon.mobile : horizon.desktop) as [string, string],
    []
  );
  return (
    <Canvas
      dpr={MOBILE ? 1 : [1, 1.5]}
      frameloop={MOBILE ? 'demand' : 'always'}
      camera={{ fov: 50, near: 0.1, far: 200, position: [0, 1.6, 8] }}
      gl={{ antialias: !MOBILE, powerPreference: 'high-performance', alpha: false, stencil: false }}
      onCreated={({ gl }) => gl.setClearColor('#06070b')}
      aria-hidden
    >
      <fog attach="fog" args={['#06070b', 20, 90]} />
      <PhotoRange urls={urls} />
      <Stars count={MOBILE ? 800 : 1600} />
      <Moon />
      <Terrain />
      <Beacon />
      <Snow count={MOBILE ? 350 : 700} />
      <Rig />
      <Visibility />
      <SceneReady />
      {MOBILE && <Throttle fps={30} />}
    </Canvas>
  );
}
