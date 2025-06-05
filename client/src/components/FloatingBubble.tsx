import { motion } from "framer-motion";
import { useState } from "react";

interface FloatingBubbleProps {
  title: string;
  description: string;
  videoSrc: string;
}

const FloatingBubble = ({ title, description, videoSrc }: FloatingBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-4xl"
    >
      <motion.div
        className="relative glassmorphism rounded-3xl p-6 border border-white/20 bubble-glow overflow-hidden animate-float-bubble"
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Effet de brillance sur les bords */}
        <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>

        <motion.h3 
          className="text-3xl font-bold mb-3 text-white/90 text-glow"
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-white/70 mb-6"
          animate={isHovered ? { opacity: 0.9 } : { opacity: 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
        
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/30 border border-white/10">
          <video
            src={videoSrc}
            className="w-full h-full object-contain"
            controls
            loop
            muted
          />
        </div>

        {/* Particules flottantes à l'intérieur de la bulle */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/30"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingBubble;