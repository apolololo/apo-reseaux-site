import { useState, useEffect, useRef, useCallback } from "react";
import { useMousePosition } from "@/lib/useMousePosition";

const CustomCursor = () => {
  const { x, y, isActive } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  // Optimisation: Utiliser des event listeners optimisés
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"], [data-platform]')) {
      setIsHovering(true);
    }
  }, []);
  
  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
  }, []);
  
  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);
  
  useEffect(() => {
    // Event listeners optimisés avec passive
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
  
  // Optimisation: Mise à jour directe du style sans re-render
  useEffect(() => {
    if (!isActive || !cursorRef.current || !dotRef.current) return;
    
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    
    // Mise à jour directe du style pour de meilleures performances
    cursor.style.transform = `translate(${x - 12}px, ${y - 12}px) scale(${isHovering ? (isClicking ? 1.2 : 1.5) : 1})`;
    dot.style.transform = `translate(${x - 2}px, ${y - 2}px) scale(${isClicking ? 1.5 : 1})`;
    
    // Changement de couleur simple
    if (isHovering) {
      cursor.style.borderColor = isClicking ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)';
      dot.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    } else {
      cursor.style.borderColor = 'rgba(255, 255, 255, 0.6)';
      dot.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
  }, [x, y, isActive, isHovering, isClicking]);
  
  if (!isActive) return null;
  
  return (
    <>
      {/* Curseur principal - cercle externe */}
      <div 
        ref={cursorRef}
        className="fixed w-6 h-6 border border-white/60 rounded-full pointer-events-none z-[9999] transition-all duration-150 ease-out"
        style={{
          transform: `translate(${x - 12}px, ${y - 12}px)`,
          willChange: 'transform'
        }}
      />
      
      {/* Point central */}
      <div 
        ref={dotRef}
        className="fixed w-1 h-1 bg-white/80 rounded-full pointer-events-none z-[9999] transition-all duration-100 ease-out"
        style={{
          transform: `translate(${x - 2}px, ${y - 2}px)`,
          willChange: 'transform'
        }}
      />
    </>
  );
};

export default CustomCursor;
