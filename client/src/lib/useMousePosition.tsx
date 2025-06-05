import { useState, useEffect, useRef, useCallback } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState<{ x: number, y: number }>({ 
    x: 0, 
    y: 0 
  });
  const [isActive, setIsActive] = useState(false);
  const rafRef = useRef<number>();
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Throttle avec requestAnimationFrame pour de meilleures performances
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isActive) setIsActive(true);
    });
  }, [isActive]);
  
  useEffect(() => {
    // Event listener optimisé avec passive
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);
  
  return { ...position, isActive };
};
