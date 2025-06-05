import { motion } from "framer-motion";
import FloatingBubble from "./FloatingBubble";

const CreationsSection = () => {
  return (
    <motion.section 
      className="min-h-screen w-full py-20 px-4 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 text-white/90 text-glow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Mes Créations
        </motion.h2>
        
        <div className="flex flex-wrap justify-center gap-16">
          <FloatingBubble
            title="Testeur de Manette"
            description="Une application web interactive permettant de tester la sensibilité des joysticks et les boutons de votre manette de jeu. Parfait pour vérifier si votre contrôleur fonctionne correctement."
            videoSrc="/video-manette.mp4"
          />
          
          {/* Emplacement pour d'autres créations à l'avenir */}
        </div>
      </div>
    </motion.section>
  );
};

export default CreationsSection;