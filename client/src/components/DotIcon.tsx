interface DotIconProps {
  type: string;
}

interface DotPosition {
  left: number;
  top: number;
  size: number;
}

const DotIcon = ({ type }: DotIconProps) => {
  let dotPositions: DotPosition[] = [];
  
  // Create different dot patterns based on platform type
  switch(type) {
    case "twitch":
      // Twitch logo dots - square pattern
      for (let i = 0; i < 15; i++) {
        dotPositions.push({
          left: 15 + (i % 5) * 5,
          top: 15 + Math.floor(i / 5) * 5,
          size: 2
        });
      }
      break;
      
    case "tiktok":
      // TikTok logo dots - note pattern
      for (let i = 0; i < 12; i++) {
        dotPositions.push({
          left: 15 + (i % 4) * 5,
          top: 15 + Math.floor(i / 4) * 5,
          size: 2
        });
      }
      break;
      
    case "youtube":
      // YouTube logo dots - video player shape
      for (let i = 0; i < 14; i++) {
        dotPositions.push({
          left: 10 + (i % 5) * 5,
          top: 10 + Math.floor(i / 5) * 8,
          size: 2
        });
      }
      // Center play button
      dotPositions.push({ left: 22, top: 22, size: 3 });
      break;
      
    case "x":
      // X logo dots - diagonal cross
      for (let i = 0; i < 10; i++) {
        if (i < 5) {
          dotPositions.push({
            left: 10 + i * 5,
            top: 10 + i * 5,
            size: 2
          });
        } else {
          dotPositions.push({
            left: 10 + (i-5) * 5,
            top: 30 - (i-5) * 5,
            size: 2
          });
        }
      }
      break;
      
    case "instagram":
      // Instagram logo dots - circle + dot
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 15;
        dotPositions.push({
          left: 24 + Math.cos(angle) * radius,
          top: 24 + Math.sin(angle) * radius,
          size: 2
        });
      }
      // Center dot
      dotPositions.push({
        left: 24,
        top: 24,
        size: 2
      });
      break;
      
    case "kofi":
      // Ko-Fi logo dots - coffee cup shape
      for (let i = 0; i < 12; i++) {
        dotPositions.push({
          left: 10 + (i % 4) * 7,
          top: 10 + Math.floor(i / 4) * 7,
          size: 2
        });
      }
      break;
      
    case "kick":
      // Kick logo dots - k shape
      for (let i = 0; i < 10; i++) {
        dotPositions.push({
          left: 10 + (i % 5) * 6,
          top: 15 + Math.floor(i / 5) * 10,
          size: 2
        });
      }
      break;
  }
  
  return (
    <div className="relative w-full h-full">
      {dotPositions.map((dot, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            left: `${dot.left}px`,
            top: `${dot.top}px`
          }}
        />
      ))}
    </div>
  );
};

export default DotIcon;
