// Predefined skeleton structures
// Each array represents a skeleton with points positioned relative to the skeleton's center

interface SkeletonPoint {
  x: number;
  y: number;
}

// Humanoid skeleton
const humanoid: SkeletonPoint[] = [
  // Head
  { x: 0, y: -50 },
  { x: -10, y: -45 },
  { x: 10, y: -45 },
  { x: -5, y: -40 },
  { x: 5, y: -40 },
  
  // Body
  { x: 0, y: -30 },
  { x: 0, y: -15 },
  { x: 0, y: 0 },
  { x: 0, y: 15 },
  
  // Arms
  { x: -15, y: -20 },
  { x: -25, y: -10 },
  { x: -30, y: 0 },
  { x: 15, y: -20 },
  { x: 25, y: -10 },
  { x: 30, y: 0 },
  
  // Legs
  { x: -10, y: 30 },
  { x: -15, y: 45 },
  { x: -18, y: 60 },
  { x: 10, y: 30 },
  { x: 15, y: 45 },
  { x: 18, y: 60 }
];

// Spider-like skeleton
const spider: SkeletonPoint[] = [
  // Center body
  { x: 0, y: 0 },
  { x: -5, y: -5 },
  { x: 5, y: -5 },
  { x: -5, y: 5 },
  { x: 5, y: 5 },
  
  // Legs
  { x: -20, y: -20 },
  { x: -30, y: -30 },
  { x: -40, y: -40 },
  
  { x: 20, y: -20 },
  { x: 30, y: -30 },
  { x: 40, y: -40 },
  
  { x: -20, y: 20 },
  { x: -30, y: 30 },
  { x: -40, y: 40 },
  
  { x: 20, y: 20 },
  { x: 30, y: 30 },
  { x: 40, y: 40 }
];

// Ghostly skeleton
const ghost: SkeletonPoint[] = [
  // Head
  { x: 0, y: -30 },
  { x: -10, y: -25 },
  { x: 10, y: -25 },
  { x: -5, y: -20 },
  { x: 5, y: -20 },
  
  // Body
  { x: 0, y: -10 },
  { x: 0, y: 0 },
  { x: 0, y: 10 },
  
  // Wispy bottom
  { x: -15, y: 20 },
  { x: -10, y: 30 },
  { x: -5, y: 40 },
  { x: 0, y: 50 },
  { x: 5, y: 40 },
  { x: 10, y: 30 },
  { x: 15, y: 20 },
  
  // Arms
  { x: -20, y: -5 },
  { x: -25, y: 5 },
  { x: -30, y: 15 },
  { x: 20, y: -5 },
  { x: 25, y: 5 },
  { x: 30, y: 15 }
];

export const skeletons: SkeletonPoint[][] = [humanoid, spider, ghost];
