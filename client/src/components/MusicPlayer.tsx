import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GITHUB_MUSIC_URL = 'https://raw.githubusercontent.com/apolololo/apolinks_music/main/music';

export default function MusicPlayer() {
  // Initialiser le volume à 0.5 (50%) directement
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [tracks, setTracks] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);
  
  // Fetch music files from GitHub
  useEffect(() => {
    fetch('https://api.github.com/repos/apolololo/apolinks_music/contents/music')
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          return;
        }
        
        const musicFiles = data
          .filter((file) => file && typeof file === 'object' && file.type === 'file')
          .map((file) => `${GITHUB_MUSIC_URL}/${file.name}`);
        
        // Shuffle the tracks
        const shuffledTracks = [...musicFiles].sort(() => Math.random() - 0.5);
        setTracks(shuffledTracks);
      })
      .catch(error => console.error('Error fetching music files:', error));
  }, []);
  
  // Démarrage automatique de la musique quand les pistes sont chargées
  useEffect(() => {
    if (tracks.length > 0 && audioRef.current && !hasStartedRef.current) {
      // Définir le volume initial à 50%
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
      }
      
      // Technique spéciale pour contourner les restrictions de lecture automatique
      // En créant un contexte audio et en le connectant à l'élément audio
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          // Créer un contexte audio qui peut aider à débloquer la lecture automatique
          const audioContext = new AudioContext();
          
          // Créer un nœud source à partir de l'élément audio
          if (audioRef.current) {
            const source = audioContext.createMediaElementSource(audioRef.current);
            // Connecter la source à la destination (haut-parleurs)
            source.connect(audioContext.destination);
            
            // Reprendre le contexte audio (nécessaire pour certains navigateurs)
            if (audioContext.state === 'suspended') {
              audioContext.resume();
            }
          }
        }
      } catch (e) {
        console.warn("AudioContext not supported:", e);
      }
      
      // Fonction pour tenter de démarrer la lecture
      const attemptAutoplay = () => {
        if (audioRef.current) {
          // Essayer de démarrer la lecture avec différentes méthodes
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Autoplay successful");
                hasStartedRef.current = true;
              })
              .catch(error => {
                console.warn("Autoplay attempt failed:", error);
                // Réessayer après un court délai
                setTimeout(attemptAutoplay, 500);
              });
          }
        }
      };
      
      // Essayer de démarrer la lecture immédiatement
      attemptAutoplay();
    }
  }, [tracks]);
  
  // Mise à jour du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Effet pour démarrer la lecture après une interaction utilisateur
  // Mais seulement si la lecture n'a pas encore démarré
  useEffect(() => {
    const attemptPlayOnUserInteraction = () => {
      if (audioRef.current && !hasStartedRef.current) {
        audioRef.current.play()
          .then(() => {
            hasStartedRef.current = true;
            setHasInteracted(true);
          })
          .catch(error => {
            console.warn("Playback failed after interaction:", error);
          });
      }
    };
    
    // Ajouter des écouteurs d'événements pour les interactions utilisateur
    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
    interactionEvents.forEach(event => {
      document.addEventListener(event, attemptPlayOnUserInteraction, { once: true });
    });
    
    return () => {
      interactionEvents.forEach(event => {
        document.removeEventListener(event, attemptPlayOnUserInteraction);
      });
    };
  }, []);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const skipTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    // Forcer la lecture lors du changement de piste
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };
  
  const handleTrackEnd = () => {
    skipTrack();
  };
  
  if (tracks.length === 0) return null;
  
  return (
    <div className="fixed bottom-8 left-8 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
      >
        <audio
          ref={audioRef}
          src={tracks[currentTrack]}
          autoPlay={true}
          preload="auto"
          loop={false}
          muted={false}
          onLoadedMetadata={() => {
            // Définir le volume à 50% dès que les métadonnées sont chargées
            if (audioRef.current) {
              audioRef.current.volume = 0.5;
            }
          }}
          onEnded={handleTrackEnd}
          onCanPlay={() => {
            // Essayer de démarrer la lecture dès que possible
            if (audioRef.current && !hasStartedRef.current) {
              audioRef.current.volume = 0.5; // Définir le volume à 50% immédiatement
              audioRef.current.play()
                .then(() => {
                  hasStartedRef.current = true;
                })
                .catch(err => console.warn("Autoplay prevented:", err));
            }
          }}
        />
        
        <div className="flex items-center justify-center w-8 h-8">
          <Music className="h-4 w-4 text-white/90" />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white/80 h-8 w-8"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white/80 h-8 w-8"
          onClick={skipTrack}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}