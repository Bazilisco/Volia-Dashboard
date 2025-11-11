import { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    let animationFrame: number;
    let time = 0;
    let lastFrameTime = 0;
    const fps = 30; // Limit to 30fps for better performance
    const frameDelay = 1000 / fps;

    // Single thin wave configuration - minimal and elegant
    const wave = {
      amplitude: 40,
      frequency: 0.0015,
      phase: 0,
      yOffset: canvas.height * 0.4,
    };

    const animate = (currentTime: number = 0) => {
      // Throttle animation to target FPS
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameDelay) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameDelay);

      // Absolute black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the single elegant glow wave
      ctx.beginPath();
      
      // Calculate wave points with smooth curve - reduced points for performance
      const points: Array<{ x: number; y: number }> = [];
      const numPoints = 50; // Reduced from 100
      
      for (let i = 0; i <= numPoints; i++) {
        const x = (canvas.width / numPoints) * i;
        const baseY = wave.yOffset + 
          Math.sin(x * wave.frequency + time * 0.3) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.5 + time * 0.2) * (wave.amplitude * 0.5);
        
        points.push({ x, y: baseY });
      }

      // Create smooth path
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      // Complete the path
      const lastPoint = points[points.length - 1];
      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        lastPoint.x,
        lastPoint.y
      );
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      // Create thin glow gradient with dark purple (#6B3EFF)
      const glowGradient = ctx.createLinearGradient(0, wave.yOffset - 80, 0, wave.yOffset + 80);
      glowGradient.addColorStop(0, 'rgba(107, 62, 255, 0.0)');
      glowGradient.addColorStop(0.3, 'rgba(107, 62, 255, 0.08)');
      glowGradient.addColorStop(0.5, 'rgba(107, 62, 255, 0.12)');
      glowGradient.addColorStop(0.7, 'rgba(107, 62, 255, 0.08)');
      glowGradient.addColorStop(1, 'rgba(107, 62, 255, 0.0)');

      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Add thin glow effect on top
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(107, 62, 255, 0.2)';
      ctx.strokeStyle = 'rgba(107, 62, 255, 0.3)';
      ctx.lineWidth = 1.5;
      
      // Redraw the top curve with glow
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        lastPoint.x,
        lastPoint.y
      );
      
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;

      // Subtle time increment for slow, graceful movement
      time += 0.008;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
      wave.yOffset = canvas.height * 0.4;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        background: '#000000'
      }}
    />
  );
};
