import { 
  SiTwitch, 
  SiYoutube, 
  SiTiktok, 
  SiX,
  SiInstagram, 
  SiKofi, 
  SiKickstarter 
} from "react-icons/si";

interface Platform {
  name: string;
  url: string;
  icon: React.ComponentType;
  color: string;
  rgbColor: string;
}

const SocialGrid = () => {
  const platforms: Platform[] = [
    {
      name: "Twitch",
      url: "https://www.twitch.tv/tryh_apo",
      icon: SiTwitch,
      color: "#9146FF",
      rgbColor: "145,70,255"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@apo_ban",
      icon: SiTiktok,
      color: "#00F2EA",
      rgbColor: "0,242,234"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@tryhapo",
      icon: SiYoutube,
      color: "#FF0000",
      rgbColor: "255,0,0"
    },
    {
      name: "X",
      url: "https://x.com/apoftn1",
      icon: SiX,
      color: "#FFFFFF",
      rgbColor: "255,255,255"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/tryh_apo",
      icon: SiInstagram,
      color: "#E4405F",
      rgbColor: "228,64,95"
    },
    {
      name: "Ko-Fi",
      url: "https://ko-fi.com/apo__",
      icon: SiKofi,
      color: "#FF5E5B",
      rgbColor: "255,94,91"
    },
    {
      name: "Kick",
      url: "https://kick.com/tryh-apo",
      icon: SiKickstarter,
      color: "#53FC18",
      rgbColor: "83,252,24"
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto grid grid-cols-7 gap-6 md:gap-8 justify-center">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        
        return (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            data-platform={platform.name.toLowerCase()}
          >
            <div className="flex items-center justify-center">
              <div className="relative text-white text-3xl sm:text-4xl transform transition-all duration-300 hover:scale-125 hover:filter animate-float" 
                   style={{
                     animationDuration: `${3 + (platforms.indexOf(platform) % 5) * 0.5}s`,
                     filter: 'brightness(1)',
                     textShadow: '0 0 5px rgba(255,255,255,0.3)'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.filter = `drop-shadow(0 0 8px rgba(${platform.rgbColor},0.6))`;
                     e.currentTarget.style.color = platform.color;
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.filter = 'brightness(1)';
                     e.currentTarget.style.color = 'white';
                   }}
                 >
                <Icon />
                <div className="absolute inset-0 opacity-0 hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default SocialGrid;
