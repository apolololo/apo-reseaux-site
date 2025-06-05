import DotCanvas from "@/components/DotCanvas";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import CustomCursor from "@/components/CustomCursor";
import DotTicTacToe from "../components/DotTicTacToe";
import MusicPlayer from "@/components/MusicPlayer";
import ProjectsSection from "@/components/ProjectsSection";
import CreationsSection from "@/components/CreationsSection";
import { useEffect } from "react";
import { motion } from "framer-motion";

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
      
      {/* Séparateur visuel entre les sections */}
      <motion.div 
        className="section-divider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </motion.div>
      
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <CreationsSection />
      </motion.div>
      
      <DotTicTacToe />
      <MusicPlayer />
    </div>
  );
}