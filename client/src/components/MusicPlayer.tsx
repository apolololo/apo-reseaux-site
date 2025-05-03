import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GITHUB_MUSIC_URL = 'https://raw.githubusercontent.com/apolololo/apolinks_music/main/music';

export default function MusicPlayer() {
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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
  
  // Smooth volume fade-in effect
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
      // Tentative de lecture automatique avec gestion des erreurs
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // La lecture a démarré avec succès
            setIsPlaying(true);
            startVolumeFade();
          })
          .catch(error => {
            console.warn("Autoplay prevented by browser:", error);
            // Réinitialiser l'état de lecture
            setIsPlaying(false);
            // Nous gardons le fade-in du volume pour qu'il soit prêt quand l'utilisateur
            // décidera de lancer la lecture manuellement
            startVolumeFade();
          });
      }
    }
    
    return () => {
      clearInterval(fadeIntervalRef.current);
    };
  }, [tracks]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Effet pour démarrer la lecture après une interaction utilisateur
  useEffect(() => {
    const attemptPlayOnUserInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.warn("Playback failed:", error);
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
  }, [isPlaying]);
  
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
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.warn("Play failed:", error));
      }
    }
  };
  
  const skipTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
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
        className="flex items-center gap-4 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2"
      >
        <audio
          ref={audioRef}
          src={tracks[currentTrack]}
          autoPlay={true}
          muted={false} // Initialement non muet pour permettre la lecture avec son
          onEnded={handleTrackEnd}
          onCanPlay={() => {
            // Essayer de démarrer la lecture dès que possible
            if (audioRef.current && !isPlaying) {
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.warn("Autoplay prevented:", err));
            }
          }}
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white/80"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white/80"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
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
          className="text-white hover:text-white/80"
          onClick={skipTrack}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}