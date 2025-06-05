import DotCanvas from "@/components/DotCanvas";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import CustomCursor from "@/components/CustomCursor";
import DotTicTacToe from "../components/DotTicTacToe";
import MusicPlayer from "@/components/MusicPlayer";
import ProjectsSection from "@/components/ProjectsSection";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.userSelect = 'none';
    
    return () => {
      document.body.style.userSelect = '';
    }
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      <CustomCursor />
      <DotCanvas />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <Header />
        <div className="mt-8">
          <SocialGrid />
        </div>
      </div>
      
      <div className="relative z-10">
        <ProjectsSection />
      </div>
      
      <DotTicTacToe />
      <MusicPlayer />
    </div>
  );
}