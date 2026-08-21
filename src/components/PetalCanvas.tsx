import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  flutter: number;
  flutterSpeed: number;
}

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const petalColors = [
      'rgba(244, 212, 217, 0.75)', // soft rose
      'rgba(223, 180, 97, 0.65)',   // gold dust
      'rgba(255, 235, 238, 0.8)',  // blush white
      'rgba(238, 192, 198, 0.7)',  // sakura pink
      'rgba(212, 175, 55, 0.55)',   // deep gold
    ];

    const petalCount = window.innerWidth < 768 ? 24 : 45;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 6,
        speedX: Math.random() * 1.2 - 0.6,
        speedY: Math.random() * 1.4 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: Math.random() * 0.5 + 0.4,
        flutter: Math.random() * Math.PI,
        flutterSpeed: Math.random() * 0.03 + 0.015,
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.sin(p.flutter), 1);

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      // Realistic curved petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, -p.size / 4, p.size, p.size / 2);
      ctx.bezierCurveTo(p.size, p.size, p.size / 2, p.size * 1.2, 0, p.size * 1.4);
      ctx.bezierCurveTo(-p.size / 2, p.size * 1.2, -p.size, p.size, -p.size, p.size / 2);
      ctx.bezierCurveTo(-p.size, -p.size / 4, -p.size / 2, -p.size / 2, 0, 0);

      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.x += p.speedX + Math.sin(p.flutter) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flutter += p.flutterSpeed;

        // Reset if petal exits the screen bottom or sides
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="petal-animation-canvas"
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      aria-hidden="true"
    />
  );
}
