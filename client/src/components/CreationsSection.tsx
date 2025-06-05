import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CreationsSection = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <div ref={sectionRef} className="w-full min-h-screen flex items-center justify-center bg-black/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-4xl mx-auto px-4 w-full py-32"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wider text-glow">
          Mes Créations
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.005 }}
          className="mb-32"
        >
          <Card className="bg-black/70 border-white/20 hover:border-white/40 transition-colors duration-200 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Testeur de Manette</CardTitle>
              <CardDescription className="text-white/80">
                Un outil interactif pour tester les boutons et la sensibilité des joysticks de votre manette de jeu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl border border-white/10">
                {isVideoVisible ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src="/video-manette.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/video-manette-poster.jpg"
                    preload="metadata"
                  />
                ) : (
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: 'url(/video-manette-poster.jpg)' }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreationsSection; 