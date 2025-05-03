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
      clearInterval(fadeIntervalRef.current);
    };
  }, [tracks]);

  // Mise à jour du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Effet pour s'assurer que la musique continue de jouer
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // S'assurer que la musique ne peut pas être mise en pause
      const ensurePlaying = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(console.error);
        }
      };

      // Vérifier périodiquement que la musique joue toujours
      const checkInterval = setInterval(ensurePlaying, 1000);
      // Ajouter un écouteur pour redémarrer la lecture si elle est mise en pause
      audioRef.current.addEventListener('pause', () => {
        if (!audioRef.current?.ended) {
          audioRef.current?.play().catch(console.error);
        }
      });

      return () => {
        clearInterval(checkInterval);
      };
    }
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
    <div className="fixed bottom-8 left-8 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative flex items-center"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-black/50 backdrop-blur-lg rounded-full cursor-pointer border border-white/10">
          <Music className="h-4 w-4 text-white/80" />
        </div>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: "auto", opacity: 1 }}
          className="absolute left-6 overflow-hidden flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10 group-hover:flex"
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
      </motion.div>
    </div>
  );
}
