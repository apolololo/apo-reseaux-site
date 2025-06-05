import { useState, useEffect, useRef, useCallback } from "react";
import { useMousePosition } from "@/lib/useMousePosition";
import { motion, AnimatePresence } from "framer-motion";

interface CursorTrail {
  id: number;
  x: number;
  y: number;
  size: number;
}

const CustomCursor = () => {
  const { x, y, isActive } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [interactionType, setInteractionType] = useState<string | null>(null);
  const [trails, setTrails] = useState<CursorTrail[]>([]);
  const trailIdRef = useRef(0);
  const lastPositionRef = useRef({ x, y });
  
  // Event listeners optimisés
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest('button, a, [role="button"], [data-platform]');
    if (interactive) {
      setIsHovering(true);
      const platformType = interactive.getAttribute("data-platform");
      if (platformType) {
        setInteractionType(platformType);
      }
    }
  }, []);
  
  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
    setInteractionType(null);
  }, []);
  
  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);
  
  useEffect(() => {
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseOver, handleMouseOut, handleMouseDown, handleMouseUp]);
  
  // Trails optimisés - seulement quand on bouge vite
  useEffect(() => {
    if (!isActive) return;
    
    const dx = x - lastPositionRef.current.x;
    const dy = y - lastPositionRef.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    // Créer des trails seulement si on bouge assez vite et qu'on a moins de 8 trails
    if (speed > 5 && trails.length < 8) {
      const newTrail: CursorTrail = {
        id: trailIdRef.current++,
        x,
        y,
        size: isClicking ? 4 : 2
      };
      
      setTrails(prev => [...prev, newTrail]);
      
      // Supprimer le trail après 300ms
      setTimeout(() => {
        setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 300);
    }
    
    lastPositionRef.current = { x, y };
  }, [x, y, isActive, isClicking, trails.length]);
  
  // Couleurs selon le type d'interaction
  const getInteractionColor = (intense = false) => {
    if (!interactionType) return "rgba(255, 255, 255, 0.8)";
    
    const opacity = intense ? 1 : 0.8;
    switch(interactionType) {
      case "twitch": return `rgba(145, 70, 255, ${opacity})`;
      case "youtube": return `rgba(255, 0, 0, ${opacity})`;
      case "tiktok": return `rgba(0, 242, 234, ${opacity})`;
      case "x": return `rgba(255, 255, 255, ${opacity})`;
      case "instagram": return `rgba(228, 64, 95, ${opacity})`;
      case "ko-fi": return `rgba(255, 94, 91, ${opacity})`;
      case "kick": return `rgba(83, 252, 24, ${opacity})`;
      default: return `rgba(255, 255, 255, ${opacity})`;
    }
  };
  
  if (!isActive) return null;
  
  return (
    <>
      {/* Curseur principal */}
      <motion.div 
        className="fixed rounded-full border pointer-events-none z-[9999]"
        style={{ 
          left: x, 
          top: y,
          borderColor: getInteractionColor(),
          boxShadow: isClicking ? `0 0 15px ${getInteractionColor(true)}` : "none"
        }}
        animate={{
          width: isHovering ? (isClicking ? 24 : 32) : 16,
          height: isHovering ? (isClicking ? 24 : 32) : 16,
          x: isHovering ? (isClicking ? -12 : -16) : -8,
          y: isHovering ? (isClicking ? -12 : -16) : -8,
          borderWidth: isHovering ? "2px" : "1.5px"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          mass: 0.4
        }}
      />
      
      {/* Point central */}
      <motion.div 
        className="fixed rounded-full pointer-events-none z-[9999]"
        style={{ 
          left: x, 
          top: y,
          backgroundColor: getInteractionColor(true)
        }}
        animate={{
          width: isClicking ? 8 : (isHovering ? 6 : 4),
          height: isClicking ? 8 : (isHovering ? 6 : 4),
          x: isClicking ? -4 : (isHovering ? -3 : -2),
          y: isClicking ? -4 : (isHovering ? -3 : -2)
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 25,
          mass: 0.3
        }}
      />
      
      {/* Trails optimisés */}
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            className="fixed rounded-full pointer-events-none z-[9998]"
            style={{ 
              left: trail.x,
              top: trail.y,
              width: trail.size,
              height: trail.size,
              x: -trail.size / 2,
              y: -trail.size / 2,
              backgroundColor: getInteractionColor()
            }}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0.3, scale: 0.5 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
