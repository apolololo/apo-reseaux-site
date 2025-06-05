import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const DotCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Optimisation: Réduire drastiquement le nombre de particules
  const getParticleCount = useCallback(() => {
    const area = window.innerWidth * window.innerHeight;
    // Beaucoup moins de particules pour de meilleures performances
    return Math.min(Math.max(Math.floor(area / 50000), 15), 30);
  }, []);
  
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const count = getParticleCount();
    particlesRef.current = [];
    
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  }, [getParticleCount]);
  
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limiter à 30 FPS pour de meilleures performances
    if (currentTime - lastTimeRef.current < 33) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastTimeRef.current = currentTime;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les particules de manière optimisée
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    particlesRef.current.forEach(particle => {
      // Mise à jour de position simplifiée
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Rebond sur les bords
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.speedX *= -1;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.speedY *= -1;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }
      
      // Dessiner la particule (sans gradient pour optimiser)
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
    animationIdRef.current = requestAnimationFrame(animate);
  }, []);
  
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  }, [initializeParticles]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Configuration initiale
    handleResize();
    
    // Démarrer l'animation
    animationIdRef.current = requestAnimationFrame(animate);
    
    // Event listeners optimisés
    window.addEventListener("resize", handleResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate, handleResize]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"
      style={{ willChange: 'auto' }}
    />
  );
};

export default DotCanvas;