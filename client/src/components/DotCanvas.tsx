import { useState, useEffect, useRef } from "react";

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
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      if (isPressedRef.current) {
        particlesRef.current.forEach(particle => {
          const dx = e.clientX - particle.x;
          const dy = e.clientY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Strong attraction force when pressed
          const attractionForce = 0.15;
          particle.speedX += (dx / distance) * attractionForce;
          particle.speedY += (dy / distance) * attractionForce;
          
          particle.targetX = e.clientX;
          particle.targetY = e.clientY;
          particle.isTargeting = true;
        });
      } else {
        // Repulsion when not pressed
        particlesRef.current.forEach(particle => {
          const dx = e.clientX - particle.x;
          const dy = e.clientY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const repulsionForce = 0.5;
            particle.speedX -= (dx / distance) * repulsionForce;
            particle.speedY -= (dy / distance) * repulsionForce;
          }
        });
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      isPressedRef.current = true;
      
      particlesRef.current.forEach(particle => {
        particle.targetX = e.clientX;
        particle.targetY = e.clientY;
        particle.isTargeting = true;
      });
    };
    
    const handleMouseUp = () => {
      isPressedRef.current = false;
      
      particlesRef.current.forEach(particle => {
        particle.isTargeting = false;
        particle.targetX = undefined;
        particle.targetY = undefined;
        particle.size = particle.baseSize;
        
        // Set new random home position
        particle.homeX = Math.random() * canvas.width;
        particle.homeY = Math.random() * canvas.height;
        
        // Add very slight velocity towards new home
        const dx = particle.homeX - particle.x;
        const dy = particle.homeY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 0.02;
        
        particle.speedX = (dx / distance) * speed;
        particle.speedY = (dy / distance) * speed;
      });
    };
    
    const initializeParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.max(Math.floor((canvas.width * canvas.height) / 25000), 40), 80);
      const colors = ["#ffffff", "#dddddd"];
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const baseSize = Math.random() * 1.5 + 0.5;
        
        particlesRef.current.push({
          x,
          y,
          baseSize,
          size: baseSize,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.4 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          homeX: x,
          homeY: y
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
    const maxFps = 60;
    const frameInterval = 1000 / maxFps;
    
    const animate = (timestamp: number) => {
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
        frameCountRef.current = 0;
        lastFrameTimeRef.current = timestamp;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        if (particle.isTargeting && particle.targetX !== undefined && particle.targetY !== undefined) {
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            const angle = Math.atan2(dy, dx);
            const speed = isPressedRef.current ? 0.2 : 0.1;
            particle.speedX += Math.cos(angle) * speed;
            particle.speedY += Math.sin(angle) * speed;
          }
        } else {
          // Move towards home position when not targeting
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
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Strong damping when targeting to keep particles clustered
        if (particle.isTargeting) {
          particle.speedX *= 0.9;
          particle.speedY *= 0.9;
        } else {
          particle.speedX *= 0.99;
          particle.speedY *= 0.99;
        }
        
        // Boundary check with wrapping
        if (particle.x < -10) particle.x = canvas.width + 10;
        else if (particle.x > canvas.width + 10) particle.x = -10;
        
        if (particle.y < -10) particle.y = canvas.height + 10;
        else if (particle.y > canvas.height + 10) particle.y = -10;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
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
      
      // Connect nearby particles
      if (frameCountRef.current % 2 === 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 0.3;
        
        const gridSize = 150;
        const grid: { [key: string]: Particle[] } = {};
        
        particlesRef.current.forEach(p => {
          const cellX = Math.floor(p.x / gridSize);
          const cellY = Math.floor(p.y / gridSize);
          const cellKey = `${cellX},${cellY}`;
          
          if (!grid[cellKey]) {
            grid[cellKey] = [];
          }
          
          grid[cellKey].push(p);
        });
        
        for (const cellKey in grid) {
          const [cellX, cellY] = cellKey.split(',').map(Number);
          
          const neighbors = [
            [cellX, cellY],
            [cellX + 1, cellY],
            [cellX, cellY + 1]
          ];
          
          for (const [nx, ny] of neighbors) {
            const neighborKey = `${nx},${ny}`;
            const neighborCell = grid[neighborKey];
            
            if (!neighborCell) continue;
            
            for (const p1 of grid[cellKey]) {
              for (let i = 0; i < neighborCell.length; i += 3) {
                const p2 = neighborCell[i];
                if (p1 === p2) continue;
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSquared = dx * dx + dy * dy;
                
                if (distSquared < 8100) {
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