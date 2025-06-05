import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CreationsSection = () => {
  return (
    <div className="w-full py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4"
      >
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Testeur de Manette</CardTitle>
            <CardDescription className="text-white/70">
              Un outil interactif pour tester les boutons et la sensibilité des joysticks de votre manette de jeu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <video
                className="w-full h-full object-cover"
                src="/video-manette.mp4"
                controls
                poster="/video-manette-poster.jpg"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreationsSection; 