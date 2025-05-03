import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GITHUB_MUSIC_URL = 'https://raw.githubusercontent.com/apolololo/apolinks_music/main/music';

export default function MusicPlayer() {
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tracks, setTracks] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  
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
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
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
          autoPlay={isPlaying}
          onEnded={handleTrackEnd}
        />
        
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