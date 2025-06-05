import DotCanvas from "@/components/DotCanvas";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import CustomCursor from "@/components/CustomCursor";
import MusicPlayer from "@/components/MusicPlayer";
import CreationsSection from "@/components/CreationsSection";
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
    <div className="relative w-full">
      {/* Fond avec les étoiles */}
      <div className="fixed inset-0 -z-10">
        <DotCanvas />
      </div>

      {/* Contenu principal */}
      <div className="relative">
        <CustomCursor />
        
        {/* Section principale avec les liens */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <Header />
          <div className="mt-8">
            <SocialGrid />
          </div>
        </div>
        
        {/* Section des créations */}
        <div className="relative bg-transparent">
          <CreationsSection />
        </div>
      </div>
      
      {/* Lecteur de musique */}
      <MusicPlayer />
    </div>
  );
}