import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CreationsSection = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto px-4 w-full py-32"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wider text-glow">
          Mes Créations
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="mb-32"
        >
          <Card className="bg-black/60 backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Testeur de Manette</CardTitle>
              <CardDescription className="text-white/80">
                Un outil interactif pour tester les boutons et la sensibilité des joysticks de votre manette de jeu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl border border-white/10">
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
      </motion.div>
    </div>
  );
};

export default CreationsSection; 