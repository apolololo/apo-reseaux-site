import { useState, useEffect, useRef } from "react";
import { useMousePosition } from "@/lib/useMousePosition";
import { motion, AnimatePresence } from "framer-motion";

interface CursorTrail {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color?: string;
  rotation?: number;
}

const CustomCursor = () => {
  const { x, y, isActive } = useMousePosition();
  const [trails, setTrails] = useState<CursorTrail[]>([]);
  const lastPositionRef = useRef({ x, y });
  const velocityRef = useRef({ x: 0, y: 0 });
  const trailIdRef = useRef(0);
  const trailTimerRef = useRef<number | null>(null);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isClicking, setIsClicking] = useState(false);
  const [interactionType, setInteractionType] = useState<string | null>(null);
  
  // Effect for hover detection with data attributes for interaction types
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      setCursorVariant("hover");
      
      // Get data attribute for interaction type
      const target = e.target as HTMLElement;
      const platformType = target.closest("[data-platform]")?.getAttribute("data-platform");
      if (platformType) {
        setInteractionType(platformType);
      }
    };
    
    const handleMouseOut = () => {
      setCursorVariant("default");
      setInteractionType(null);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Delegate event listeners
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  // Simplified effect for cursor trail with improved performance
  useEffect(() => {
    if (!isActive) return;
    
    const dx = x - lastPositionRef.current.x;
    const dy = y - lastPositionRef.current.y;
    
    // Update velocity (pixels per frame)
    velocityRef.current = { x: dx, y: dy };
    
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    // Generate trails with more constraints for better performance
    const createTrail = () => {
      // Only create trails if moving fast enough and limit creation when FPS might be low
      if (speed > 8 && trails.length < 15) {
        // Simplified trail creation - even smaller and fewer
        const baseSize = isClicking ? 3 : 1.5;
        
        // Simplified color - only white with basic interaction indication
        let color = "rgba(255, 255, 255, 0.4)";  // Reduced opacity from 0.6 to 0.4
        if (interactionType && isClicking) {
          color = "rgba(255, 255, 255, 0.6)";    // Reduced opacity from 0.8 to 0.6
        }
        
        // Reduced trail count
        const trailCount = isClicking ? 2 : 1;
        
        for (let i = 0; i < trailCount; i++) {
          if (i > 0 && Math.random() > 0.5) continue; // 50% chance to skip additional trails
          
          const newTrail: CursorTrail = { 
            id: trailIdRef.current++, 
            x, 
            y, 
            size: baseSize,
            delay: 0, // No delay for better performance
            color
          };
          
          setTrails(prev => [...prev, newTrail]);
          
          // Shorter trail duration
          setTimeout(() => {
            setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
          }, 400);
        }
        
        // More aggressive trail limiting
        if (trails.length > 10) {
          setTrails(prev => prev.slice(prev.length - 10));
        }
      }
      
      lastPositionRef.current = { x, y };
      
      // Less frequent trail creation
      const nextTrailDelay = 60; // Fixed delay for better performance
      trailTimerRef.current = window.setTimeout(createTrail, nextTrailDelay);
    };
    
    if (trailTimerRef.current) {
      clearTimeout(trailTimerRef.current);
    }
    createTrail();
    
    return () => {
      if (trailTimerRef.current) {
        clearTimeout(trailTimerRef.current);
      }
    };
  }, [x, y, isActive, isClicking, interactionType, trails.length]);
  
  // Cursor variants with clicking state
  const variants = {
    default: {
      width: 12,  // Reduced from 16
      height: 12, // Reduced from 16
      borderWidth: "1.5px", // Thinner border
      backgroundColor: "rgba(255, 255, 255, 0)",
      x: -6, // Adjusted for new size
      y: -6, // Adjusted for new size
      borderColor: "rgba(255, 255, 255, 0.7)"
    },
    hover: {
      width: isClicking ? 22 : 28, // Reduced from 40 when not clicking
      height: isClicking ? 22 : 28, // Reduced from 40 when not clicking
      borderWidth: "2px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      x: isClicking ? -11 : -14, // Adjusted for new size
      y: isClicking ? -11 : -14, // Adjusted for new size
      borderColor: interactionType ? getInteractionColor() : "rgba(255, 255, 255, 0.7)"
    }
  };
  
  const dotVariants = {
    default: {
      width: 4, // Reduced from 6
      height: 4, // Reduced from 6
      opacity: 0.9,
      x: -2, // Adjusted for new size
      y: -2, // Adjusted for new size
      backgroundColor: "rgba(255, 255, 255, 0.9)"
    },
    hover: {
      width: isClicking ? 10 : 6, // Reduced from 8 when not clicking
      height: isClicking ? 10 : 6, // Reduced from 8 when not clicking
      opacity: 1,
      x: isClicking ? -5 : -3, // Adjusted for new size
      y: isClicking ? -5 : -3, // Adjusted for new size
      backgroundColor: interactionType ? getInteractionColor(true) : "rgba(255, 255, 255, 1)"
    }
  };
  
  // Get color based on interaction type
  function getInteractionColor(intense = false): string {
    if (!interactionType) return "rgba(255, 255, 255, 0.7)";
    
    const opacity = intense ? 1 : 0.7;
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
  }
  
  if (!isActive) return null;
  
  return (
    <>
      {/* Main cursor outer ring */}
      <motion.div 
        className="fixed rounded-full border pointer-events-none z-[9999]"
        style={{ 
          left: x, 
          top: y,
          boxShadow: isClicking ? `0 0 10px ${getInteractionColor(true)}` : "none"
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          mass: 0.4
        }}
      />
      
      {/* Main cursor dot */}
      <motion.div 
        className="fixed rounded-full pointer-events-none z-[9999]"
        style={{ 
          left: x, 
          top: y
        }}
        variants={dotVariants}
        animate={cursorVariant}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 25,
          mass: 0.3
        }}
      />
      
      {/* Simplified cursor trails */}
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
              backgroundColor: trail.color || "rgba(255, 255, 255, 0.4)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}  // Reduced from 0.6 to match reduced opacity in trail creation
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
