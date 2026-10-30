import React, { useEffect, useRef, useState } from 'react';

export interface GlobeCapabilityNode {
  id: string;
  label: string;
  event: string;
  category: string;
  description: string;
  metric: string;
  lat: number;
  iconPaths: string[];
}

export const CANVASLY_GLOBE_NODES: GlobeCapabilityNode[] = [
  {
    id: 'canvas',
    label: 'Infinite Canvas',
    event: '60fps CRDT Multiplayer Sync',
    category: 'CORE WORKSPACE',
    description:
      'Real-time vector diagramming, cloud architecture stencils, and tangle-free orthogonal connectors for 500+ concurrent editors.',
    metric: '< 18ms global cursor latency',
    lat: 18,
    iconPaths: [
      'M3 3h7v7H3z',
      'M14 3h7v7h-7z',
      'M14 14h7v7h-7z',
      'M3 14h7v7H3z',
    ],
  },
  {
    id: 'magic-import',
    label: 'Magic Import™',
    event: 'Whiteboard → Vector in 1.4s',
    category: 'SPATIAL AI ENGINE',
    description:
      'Snap a photo of any meeting room whiteboard, hand sketch, or legacy PDF. AI extracts clean, editable nodes and smart connectors.',
    metric: '99.4% optical node accuracy',
    lat: -14,
    iconPaths: [
      'm15 4-1 1 4 4 1-1a2.83 2.83 0 1 0-4-4Z',
      'm13 6-8.5 8.5a2.12 2.12 0 0 0 3 3L16 9',
      'M19 14v5',
      'M16.5 16.5h5',
    ],
  },
  {
    id: 'curation',
    label: 'Smart Curation',
    event: 'Executive Board Curated (38m)',
    category: 'HUMAN-IN-THE-LOOP QA',
    description:
      'Complex enterprise imports are automatically routed to our priority Smart Curation fast-lane for pixel-perfect executive boards.',
    metric: '38 min avg Enterprise turnaround',
    lat: 26,
    iconPaths: [
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    ],
  },
  {
    id: 'integrations',
    label: 'Dev & Docs Sync',
    event: 'Jira, Linear & GitHub Linked',
    category: 'WORKFLOW ECOSYSTEM',
    description:
      'Two-way synchronization turns architecture blocks and workshop sticky notes into live engineering tickets, PRs, and RFCs.',
    metric: '40+ native enterprise integrations',
    lat: -20,
    iconPaths: [
      'M6 3v12',
      'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      'M18 9a9 9 0 0 1-9 9',
    ],
  },
  {
    id: 'sso-security',
    label: 'Enterprise SSO',
    event: 'SAML 2.0 & SCIM Provisioned',
    category: 'SECURITY & GOVERNANCE',
    description:
      'Centralized Okta & Azure AD identity, automated SCIM seat management, SOC 2 Type II compliance, and role-based board locks.',
    metric: '800+ Enterprise organizations',
    lat: 14,
    iconPaths: [
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      'm9 12 2 2 4-4',
    ],
  },
  {
    id: 'ai-ops',
    label: 'Autonomous Ops',
    event: 'Auto-Healed • 99.99% SLA',
    category: 'RELIABILITY & SUPPORT',
    description:
      'Backed by self-healing worker pools, n8n workflow automation, and instant tier-2 engineering escalation for zero-downtime collaboration.',
    metric: '99.99% global uptime SLA',
    lat: -10,
    iconPaths: [
      'M22 12h-4l-3 9L9 3l-3 9H2',
    ],
  },
];

interface InteractiveBusinessGlobeProps {
  activeNodeIndex: number;
  onSelectNode: (index: number) => void;
}

export const InteractiveBusinessGlobe: React.FC<InteractiveBusinessGlobeProps> = ({
  activeNodeIndex,
  onSelectNode,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs for mutable animation loop access
  const activeIdxRef = useRef<number>(activeNodeIndex);
  const hoveredIdxRef = useRef<number | null>(null);
  const onSelectNodeRef = useRef(onSelectNode);

  useEffect(() => {
    activeIdxRef.current = activeNodeIndex;
  }, [activeNodeIndex]);

  useEffect(() => {
    onSelectNodeRef.current = onSelectNode;
  }, [onSelectNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage || !('Path2D' in window)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TAU = Math.PI * 2;
    const NODE_COUNT = CANVASLY_GLOBE_NODES.length;
    const STEP = 4200; // ms per capability stop
    const TRAVEL = 1750; // ms arc packet travel time
    const CYCLE = STEP * NODE_COUNT;

    const unit = (lat: number, lon: number): [number, number, number] => [
      Math.cos(lat) * Math.sin(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.cos(lon),
    ];

    // Position each capability node evenly around the globe's longitude so each faces the viewer in turn
    const tools = CANVASLY_GLOBE_NODES.map((node, i) => ({
      ...node,
      paths: node.iconPaths.map((d) => new Path2D(d)),
      at: unit((node.lat * Math.PI) / 180, (-i * TAU) / NODE_COUNT),
      pulse: i === 0 ? 1 : 0,
      shown: i === 0 ? 1 : 0,
    }));

    // Great-circle lifted arcs connecting every consecutive capability around the globe (including wrap-around)
    const arcs = tools.map((tool, i) => {
      const nextTool = tools[(i + 1) % NODE_COUNT];
      const a = tool.at;
      const b = nextTool.at;
      const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const omega = Math.acos(dot);
      const points: [number, number, number][] = [];
      for (let s = 0; s <= 44; s++) {
        const t = s / 44;
        const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
        const s2 = Math.sin(t * omega) / Math.sin(omega);
        const lift = 1.04 + 0.28 * Math.sin(Math.PI * t);
        points.push([
          (a[0] * s1 + b[0] * s2) * lift,
          (a[1] * s1 + b[1] * s2) * lift,
          (a[2] * s1 + b[2] * s2) * lift,
        ]);
      }
      return points;
    });

    // Fibonacci lattice for evenly distributed 3D sphere surface dots
    const createSphereDots = (count: number) => {
      const out = new Float32Array(count * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (2 * (i + 0.5)) / count;
        const r = Math.sqrt(1 - y * y);
        out.set([Math.cos(i * golden) * r, y, Math.sin(i * golden) * r], i * 3);
      }
      return out;
    };

    // Graticule: 6 meridian circles + 5 latitude parallels
    const lines: [number, number, number][][] = [
      ...[0, 1, 2, 3, 4, 5].map((m) =>
        Array.from({ length: 73 }, (_, s) => unit((s / 72) * TAU, (m * Math.PI) / 6)),
      ),
      ...[-60, -30, 0, 30, 60].map((lat) =>
        Array.from({ length: 73 }, (_, s) => unit((lat * Math.PI) / 180, (s / 72) * TAU)),
      ),
    ];

    // Asterion-inspired luminous cyber-sky palette
    const palette = {
      accent: [127, 208, 255] as [number, number, number], // #7fd0ff
      accent2: [169, 180, 255] as [number, number, number], // #a9b4ff
      ink: [241, 247, 255] as [number, number, number], // #f1f7ff
      surface: [13, 23, 38] as [number, number, number], // #0d1726
      canvas: [7, 13, 23] as [number, number, number], // #070d17
      success: [143, 227, 184] as [number, number, number], // #8fe3b8
      lineStrong: [58, 86, 118] as [number, number, number], // #3a5676
    };

    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let wide = true;
    let tile = 44;
    let dots = createSphereDots(1100);
    let px = new Float32Array(1100);
    let py = new Float32Array(1100);
    let pz = new Float32Array(1100);

    let clock = 0;
    let last = performance.now();
    let frame = 0;
    let held = -1;

    // Interactive pointer & drag rotation state
    let yawAim = 0;
    let tiltAim = 0;
    let yawPointer = 0;
    let tiltPointer = 0;
    let userDragYaw = 0;
    let userDragTilt = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    let cosY = 1;
    let sinY = 0;
    let cosX = 1;
    let sinX = 0;
    let shade: { body: CanvasGradient; rim: CanvasGradient } | null = null;

    // Screen hitboxes for interactive hover & click on the 3D capability tiles
    const hitBoxes: { index: number; x: number; y: number; size: number; vis: number }[] = [];

    // Pre-rendered glow sprites per color
    const sprites = new Map<string, HTMLCanvasElement>();
    const getSprite = (c: [number, number, number]) => {
      const key = c.join(',');
      let s = sprites.get(key);
      if (!s) {
        s = document.createElement('canvas');
        s.width = 64;
        s.height = 64;
        const g2 = s.getContext('2d')!;
        const g = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, rgba(c, 1));
        g.addColorStop(1, rgba(c, 0));
        g2.fillStyle = g;
        g2.fillRect(0, 0, 64, 64);
        sprites.set(key, s);
      }
      return s;
    };

    const drawGlow = (x: number, y: number, radius: number, c: [number, number, number], a: number) => {
      if (a <= 0) return;
      const before = ctx.globalAlpha;
      ctx.globalAlpha = before * Math.min(1, a);
      ctx.drawImage(getSprite(c), x - radius, y - radius, radius * 2, radius * 2);
      ctx.globalAlpha = before;
    };

    const roundedRect = (x: number, y: number, width: number, height: number, r: number) => {
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, width, height, r);
      } else {
        ctx.rect(x, y, width, height);
      }
    };

    const at = { x: 0, y: 0, z: 0, k: 1, hidden: false };
    const tip = { x: 0, y: 0, z: 0, k: 1, hidden: false };

    const project = (
      x: number,
      y: number,
      z: number,
      out: { x: number; y: number; z: number; k: number; hidden: boolean },
    ) => {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const k = 4 / (4 - z2);
      out.x = cx + x1 * R * k;
      out.y = cy - y2 * R * k;
      out.z = z2;
      out.k = k;
      out.hidden = z2 < 0 && x1 * x1 + y2 * y2 < 1;
      return out;
    };

    const view = (x: number, y: number, z: number) =>
      project(x, y, z, { x: 0, y: 0, z: 0, k: 1, hidden: false });

    const getWorkflowState = (time: number) => {
      const t = ((time % CYCLE) + CYCLE) % CYCLE;
      const i = Math.floor(t / STEP);
      const within = t - i * STEP;
      return within > STEP - TRAVEL
        ? { from: i, to: (i + 1) % NODE_COUNT, p: (within - (STEP - TRAVEL)) / TRAVEL }
        : { node: i };
    };

    const tracePolyline = (points: [number, number, number][], upto = 1) => {
      let pen = false;
      const end = Math.round((points.length - 1) * upto);
      for (let i = 0; i <= end; i++) {
        const q = points[i];
        const p = project(q[0], q[1], q[2], at);
        if (p.hidden) {
          pen = false;
          continue;
        }
        if (pen) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
        pen = true;
      }
    };

    const strokePath3D = (
      points: [number, number, number][],
      alpha: number,
      color: [number, number, number],
      width = 1,
      upto = 1,
    ) => {
      ctx.beginPath();
      tracePolyline(points, upto);
      ctx.strokeStyle = rgba(color, alpha);
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.lineWidth = 1;
    };

    const drawOrbitRing = (front: boolean) => {
      ctx.beginPath();
      for (let i = 0; i < 120; i++) {
        const a = (i / 120) * TAU;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const p = project(c * 1.42, 0, s * 1.42, at);
        if (p.z >= 0 !== front) continue;
        const tickOuter = i % 10 === 0 ? 1.54 : 1.47;
        const q = project(c * tickOuter, 0, s * tickOuter, tip);
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
      }
      ctx.strokeStyle = rgba(palette.accent, front ? 0.44 : 0.16);
      ctx.stroke();
    };

    const setView = () => {
      const scrolled = Math.min(1, window.scrollY / Math.max(1, h)) * 1.25;
      const yaw = (clock * TAU) / CYCLE + yawPointer + userDragYaw + scrolled;
      const tilt = Math.max(-0.35, Math.min(0.85, 0.38 + tiltPointer + userDragTilt));
      cosY = Math.cos(yaw);
      sinY = Math.sin(yaw);
      cosX = Math.cos(tilt);
      sinX = Math.sin(tilt);
    };

    const resize = () => {
      const nw = stage.clientWidth;
      const nh = stage.clientHeight;
      const nd = Math.min(window.devicePixelRatio || 1, 2);
      if (!nw || !nh || (nw === w && nh === h && nd === dpr)) return;
      w = nw;
      h = nh;
      dpr = nd;
      wide = w > 1024;
      // Place globe on the right side of the hero stage on desktop, centered on mobile
      cx = w * (wide ? 0.73 : 0.5);
      cy = wide ? h * 0.48 : 210;
      R = wide ? Math.min(w * 0.155, h * 0.31) : Math.min(w * 0.28, 120);
      tile = wide ? Math.max(40, Math.min(50, R * 0.23)) : 32;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      dots = createSphereDots(wide ? 1150 : 520);
      px = new Float32Array(dots.length / 3);
      py = new Float32Array(px.length);
      pz = new Float32Array(px.length);
      shade = null;
      draw();
    };

    function draw() {
      if (!w || !h || !px) return;
      setView();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < px.length; i++) {
        project(dots[i * 3], dots[i * 3 + 1], dots[i * 3 + 2], at);
        px[i] = at.x;
        py[i] = at.y;
        pz[i] = at.z;
      }

      const drawDotLayer = (layers: [number, number, number, number][]) => {
        for (const [lo, hi, alpha, size] of layers) {
          ctx.beginPath();
          for (let i = 0; i < px.length; i++) {
            if (pz[i] >= lo && pz[i] < hi) {
              ctx.rect(px[i] - size / 2, py[i] - size / 2, size, size);
            }
          }
          ctx.fillStyle = rgba(palette.accent, alpha);
          ctx.fill();
        }
      };

      // Far half of orbit ring + back-hemisphere dots
      drawOrbitRing(false);
      drawDotLayer([[-1.1, 0, 0.13, 1.1]]);

      // Shaded 3D globe core body + luminous rim
      if (!shade) {
        const body = ctx.createRadialGradient(
          cx - R * 0.35,
          cy - R * 0.45,
          R * 0.05,
          cx,
          cy,
          R * 1.04,
        );
        body.addColorStop(0, rgba(palette.surface, 0.76));
        body.addColorStop(1, rgba(palette.canvas, 0.94));

        const rim = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.28);
        rim.addColorStop(0, rgba(palette.accent, 0));
        rim.addColorStop(0.42, rgba(palette.accent, 0.22));
        rim.addColorStop(1, rgba(palette.accent, 0));
        shade = { body, rim };
      }

      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.03, 0, TAU);
      ctx.fillStyle = shade.body;
      ctx.fill();

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = shade.rim;
      ctx.fillRect(cx - R * 1.32, cy - R * 1.32, R * 2.64, R * 2.64);
      ctx.globalCompositeOperation = 'source-over';

      // Graticule lines (equator brighter)
      ctx.beginPath();
      lines.forEach((line, i) => {
        if (i !== 8) tracePolyline(line);
      });
      ctx.strokeStyle = rgba(palette.accent, 0.14);
      ctx.stroke();
      strokePath3D(lines[8], 0.32, palette.accent, 1.15);

      // Front hemisphere Fibonacci dots
      drawDotLayer([
        [0, 0.5, 0.4, 1.35],
        [0.5, 1.1, 0.82, 1.9],
      ]);

      // North pole Canvasly emblem badge
      const pole = view(0, 1.03, 0);
      if (!pole.hidden) {
        const pSize = tile * 0.72 * pole.k;
        ctx.save();
        ctx.globalAlpha = 0.92;
        roundedRect(pole.x - pSize / 2, pole.y - pSize / 2, pSize, pSize, pSize * 0.28);
        ctx.fillStyle = rgba(palette.surface, 0.95);
        ctx.fill();
        ctx.strokeStyle = rgba(palette.accent, 0.65);
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.font = `700 ${Math.round(pSize * 0.38)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = rgba(palette.accent, 0.95);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('C//', pole.x, pole.y + 1);
        ctx.restore();
      }

      // Near half of orbit ring
      drawOrbitRing(true);

      // Great-circle workflow arcs between capabilities
      const now = getWorkflowState(clock);
      arcs.forEach((points, i) => {
        const live = now.from === i;
        const done = (now.node ?? now.from ?? 0) > i;
        strokePath3D(
          points,
          live ? 0.32 : done ? 0.5 : 0.16,
          palette.accent,
          done ? 1.5 : 1.1,
        );
        if (live && now.p !== undefined) {
          strokePath3D(points, 0.95, palette.accent, 2.1, now.p);
        }
      });

      // Project & depth-sort the 6 capability nodes standing on the globe surface
      hitBoxes.length = 0;
      const screens = new Map<typeof tools[0], { x: number; y: number; size: number; vis: number }>();
      const placed = tools
        .map((tool, index) => ({
          tool,
          index,
          base: view(tool.at[0], tool.at[1], tool.at[2]),
          top: view(tool.at[0] * 1.18, tool.at[1] * 1.18, tool.at[2] * 1.18),
        }))
        .sort((a, b) => a.top.z - b.top.z);

      for (const { tool, index, base, top } of placed) {
        const vis = Math.max(0, Math.min(1, (top.z + 0.08) / 0.38));
        if (!vis) continue;

        const isHovered = hoveredIdxRef.current === index;
        const isSelected = activeIdxRef.current === index;
        const scaleBoost = isHovered ? 1.14 : isSelected ? 1.06 : 1;
        const size = tile * top.k * scaleBoost;
        const x = top.x - size / 2;
        const y = top.y - size / 2;

        ctx.globalAlpha = vis;

        // Stem connecting sphere surface to elevated capability node
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(top.x, top.y + size / 2);
        ctx.strokeStyle = rgba(isSelected || isHovered ? palette.success : palette.accent, 0.55);
        ctx.lineWidth = isSelected || isHovered ? 1.6 : 1;
        ctx.stroke();
        ctx.lineWidth = 1;

        // Pulse ring when workflow packet arrives or user selects node
        const effectivePulse = Math.max(tool.pulse, isHovered ? 0.75 : 0);
        if (effectivePulse > 0) {
          const ringExpand = 10 * (1 - effectivePulse);
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(top.x, top.y, size * 1.65, palette.success, effectivePulse * 0.55);
          ctx.globalCompositeOperation = 'source-over';
          roundedRect(
            x - ringExpand,
            y - ringExpand,
            size + ringExpand * 2,
            size + ringExpand * 2,
            size * 0.32,
          );
          ctx.strokeStyle = rgba(palette.success, effectivePulse * 0.85);
          ctx.stroke();
        }

        // Elevated rounded tile
        const fill = ctx.createLinearGradient(0, y, 0, y + size);
        fill.addColorStop(0, rgba(palette.surface, 0.98));
        fill.addColorStop(1, rgba(palette.canvas, 0.98));
        roundedRect(x, y, size, size, size * 0.26);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = rgba(
          effectivePulse > 0.05 || isSelected ? palette.success : palette.accent,
          isSelected || isHovered ? 0.95 : 0.48 + effectivePulse * 0.5,
        );
        ctx.lineWidth = isSelected || isHovered ? 1.6 : 1.1;
        ctx.stroke();
        ctx.lineWidth = 1;

        // Crisp vector icon inside tile
        ctx.save();
        ctx.translate(top.x - size * 0.27, top.y - size * 0.27);
        ctx.scale((size * 0.54) / 24, (size * 0.54) / 24);
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = rgba(isSelected || isHovered ? palette.success : palette.ink, 0.95);
        for (const icon of tool.paths) {
          ctx.stroke(icon);
        }
        ctx.restore();

        // Capability uppercase mono label beneath tile
        ctx.font = `600 10px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = rgba(isSelected || isHovered ? palette.ink : palette.accent, 0.88);
        ctx.fillText(tool.label.toUpperCase(), top.x, top.y + size / 2 + 8);

        ctx.globalAlpha = 1;
        screens.set(tool, { x: top.x, y: top.y, size, vis });
        hitBoxes.push({ index, x: top.x, y: top.y, size, vis });
      }

      // Traveling workflow light packet with glowing comet trail along active arc
      if (now.to !== undefined && now.from !== undefined && now.p !== undefined) {
        const points = arcs[now.from];
        const head = now.p * (points.length - 1);
        ctx.globalCompositeOperation = 'lighter';
        for (let j = 10; j >= 0; j--) {
          const idx = head - j * 0.9;
          if (idx < 0) continue;
          const q = points[Math.floor(idx)];
          const p = project(q[0], q[1], q[2], tip);
          if (p.hidden) continue;
          drawGlow(
            p.x,
            p.y,
            j ? 4 + (10 - j) * 0.55 : 19,
            palette.accent,
            j ? ((10 - j) / 10) * 0.42 : 0.95,
          );
          if (!j) drawGlow(p.x, p.y, 5.5, palette.ink, 1);
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // Floating live status badge above the capability node currently receiving work (or hovered)
      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        const s = screens.get(tool);
        const isHovered = hoveredIdxRef.current === i;
        const showStrength = isHovered ? 1 : tool.shown;
        if (showStrength <= 0 || !s || s.vis < 0.55) continue;

        const alpha = Math.min(1, showStrength * 2.2);
        ctx.font = `500 12px "Inter", sans-serif`;
        const bw = ctx.measureText(tool.event).width + 36;
        const bh = 28;
        const bx = Math.min(w - bw - 12, Math.max(12, s.x - bw / 2));
        const by = s.y - s.size / 2 - bh - 12 - (1 - alpha) * 6;

        ctx.globalAlpha = alpha;
        roundedRect(bx, by, bw, bh, 8);
        ctx.fillStyle = rgba(palette.surface, 0.96);
        ctx.fill();
        ctx.strokeStyle = rgba(palette.lineStrong, 0.92);
        ctx.stroke();

        // Status indicator dot
        ctx.beginPath();
        ctx.arc(bx + 14, by + bh / 2, 3.4, 0, TAU);
        ctx.fillStyle = rgba(palette.success, 1);
        ctx.fill();

        ctx.fillStyle = rgba(palette.ink, 0.96);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(tool.event, bx + 24, by + bh / 2 + 0.5);
        ctx.globalAlpha = 1;
      }
    }

    const advance = (dt: number) => {
      if (!dragging && hoveredIdxRef.current === null) {
        clock += dt;
      }
      const ease = 1 - Math.pow(0.95, dt / (1000 / 60));
      yawPointer += (yawAim - yawPointer) * ease;
      tiltPointer += (tiltAim - tiltPointer) * ease;

      for (const tool of tools) {
        tool.pulse = Math.max(0, tool.pulse - dt / 1100);
        tool.shown = Math.max(0, tool.shown - dt / 3200);
      }

      const node = getWorkflowState(clock).node ?? -1;
      if (node >= 0 && node !== held) {
        tools[node].pulse = 1;
        tools[node].shown = 1;
        onSelectNodeRef.current(node);
      }
      held = node;
    };

    const loop = (time: number) => {
      const dt = Math.max(0, Math.min(time - last, 40));
      last = time;
      advance(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    // Pointer interaction: tilt/rotate with mouse, hover nodes, click nodes, or drag-spin the globe
    const handlePointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (dragging) {
        const dx = mx - dragStartX;
        const dy = my - dragStartY;
        userDragYaw += dx * 0.0055;
        userDragTilt = Math.max(-0.4, Math.min(0.4, userDragTilt + dy * 0.0035));
        dragStartX = mx;
        dragStartY = my;
        return;
      }

      yawAim = ((mx / rect.width) - 0.5) * 0.55;
      tiltAim = ((my / rect.height) - 0.5) * 0.24;

      // Check if cursor is hovering over any 3D capability node on the globe
      let foundHover: number | null = null;
      for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const b = hitBoxes[i];
        if (b.vis < 0.35) continue;
        const dist = Math.hypot(mx - b.x, my - b.y);
        if (dist <= b.size * 0.72) {
          foundHover = b.index;
          break;
        }
      }
      if (foundHover !== hoveredIdxRef.current) {
        hoveredIdxRef.current = foundHover;
        setHoveredNodeIndex(foundHover);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Check if clicking a node directly
      for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const b = hitBoxes[i];
        if (b.vis < 0.35) continue;
        if (Math.hypot(mx - b.x, my - b.y) <= b.size * 0.75) {
          tools[b.index].pulse = 1;
          tools[b.index].shown = 1;
          clock = b.index * STEP + 150;
          onSelectNodeRef.current(b.index);
          return;
        }
      }

      // Otherwise start drag-spinning the globe
      dragging = true;
      setIsDragging(true);
      dragStartX = mx;
      dragStartY = my;
    };

    const handlePointerUp = () => {
      dragging = false;
      setIsDragging(false);
    };

    const handlePointerLeave = () => {
      dragging = false;
      setIsDragging(false);
      yawAim = 0;
      tiltAim = 0;
      hoveredIdxRef.current = null;
      setHoveredNodeIndex(null);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    window.addEventListener('resize', resize);
    stage.addEventListener('pointermove', handlePointerMove);
    stage.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    stage.addEventListener('pointerleave', handlePointerLeave);

    resize();
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      stage.removeEventListener('pointermove', handlePointerMove);
      stage.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      stage.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 overflow-hidden select-none ${
        hoveredNodeIndex !== null
          ? 'cursor-pointer'
          : isDragging
          ? 'cursor-grabbing'
          : 'cursor-grab'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full transition-opacity duration-700"
        style={{
          WebkitMaskImage:
            'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 34%, rgba(0,0,0,1) 58%)',
          maskImage:
            'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 34%, rgba(0,0,0,1) 58%)',
        }}
      />
    </div>
  );
};
