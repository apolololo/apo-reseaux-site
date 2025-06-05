import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  videoSrc: string;
}

const ProjectCard = ({ title, description, videoSrc }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl"
    >
      <h3 className="text-2xl font-bold mb-2 text-white/90">{title}</h3>
      <p className="text-white/70 mb-4">{description}</p>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
        <video
          src={videoSrc}
          className="w-full h-full object-contain"
          controls
          loop
          muted
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;