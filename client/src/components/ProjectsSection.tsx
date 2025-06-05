import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

const ProjectsSection = () => {
  return (
    <motion.section 
      className="min-h-screen w-full py-20 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-white/90"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Mes Projets
        </motion.h2>
        
        <div className="flex flex-col items-center gap-12">
          <ProjectCard
            title="Controller Check"
            description="Une application web permettant de tester la sensibilité des joysticks et les boutons de votre manette de jeu."
            videoSrc="/video-manette.mp4"
            projectUrl="https://controllercheck.netlify.app"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectsSection;