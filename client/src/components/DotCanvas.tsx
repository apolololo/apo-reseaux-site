import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  targetX?: number;
  targetY?: number;
  isTargeting?: boolean;
  homeX: number;
  homeY: number;
}

const DotCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);
  const animationIdRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Optimisation intelligente : plus de particules mais gestion optimisée
  const getParticleCount = useCallback(() => {
    const area = window.innerWidth * window.innerHeight;
    return Math.min(Math.max(Math.floor(area / 20000), 50), 120); // Plus de particules pour la beauté
  }, []);
  
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const count = getParticleCount();
    particlesRef.current = [];
    const colors = ["#ffffff", "#dddddd", "#f0f0f0"];
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const baseSize = Math.random() * 1.5 + 0.5;
      
      particlesRef.current.push({
        x,
        y,
        baseSize,
        size: baseSize,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        homeX: x,
        homeY: y,
        isTargeting: false
      });
    }
  }, [getParticleCount]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    // Interaction avec les particules seulement si on clique
    if (isPressedRef.current) {
      particlesRef.current.forEach(particle => {
        const dx = e.clientX - particle.x;
        const dy = e.clientY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const attractionForce = 0.05;
          particle.speedX += (dx / distance) * attractionForce;
          particle.speedY += (dy / distance) * attractionForce;
          particle.targetX = e.clientX;
          particle.targetY = e.clientY;
          particle.isTargeting = true;
        }
      });
    }
  }, []);
  
  const handleMouseDown = useCallback(() => {
    isPressedRef.current = true;
  }, []);
  
  const handleMouseUp = useCallback(() => {
    isPressedRef.current = false;
    
    // Retour à la position d'origine
    particlesRef.current.forEach(particle => {
      particle.isTargeting = false;
      particle.targetX = undefined;
      particle.targetY = undefined;
    });
  }, []);
  
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Optimisation : 45 FPS au lieu de 60, mais plus fluide que 30
    if (currentTime - lastTimeRef.current < 22) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastTimeRef.current = currentTime;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les particules avec plus de beauté
    particlesRef.current.forEach(particle => {
      // Mouvement vers la cible ou retour à la maison
      if (particle.isTargeting && particle.targetX !== undefined && particle.targetY !== undefined) {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          const angle = Math.atan2(dy, dx);
          const speed = 0.05;
          particle.speedX += Math.cos(angle) * speed;
          particle.speedY += Math.sin(angle) * speed;
        }
      } else {
        // Retour lent vers la position d'origine
        const dx = particle.homeX - particle.x;
        const dy = particle.homeY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          const angle = Math.atan2(dy, dx);
          const speed = 0.01;
          particle.speedX += Math.cos(angle) * speed;
          particle.speedY += Math.sin(angle) * speed;
        }
      }
      
      // Mise à jour de position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Damping
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;
      
      // Rebond sur les bords
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.speedX *= -0.8;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.speedY *= -0.8;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }
      
      // Dessiner la particule avec un petit glow
      ctx.globalAlpha = particle.opacity;
      
      // Petit glow pour les particules plus grandes
      if (particle.size > 1) {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Particule principale
      ctx.fillStyle = particle.color;
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
    
    // Event listeners
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate, handleResize, handleMouseMove, handleMouseDown, handleMouseUp]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 bg-gradient-radial from-gray-900 to-black"
    />
  );
};

export default DotCanvas;