import DotCanvas from "@/components/DotCanvas";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import CustomCursor from "@/components/CustomCursor";
import DotTicTacToe from "../components/DotTicTacToe";
import MusicPlayer from "@/components/MusicPlayer";
import { useEffect } from "react";

export default function Home() {
  // Désactiver la sélection de texte pour une meilleure expérience interactive
  useEffect(() => {
    document.body.style.userSelect = 'none';
    
    return () => {
      document.body.style.userSelect = '';
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <CustomCursor />
      <DotCanvas />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <Header />
        <div className="mt-8">
          <SocialGrid />
        </div>
      </div>
      
      {/* Mini-jeu discret sur le côté */}
      <DotTicTacToe />
      
      {/* Lecteur de musique */}
      <MusicPlayer />
    </div>
  );
}