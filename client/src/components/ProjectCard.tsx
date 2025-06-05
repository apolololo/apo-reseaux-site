import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  videoSrc: string;
  projectUrl?: string;
}

const ProjectCard = ({ title, description, videoSrc, projectUrl }: ProjectCardProps) => {
  const handleClick = () => {
    if (projectUrl) {
      window.open(projectUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl"
    >
      <div 
        onClick={handleClick} 
        className={projectUrl ? "cursor-pointer" : ""}
      >
        <h3 className="text-2xl font-bold mb-2 text-white/90 hover:text-white/100 transition-colors">{title}</h3>
        <p className="text-white/70 mb-4 hover:text-white/80 transition-colors">{description}</p>
      </div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
        <video
          src={videoSrc}
          className="w-full h-full object-contain"
          controls
          loop
          muted
          autoPlay
          playsInline
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;