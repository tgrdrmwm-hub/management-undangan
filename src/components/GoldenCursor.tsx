import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  type: 'spark' | 'petal' | 'dot';
  life: number;
  maxLife: number;
}

export default function GoldenCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const lastEmitPos = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device has a precise pointing device (mouse/trackpad, not touch-only)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const isFinePointer = mediaQuery.matches;
    setIsEnabled(isFinePointer);

    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check distance for emitting trailing fairy sparkles
      const dx = mousePos.current.x - lastEmitPos.current.x;
      const dy = mousePos.current.y - lastEmitPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 12) {
        // Emit 1-2 golden particles
        const count = Math.min(2, Math.floor(dist / 14));
        for (let i = 0; i < count; i++) {
          const typeChoice = Math.random();
          const pType: Particle['type'] = typeChoice > 0.6 ? 'petal' : typeChoice > 0.25 ? 'spark' : 'dot';
          const maxLife = 30 + Math.random() * 25;
          particles.current.push({
            x: mousePos.current.x + (Math.random() - 0.5) * 8,
            y: mousePos.current.y + (Math.random() - 0.5) * 8,
            size: pType === 'petal' ? 5 + Math.random() * 4 : pType === 'spark' ? 3 + Math.random() * 3 : 2 + Math.random() * 2,
            opacity: 0.8 + Math.random() * 0.2,
            vx: (Math.random() - 0.5) * 0.8 + dx * 0.05,
            vy: (Math.random() - 0.5) * 0.8 + dy * 0.05 + 0.3, // slight downward golden gravity
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            type: pType,
            life: 0,
            maxLife,
          });
        }
        lastEmitPos.current = { x: mousePos.current.x, y: mousePos.current.y };
      }

      // Check hover targets for interactive scaling
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer'
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };
    const handleMouseDown = () => {
      setIsClicking(true);
      // Burst sparkles on click
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
        const speed = 1.5 + Math.random() * 2.5;
        particles.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          size: 4 + Math.random() * 3,
          opacity: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          type: Math.random() > 0.5 ? 'spark' : 'petal',
          life: 0,
          maxLife: 40 + Math.random() * 20,
        });
      }
    };
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize canvas to full window
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation Loop for Smooth Trail and Canvas Particle System
    const animate = () => {
      // Lerp ring towards mouse
      const lerp = 0.18;
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * lerp;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * lerp;

      // Update Cursor Dot
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update Cursor Ring
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Render Trail Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Update & draw particles
          for (let i = particles.current.length - 1; i >= 0; i--) {
            const p = particles.current[i];
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.vx *= 0.96;
            p.vy *= 0.96;

            const progress = p.life / p.maxLife;
            const currentOpacity = (1 - progress) * p.opacity;

            if (p.life >= p.maxLife || currentOpacity <= 0) {
              particles.current.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, currentOpacity);

            if (p.type === 'spark') {
              // 4-point Golden Star Spark
              ctx.fillStyle = '#fce09c';
              ctx.shadowColor = '#dfb461';
              ctx.shadowBlur = 6;
              const s = p.size * (1 - progress * 0.4);
              ctx.beginPath();
              ctx.moveTo(0, -s * 1.6);
              ctx.quadraticCurveTo(0, 0, s * 1.6, 0);
              ctx.quadraticCurveTo(0, 0, 0, s * 1.6);
              ctx.quadraticCurveTo(0, 0, -s * 1.6, 0);
              ctx.quadraticCurveTo(0, 0, 0, -s * 1.6);
              ctx.fill();
            } else if (p.type === 'petal') {
              // Delicate floral petal shape
              ctx.fillStyle = '#dfb461';
              ctx.shadowColor = '#e6c575';
              ctx.shadowBlur = 4;
              const pw = p.size * 0.8;
              const ph = p.size * 1.4;
              ctx.beginPath();
              ctx.ellipse(0, 0, pw, ph, 0, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Soft gold light dot
              ctx.fillStyle = '#f7d67b';
              ctx.shadowColor = '#dfb461';
              ctx.shadowBlur = 5;
              ctx.beginPath();
              ctx.arc(0, 0, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  return (
    <div
      id="custom-golden-cursor"
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Sparkle and Petal Particle Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Outer Smooth Trailing Golden Ring / Halo */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-out flex items-center justify-center pointer-events-none will-change-transform ${
          isClicking
            ? 'w-12 h-12 border-[#dfb461] bg-[#dfb461]/25 shadow-[0_0_25px_rgba(223,180,97,0.8)] scale-90'
            : isHovered
            ? 'w-11 h-11 border-[#dfb461] bg-[#dfb461]/15 shadow-[0_0_20px_rgba(223,180,97,0.5)]'
            : 'w-7 h-7 border-[#dfb461]/50 bg-[#dfb461]/5 shadow-[0_0_12px_rgba(223,180,97,0.25)]'
        }`}
      >
        {/* Subtle inner rotating decorative diamond petals for luxury aura */}
        <div
          className={`w-3.5 h-3.5 border border-[#dfb461]/40 rotate-45 transition-transform duration-500 ${
            isHovered ? 'scale-125 rotate-90 border-[#fce09c]' : 'scale-75'
          }`}
        />
      </div>

      {/* Main Precise Cursor Sparkle Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center"
      >
        {/* Inner Golden Floral Star */}
        <div
          className={`relative flex items-center justify-center transition-all duration-150 ${
            isClicking
              ? 'scale-150'
              : isHovered
              ? 'scale-125'
              : 'scale-100'
          }`}
        >
          {/* Central Bright Golden Core */}
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#dfb461] via-[#fff3cc] to-[#dfb461] shadow-[0_0_10px_#dfb461]" />

          {/* 4 Tiny Floral/Glint Petals */}
          <span className="absolute w-1 h-3.5 bg-[#dfb461]/70 rounded-full blur-[0.3px]" />
          <span className="absolute w-3.5 h-1 bg-[#dfb461]/70 rounded-full blur-[0.3px]" />
        </div>
      </div>
    </div>
  );
}
