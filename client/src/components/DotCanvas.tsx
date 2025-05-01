import { useRef, useEffect } from "react";

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
}

interface GameObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const DotCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const gameObjectsRef = useRef<GameObject[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);
  const lastClickTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  
  // Limites anti-spam
  const maxParticles = useRef(500); // Nombre maximum de particules explosives
  const lastBurstTimeRef = useRef(0); // Horodatage du dernier burst
  const burstThrottleRef = useRef(50); // Délai minimum entre bursts (ms)
  const burstCountRef = useRef(0); // Nombre de bursts récents
  const burstResetTimerRef = useRef<number | null>(null); // Timer pour réinitialiser le compteur de bursts
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize particles on resize to distribute them properly
      initializeParticles();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Add slight acceleration to particles near the cursor for smoother movement
      if (particlesRef.current) {
        particlesRef.current.forEach(particle => {
          const dx = e.clientX - particle.x;
          const dy = e.clientY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            // Enlarge particles slightly when cursor is near for more reactive feel
            particle.size = particle.baseSize * (1 + (0.5 * (1 - distance / 200)));
          } else {
            particle.size = particle.baseSize;
          }
        });
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      isPressedRef.current = true;
      lastClickTimeRef.current = Date.now();
      
      // Set some particles to target the click position
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      particlesRef.current.forEach((particle, index) => {
        if (Math.random() < 0.15) { // Only affect 15% of particles
          particle.targetX = clickX + (Math.random() - 0.5) * 100;
          particle.targetY = clickY + (Math.random() - 0.5) * 100;
          particle.isTargeting = true;
        }
      });
    };
    
    const handleMouseUp = () => {
      isPressedRef.current = false;
      
      // Release particles from targeting
      particlesRef.current.forEach(particle => {
        particle.isTargeting = false;
        particle.targetX = undefined;
        particle.targetY = undefined;
      });
    };
    
    const createBurst = (x: number, y: number) => {
      // Anti-spam : vérifier les limites
      const now = Date.now();
      
      // 1. Vérifier le nombre total de particules
      if (gameObjectsRef.current.length > maxParticles.current) {
        // Si trop de particules, supprimer les plus anciennes pour faire de la place
        const toRemove = Math.min(50, gameObjectsRef.current.length - maxParticles.current + 50);
        gameObjectsRef.current.splice(0, toRemove);
      }
      
      // 2. Limiter la fréquence des explosions
      if (now - lastBurstTimeRef.current < burstThrottleRef.current) {
        return; // Ignorer ce burst si trop rapproché du précédent
      }
      
      // 3. Adapter la densité en fonction du nombre d'explosions récentes
      burstCountRef.current++;
      lastBurstTimeRef.current = now;
      
      // Réinitialiser le compteur après un délai
      if (burstResetTimerRef.current !== null) {
        clearTimeout(burstResetTimerRef.current);
      }
      
      burstResetTimerRef.current = window.setTimeout(() => {
        burstCountRef.current = 0;
      }, 2000);
      
      // Réduire le nombre de particules si l'utilisateur spam-click
      const particleReductionFactor = Math.max(0.2, 1 - (burstCountRef.current / 20));
      
      // Styles de feux d'artifice variés
      const styles = [
        // Explosion classique en étoile
        () => {
          const hue = Math.random() * 360; // Couleur aléatoire sur tout le spectre
          const baseParticleCount = 25 + Math.floor(Math.random() * 10);
          // Adapter le nombre de particules en fonction du facteur de réduction
          const particleCount = Math.ceil(baseParticleCount * particleReductionFactor);
          
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            const size = 2 + Math.random() * 4;
            
            gameObjectsRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size,
              color: `hsla(${hue + Math.random() * 30 - 15}, 100%, 75%, 1)`,
              life: 80 + Math.random() * 40,
              maxLife: 80 + Math.random() * 40
            });
          }
        },
        
        // Explosion en spirale
        () => {
          const hue = Math.random() * 360;
          const baseParticleCount = 30;
          // Adapter le nombre de particules en fonction du facteur de réduction
          const particleCount = Math.ceil(baseParticleCount * particleReductionFactor);
          const spiralTightness = 0.3 + Math.random() * 0.4;
          
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 1 + (i / particleCount) * 5;
            const size = 1.5 + Math.random() * 3;
            
            gameObjectsRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size,
              color: `hsla(${hue + (i * 12) % 60}, 100%, ${60 + (i % 3) * 15}%, 1)`,
              life: 100 + Math.random() * 30,
              maxLife: 100 + Math.random() * 30
            });
          }
        },
        
        // Explosion en cercles concentriques
        () => {
          const hue = Math.random() * 360;
          // Réduire le nombre de cercles en cas de spam
          const baseCircleCount = 3 + Math.floor(Math.random() * 2);
          const circleCount = burstCountRef.current > 10 ? 
            Math.min(baseCircleCount, 2) : baseCircleCount;
          
          for (let c = 0; c < circleCount; c++) {
            const radius = 3 + c * 2;
            const particleCount = 15 + c * 5;
            
            for (let i = 0; i < particleCount; i++) {
              const angle = (i / particleCount) * Math.PI * 2;
              const speed = 0.8 + radius * 0.4;
              const size = 1.5 + Math.random() * 2.5;
              
              gameObjectsRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                color: `hsla(${hue + c * 25}, 100%, ${70 + c * 5}%, 1)`,
                life: 80 + Math.random() * 40,
                maxLife: 80 + Math.random() * 40
              });
            }
          }
        },
        
        // Explosion avec traînées
        () => {
          const hue = Math.random() * 360;
          const baseParticleCount = 18;
          // Adapter le nombre de particules en fonction du facteur de réduction
          const particleCount = Math.ceil(baseParticleCount * particleReductionFactor);
          // Réduire aussi le nombre de particules de traînée en cas de spam
          const trailCount = burstCountRef.current > 15 ? 0 : burstCountRef.current > 8 ? 1 : 2;
          
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 3 + Math.random() * 3;
            const size = 2 + Math.random() * 3;
            
            // Particule principale
            gameObjectsRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size,
              color: `hsla(${hue + Math.random() * 40}, 100%, 75%, 1)`,
              life: 100 + Math.random() * 50,
              maxLife: 100 + Math.random() * 50
            });
            
            // Particules de traînée (petites)
            for (let j = 0; j < trailCount; j++) {
              gameObjectsRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed * 0.6,
                vy: Math.sin(angle) * speed * 0.6,
                size: size * 0.5,
                color: `hsla(${hue + 40}, 90%, 80%, 1)`,
                life: 50 + Math.random() * 30,
                maxLife: 50 + Math.random() * 30
              });
            }
          }
        }
      ];
      
      // Choisir un style aléatoire de feu d'artifice
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      randomStyle();
      
      // Ajouter quelques particules brillantes pour l'effet initial d'explosion
      // Réduire le nombre de particules initiales en cas de spam
      const initialParticleCount = burstCountRef.current > 10 ? 4 : 10;
      for (let i = 0; i < initialParticleCount; i++) {
        gameObjectsRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: 3 + Math.random() * 5,
          color: 'hsla(60, 100%, 90%, 1)',
          life: 20 + Math.random() * 15,
          maxLife: 20 + Math.random() * 15
        });
      }
    };
    
    const initializeParticles = () => {
      particlesRef.current = [];
      // Reduced particle count for better performance
      const particleCount = Math.min(Math.max(Math.floor((canvas.width * canvas.height) / 25000), 40), 80);
      const colors = ["#ffffff", "#dddddd"];
      
      for (let i = 0; i < particleCount; i++) {
        const baseSize = Math.random() * 1.5 + 0.5;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseSize,
          size: baseSize,
          speedX: (Math.random() - 0.5) * 0.2, // Slower movement
          speedY: (Math.random() - 0.5) * 0.2, // Slower movement
          opacity: Math.random() * 0.4 + 0.1, // More subtle
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    resizeCanvas();
    initializeParticles();
    
    let animationId: number;
    const maxFps = 60; // Target FPS
    const frameInterval = 1000 / maxFps;
    
    const animate = (timestamp: number) => {
      // Calculate FPS for optimization
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }
      
      const deltaTime = timestamp - lastFrameTimeRef.current;
      
      if (deltaTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      frameCountRef.current++;
      if (timestamp - lastFrameTimeRef.current >= 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFrameTimeRef.current = timestamp;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw game objects first (they go below particles)
      gameObjectsRef.current.forEach((obj, index) => {
        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.vy += 0.05; // Gravity
        obj.life -= 1.5;
        
        if (obj.life <= 0) {
          gameObjectsRef.current.splice(index, 1);
          return;
        }
        
        const alpha = obj.life / obj.maxLife;
        
        // Effet de brillance pour les particules de feu d'artifice
        // Ajouter un halo lumineux
        const glow = 1.5 + alpha * 2; // Plus lumineux au début
        
        // Créer un dégradé radial pour l'effet de brillance
        const gradient = ctx.createRadialGradient(
          obj.x, obj.y, 0,
          obj.x, obj.y, obj.size * glow
        );
        
        // Couleur au centre (plus brillante)
        const baseColor = obj.color.replace("1)", `${alpha})`);
        const centerColor = obj.color.replace("hsla", "hsla").replace("100%", "100%").replace("75%", "90%").replace("1)", `${alpha * 0.9})`);
        
        gradient.addColorStop(0, centerColor);
        gradient.addColorStop(0.4, baseColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // Dessiner le halo
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size * glow, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Dessiner le centre de la particule
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();
      });
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Apply targeting behavior
        if (particle.isTargeting && particle.targetX !== undefined && particle.targetY !== undefined) {
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            particle.speedX = Math.cos(angle) * 0.8;
            particle.speedY = Math.sin(angle) * 0.8;
          } else {
            // Reached target, stop targeting
            particle.isTargeting = false;
            particle.targetX = undefined;
            particle.targetY = undefined;
          }
        }
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Slow down particles over time (damping)
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;
        
        // Boundary check with smoother wrapping
        if (particle.x < -10) particle.x = canvas.width + 10;
        else if (particle.x > canvas.width + 10) particle.x = -10;
        
        if (particle.y < -10) particle.y = canvas.height + 10;
        else if (particle.y > canvas.height + 10) particle.y = -10;
        
        // Mouse interaction - more fluid response
        const dx = mousePositionRef.current.x - particle.x;
        const dy = mousePositionRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const angle = Math.atan2(dy, dx);
          // Stronger repulsion force when mouse is pressed
          const force = (200 - distance) / (isPressedRef.current ? 1000 : 2000);
          
          // Apply smooth acceleration
          particle.speedX -= Math.cos(angle) * force;
          particle.speedY -= Math.sin(angle) * force;
        }
        
        // Draw particle with slight glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Add glow effect for larger particles
        if (particle.size > 1.5) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color.replace("1)", `${particle.opacity})`));
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(
            particle.x - particle.size * 3,
            particle.y - particle.size * 3,
            particle.size * 6,
            particle.size * 6
          );
        }
        
        ctx.fillStyle = particle.color.replace("1)", `${particle.opacity})`);
        ctx.fill();
      });
      
      // Only draw connections once every 2 frames for performance
      if (frameCountRef.current % 2 === 0) {
        // Connect particles for a web effect - optimized to reduce connections
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 0.3;
        
        // Further limit connections by only connecting a subset of particles
        // Using spatial optimization with larger cells and fewer connections
        const gridSize = 150; // Larger grid size = fewer cell checks
        const grid: { [key: string]: Particle[] } = {};
        
        // Place particles in grid cells
        particlesRef.current.forEach(p => {
          const cellX = Math.floor(p.x / gridSize);
          const cellY = Math.floor(p.y / gridSize);
          const cellKey = `${cellX},${cellY}`;
          
          if (!grid[cellKey]) {
            grid[cellKey] = [];
          }
          
          grid[cellKey].push(p);
        });
        
        // Connect particles - only checking immediate neighbors to reduce calculations
        for (const cellKey in grid) {
          const [cellX, cellY] = cellKey.split(',').map(Number);
          
          // Only check immediate adjacent cells (no diagonals)
          const neighbors = [
            [cellX, cellY],      // Same cell
            [cellX + 1, cellY],  // Right
            [cellX, cellY + 1]   // Bottom
          ];
          
          for (const [nx, ny] of neighbors) {
            const neighborKey = `${nx},${ny}`;
            const neighborCell = grid[neighborKey];
            
            if (!neighborCell) continue;
            
            // Connect particles with optimized approach
            for (const p1 of grid[cellKey]) {
              // Only check every 3rd particle to reduce calculations
              for (let i = 0; i < neighborCell.length; i += 3) {
                const p2 = neighborCell[i];
                if (p1 === p2) continue;
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                // Use squared distance to avoid square root calculation
                const distSquared = dx * dx + dy * dy;
                
                // 100^2 = 10000
                if (distSquared < 8100) {
                  // Draw line with fixed opacity for better performance
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }
      
      // Nous avons supprimé l'affichage du score
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 bg-gradient-radial from-gray-900 to-black"
    />
  );
};

export default DotCanvas;
