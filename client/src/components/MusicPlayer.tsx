import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GITHUB_MUSIC_URL = 'https://raw.githubusercontent.com/apolololo/apolinks_music/main/music';

export default function MusicPlayer() {
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number>();
  const playerRef = useRef<HTMLDivElement>(null);

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

  // Smooth volume fade-in effect (optimisé avec requestAnimationFrame)
  useEffect(() => {
    const startVolumeFade = () => {
      let currentVolume = 0;
      const targetVolume = 0.5;
      const fadeStep = 0.005; // Plus petit pas pour plus de fluidité
      
      if (fadeIntervalRef.current) {
        cancelAnimationFrame(fadeIntervalRef.current);
      }

      const fadeFrame = () => {
        currentVolume += fadeStep;
        if (currentVolume >= targetVolume) {
          currentVolume = targetVolume;
          setVolume(currentVolume);
          return;
        }
        setVolume(currentVolume);
        fadeIntervalRef.current = requestAnimationFrame(fadeFrame);
      };
      
      fadeIntervalRef.current = requestAnimationFrame(fadeFrame);
    };

    if (tracks.length > 0 && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          startVolumeFade();
        })
        .catch(error => {
          console.warn("Autoplay prevented by browser:", error);
          startVolumeFade();
        });
    }

    return () => {
      if (fadeIntervalRef.current) {
        cancelAnimationFrame(fadeIntervalRef.current);
      }
    };
  }, [tracks]);

  // Mise à jour du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Effet pour s'assurer que la musique continue de jouer (optimisé)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const audio = audioRef.current;
      
      const ensurePlaying = () => {
        if (audio.paused && !audio.ended) {
          audio.play().catch(console.error);
        }
      };

      // Vérifier moins fréquemment pour économiser les ressources
      const checkInterval = setInterval(ensurePlaying, 5000);
      
      const handlePause = () => {
        if (!audio.ended) {
          audio.play().catch(console.error);
        }
      };
      
      audio.addEventListener('pause', handlePause, { passive: true });

      return () => {
        clearInterval(checkInterval);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [isPlaying]);

  // Handle mouse enter/leave for the player (optimisé)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  // Fonction pour démarrer la lecture (sans possibilité de pause)
  const startPlayback = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.warn("Play failed:", error));
    }
  };

  const skipTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    // Forcer la lecture lors du changement de piste
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const handleTrackEnd = () => {
    skipTrack();
  };

  if (tracks.length === 0) return null;

  return (
    <div 
      className="fixed bottom-8 left-8 z-50" 
      ref={playerRef}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center"
      >
        <div 
          className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-lg rounded-full cursor-pointer border border-white/10 z-10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Music className="h-5 w-5 text-white/80" />
        </div>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: isExpanded ? "auto" : 0, 
            opacity: isExpanded ? 1 : 0,
            x: isExpanded ? 0 : -10
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut" 
          }}
          className="absolute left-8 overflow-hidden flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
        >
          <audio
            ref={audioRef}
            src={tracks[currentTrack]}
            autoPlay={true}
            onEnded={handleTrackEnd}
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80 h-8 w-8 ml-2"
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
      </motion.div>
    </div>
  );
}
