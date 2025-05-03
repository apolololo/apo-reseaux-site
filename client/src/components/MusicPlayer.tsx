import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GITHUB_MUSIC_URL = 'https://raw.githubusercontent.com/apolololo/apolinks_music/main/music';

export default function MusicPlayer() {
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [tracks, setTracks] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number>();
  
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
  
  // Smooth volume fade-in effect et démarrage automatique de la musique
  useEffect(() => {
    const startVolumeFade = () => {
      let currentVolume = 0;
      clearInterval(fadeIntervalRef.current);
      
      fadeIntervalRef.current = window.setInterval(() => {
        currentVolume += 0.01;
        if (currentVolume >= 0.5) {
          currentVolume = 0.5;
          clearInterval(fadeIntervalRef.current);
        }
        setVolume(currentVolume);
      }, 50); // Update every 50ms for smooth transition
    };
    
    if (tracks.length > 0 && audioRef.current) {
      // Forcer la lecture automatique avec plusieurs tentatives
      const attemptAutoplay = () => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              console.log("Autoplay successful");
              startVolumeFade();
            })
            .catch(error => {
              console.warn("Autoplay attempt failed:", error);
              // Réessayer après un court délai
              setTimeout(attemptAutoplay, 1000);
            });
        }
      };
      
      attemptAutoplay();
      startVolumeFade(); // Démarrer le fade-in du volume de toute façon
    }
    
    return () => {
      clearInterval(fadeIntervalRef.current);
    };
  }, [tracks]);
  
  // Mise à jour du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Effet pour démarrer la lecture après une interaction utilisateur
  useEffect(() => {
    const attemptPlayOnUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
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
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5"
      >
        <audio
          ref={audioRef}
          src={tracks[currentTrack]}
          autoPlay={true}
          loop={false}
          onEnded={handleTrackEnd}
          onCanPlay={() => {
            // Essayer de démarrer la lecture dès que possible
            if (audioRef.current) {
              audioRef.current.play().catch(err => console.warn("Autoplay prevented:", err));
            }
          }}
        />
        
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
          className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
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