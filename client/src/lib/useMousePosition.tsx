import { useState, useEffect } from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState<{ x: number, y: number }>({ 
    x: 0, 
    y: 0 
  });
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isActive) setIsActive(true);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isActive]);
  
  return { ...position, isActive };
};
