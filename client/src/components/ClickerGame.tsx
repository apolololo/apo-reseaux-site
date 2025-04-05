
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CustomProgress } from '@/components/ui/custom-progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Zap, 
  Coins,
  Heart, 
  Star, 
  ArrowUp, 
  ChevronUp, 
  Sparkles,
  Gift,
  GaugeCircle,
  Rocket,
  Award
} from 'lucide-react';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: number;
  purchased: boolean;
  maxPurchases: number;
  purchases: number;
  icon: React.ReactNode;
  type: 'click' | 'passive';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  achieved: boolean;
  type: 'clicks' | 'points' | 'upgrades';
  icon: React.ReactNode;
}

const ClickerGame = () => {
  // Game state
  const [isGameActive, setIsGameActive] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [points, setPoints] = useState(0);
  const [pointsPerClick, setPointsPerClick] = useState(1);
  const [pointsPerSecond, setPointsPerSecond] = useState(0);
  const [showGameUI, setShowGameUI] = useState(false);
  const [activeTab, setActiveTab] = useState<'upgrades' | 'achievements'>('upgrades');
  const [floatingTexts, setFloatingTexts] = useState<Array<{id: number, value: number, x: number, y: number}>>([]);
  const [nextTextId, setNextTextId] = useState(0);
  
  // List of upgrades
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    // Click upgrades - early game
    {
      id: 'click1',
      name: 'Doigts agiles',
      description: '+1 point par clic',
      cost: 15,
      effect: 1,
      purchased: false,
      maxPurchases: 10,
      purchases: 0,
      icon: <Zap size={18} />,
      type: 'click'
    },
    {
      id: 'click2',
      name: 'Clics puissants',
      description: '+3 points par clic',
      cost: 50,
      effect: 3,
      purchased: false,
      maxPurchases: 8,
      purchases: 0,
      icon: <Sparkles size={18} />,
      type: 'click'
    },
    {
      id: 'click3',
      name: 'Clics énergiques',
      description: '+7 points par clic',
      cost: 200,
      effect: 7,
      purchased: false,
      maxPurchases: 6,
      purchases: 0,
      icon: <Star size={18} />,
      type: 'click'
    },
    {
      id: 'click4',
      name: 'Clics explosifs',
      description: '+15 points par clic',
      cost: 500,
      effect: 15,
      purchased: false,
      maxPurchases: 5,
      purchases: 0,
      icon: <Zap size={18} />,
      type: 'click'
    },
    {
      id: 'click5',
      name: 'Clics ravageurs',
      description: '+40 points par clic',
      cost: 2000,
      effect: 40,
      purchased: false,
      maxPurchases: 4,
      purchases: 0,
      icon: <Sparkles size={18} />,
      type: 'click'
    },
    {
      id: 'click6',
      name: 'Clics cosmiques',
      description: '+100 points par clic',
      cost: 7500,
      effect: 100,
      purchased: false,
      maxPurchases: 3,
      purchases: 0,
      icon: <Star size={18} />,
      type: 'click'
    },
    {
      id: 'click7',
      name: 'Clics divins',
      description: '+300 points par clic',
      cost: 25000,
      effect: 300,
      purchased: false,
      maxPurchases: 2,
      purchases: 0,
      icon: <Zap size={18} />,
      type: 'click'
    },
    {
      id: 'click8',
      name: 'Clics ultimes',
      description: '+1000 points par clic',
      cost: 100000,
      effect: 1000,
      purchased: false,
      maxPurchases: 1,
      purchases: 0,
      icon: <Sparkles size={18} />,
      type: 'click'
    },
    
    // Passive upgrades - auto clickers
    {
      id: 'passive1',
      name: 'Auto-cliqueur basique',
      description: '+1 point par seconde',
      cost: 25,
      effect: 1,
      purchased: false,
      maxPurchases: 10,
      purchases: 0,
      icon: <GaugeCircle size={18} />,
      type: 'passive'
    },
    {
      id: 'passive2',
      name: 'Générateur de points',
      description: '+3 points par seconde',
      cost: 120,
      effect: 3,
      purchased: false,
      maxPurchases: 8,
      purchases: 0,
      icon: <Rocket size={18} />,
      type: 'passive'
    },
    {
      id: 'passive3',
      name: 'Collecteur automatique',
      description: '+7 points par seconde',
      cost: 350,
      effect: 7,
      purchased: false,
      maxPurchases: 6,
      purchases: 0,
      icon: <GaugeCircle size={18} />,
      type: 'passive'
    },
    {
      id: 'passive4',
      name: 'Ferme de points',
      description: '+15 points par seconde',
      cost: 1000,
      effect: 15,
      purchased: false,
      maxPurchases: 5,
      purchases: 0,
      icon: <Rocket size={18} />,
      type: 'passive'
    },
    {
      id: 'passive5',
      name: 'Usine automatisée',
      description: '+40 points par seconde',
      cost: 3500,
      effect: 40,
      purchased: false,
      maxPurchases: 4,
      purchases: 0,
      icon: <GaugeCircle size={18} />,
      type: 'passive'
    },
    {
      id: 'passive6',
      name: 'Mine de points',
      description: '+100 points par seconde',
      cost: 10000,
      effect: 100,
      purchased: false,
      maxPurchases: 3,
      purchases: 0,
      icon: <Rocket size={18} />,
      type: 'passive'
    },
    {
      id: 'passive7',
      name: 'Portail dimensionnel',
      description: '+300 points par seconde',
      cost: 35000,
      effect: 300,
      purchased: false,
      maxPurchases: 2,
      purchases: 0,
      icon: <GaugeCircle size={18} />,
      type: 'passive'
    },
    {
      id: 'passive8',
      name: 'Téléporteur quantique',
      description: '+1000 points par seconde',
      cost: 125000,
      effect: 1000,
      purchased: false,
      maxPurchases: 1,
      purchases: 0,
      icon: <Rocket size={18} />,
      type: 'passive'
    },
  ]);
  
  // Liste des succès
  const [achievements, setAchievements] = useState<Achievement[]>([
    // Succès de clics
    {
      id: 'clicks10',
      name: 'Cliqueur débutant',
      description: 'Cliquer 10 fois',
      requirement: 10,
      achieved: false,
      type: 'clicks',
      icon: <Zap size={18} />
    },
    {
      id: 'clicks100',
      name: 'Cliqueur assidu',
      description: 'Cliquer 100 fois',
      requirement: 100,
      achieved: false,
      type: 'clicks',
      icon: <Sparkles size={18} />
    },
    {
      id: 'clicks500',
      name: 'Cliqueur avancé',
      description: 'Cliquer 500 fois',
      requirement: 500,
      achieved: false,
      type: 'clicks',
      icon: <Zap size={18} />
    },
    {
      id: 'clicks1000',
      name: 'Cliqueur expert',
      description: 'Cliquer 1000 fois',
      requirement: 1000,
      achieved: false,
      type: 'clicks',
      icon: <Sparkles size={18} />
    },
    {
      id: 'clicks5000',
      name: 'Maître du clic',
      description: 'Cliquer 5000 fois',
      requirement: 5000,
      achieved: false,
      type: 'clicks',
      icon: <Zap size={18} />
    },
    {
      id: 'clicks10000',
      name: 'Dieu du clic',
      description: 'Cliquer 10000 fois',
      requirement: 10000,
      achieved: false,
      type: 'clicks',
      icon: <Star size={18} />
    },
    
    // Succès de points
    {
      id: 'points100',
      name: 'Collecteur de points',
      description: 'Gagner 100 points',
      requirement: 100,
      achieved: false,
      type: 'points',
      icon: <Coins size={18} />
    },
    {
      id: 'points1000',
      name: 'Accumulateur de points',
      description: 'Gagner 1000 points',
      requirement: 1000,
      achieved: false,
      type: 'points',
      icon: <Gift size={18} />
    },
    {
      id: 'points10000',
      name: 'Millionnaire de points',
      description: 'Gagner 10,000 points',
      requirement: 10000,
      achieved: false,
      type: 'points',
      icon: <Coins size={18} />
    },
    {
      id: 'points100000',
      name: 'Multimillionnaire',
      description: 'Gagner 100,000 points',
      requirement: 100000,
      achieved: false,
      type: 'points',
      icon: <Gift size={18} />
    },
    {
      id: 'points1000000',
      name: 'Milliardaire virtuel',
      description: 'Gagner 1,000,000 points',
      requirement: 1000000,
      achieved: false,
      type: 'points',
      icon: <Trophy size={18} />
    },
    
    // Succès d'améliorations
    {
      id: 'upgrades3',
      name: 'Amateur d\'améliorations',
      description: 'Acheter 3 améliorations',
      requirement: 3,
      achieved: false,
      type: 'upgrades',
      icon: <Trophy size={18} />
    },
    {
      id: 'upgrades10',
      name: 'Collectionneur d\'améliorations',
      description: 'Acheter 10 améliorations',
      requirement: 10,
      achieved: false,
      type: 'upgrades',
      icon: <Trophy size={18} />
    },
    {
      id: 'upgrades25',
      name: 'Expert en améliorations',
      description: 'Acheter 25 améliorations',
      requirement: 25,
      achieved: false,
      type: 'upgrades',
      icon: <Trophy size={18} />
    },
    {
      id: 'upgrades50',
      name: 'Maître des améliorations',
      description: 'Acheter 50 améliorations',
      requirement: 50,
      achieved: false,
      type: 'upgrades',
      icon: <Trophy size={18} />
    }
  ]);
  
  // Passive income
  useEffect(() => {
    if (!isGameActive) return;
    
    const interval = setInterval(() => {
      if (pointsPerSecond > 0) {
        setPoints(prev => prev + pointsPerSecond);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isGameActive, pointsPerSecond]);
  
  // Save game
  useEffect(() => {
    if (!isGameActive) return;
    
    const gameState = {
      clicks,
      points,
      pointsPerClick,
      pointsPerSecond,
      upgrades,
      achievements
    };
    
    localStorage.setItem('clickerGameState', JSON.stringify(gameState));
  }, [isGameActive, clicks, points, pointsPerClick, pointsPerSecond, upgrades, achievements]);
  
  // Load game
  useEffect(() => {
    const savedState = localStorage.getItem('clickerGameState');
    
    if (savedState) {
      try {
        const { clicks, points, pointsPerClick, pointsPerSecond, upgrades, achievements } = JSON.parse(savedState);
        setClicks(clicks || 0);
        setPoints(points || 0);
        setPointsPerClick(pointsPerClick || 1);
        setPointsPerSecond(pointsPerSecond || 0);
        
        if (upgrades) setUpgrades(upgrades);
        if (achievements) setAchievements(achievements);
        setIsGameActive(true);
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);
  
  // Toast notification
  const { toast } = useToast();
  const [recentAchievements, setRecentAchievements] = useState<string[]>([]);
  
  // Check achievements
  useEffect(() => {
    if (!isGameActive) return;
    
    const newlyAchieved: Achievement[] = [];
    
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.achieved) return achievement;
      
      let achieved = false;
      
      switch (achievement.type) {
        case 'clicks':
          achieved = clicks >= achievement.requirement;
          break;
        case 'points':
          achieved = points >= achievement.requirement;
          break;
        case 'upgrades':
          achieved = upgrades.filter(u => u.purchases > 0).length >= achievement.requirement;
          break;
      }
      
      if (achieved) {
        // This achievement was just unlocked
        newlyAchieved.push(achievement);
      }
      
      return {
        ...achievement,
        achieved
      };
    });
    
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
      setAchievements(updatedAchievements);
      
      // Show notifications for new achievements
      newlyAchieved.forEach(achievement => {
        // Avoid showing duplicate notifications for the same achievement
        if (!recentAchievements.includes(achievement.id)) {
          setRecentAchievements(prev => [...prev, achievement.id]);
          
          toast({
            title: "Succès débloqué !",
            description: (
              <div className="flex items-center gap-2">
                <div className="p-1 bg-yellow-400/20 rounded-full">
                  <Award className="h-4 w-4 text-yellow-400" />
                </div>
                <span><strong>{achievement.name}</strong> - {achievement.description}</span>
              </div>
            ),
            variant: "default",
            duration: 5000
          });
          
          // Set active tab to achievements to show the user their new achievement
          setActiveTab('achievements');
        }
      });
    }
  }, [isGameActive, clicks, points, upgrades, achievements, toast, recentAchievements]);
  
  // Game functions
  const handleMainButtonClick = (e: React.MouseEvent) => {
    if (!isGameActive) {
      setIsGameActive(true);
      setShowGameUI(true);
      return;
    }
    
    setClicks(prev => prev + 1);
    setPoints(prev => prev + pointsPerClick);
    
    // Add floating text
    const id = nextTextId;
    setNextTextId(prev => prev + 1);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFloatingTexts(prev => [
      ...prev, 
      { id, value: pointsPerClick, x, y }
    ]);
    
    // Remove floating text after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(text => text.id !== id));
    }, 1000);
  };
  
  const purchaseUpgrade = (upgradeId: string) => {
    const upgradeToPurchase = upgrades.find(u => u.id === upgradeId);
    if (!upgradeToPurchase) return;
    
    if (upgradeToPurchase.purchases >= upgradeToPurchase.maxPurchases) return;
    if (points < upgradeToPurchase.cost) return;
    
    // Apply upgrade
    setPoints(prev => prev - upgradeToPurchase.cost);
    
    const updatedUpgrades = upgrades.map(upgrade => {
      if (upgrade.id === upgradeId) {
        const newPurchases = upgrade.purchases + 1;
        const newCost = Math.floor(upgrade.cost * Math.pow(1.5, newPurchases));
        
        return {
          ...upgrade,
          purchased: true,
          purchases: newPurchases,
          cost: newCost
        };
      }
      return upgrade;
    });
    
    setUpgrades(updatedUpgrades);
    
    // Apply upgrade effects
    if (upgradeToPurchase.type === 'click') {
      setPointsPerClick(prev => prev + upgradeToPurchase.effect);
    } else if (upgradeToPurchase.type === 'passive') {
      setPointsPerSecond(prev => prev + upgradeToPurchase.effect);
    }
  };
  
  // Calculate progress for achievements
  const getAchievementProgress = (achievement: Achievement) => {
    switch (achievement.type) {
      case 'clicks':
        return Math.min(100, (clicks / achievement.requirement) * 100);
      case 'points':
        return Math.min(100, (points / achievement.requirement) * 100);
      case 'upgrades':
        const purchasedUpgrades = upgrades.filter(u => u.purchases > 0).length;
        return Math.min(100, (purchasedUpgrades / achievement.requirement) * 100);
      default:
        return 0;
    }
  };
  
  // Reset game
  const resetGame = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser votre progression ?')) {
      localStorage.removeItem('clickerGameState');
      setClicks(0);
      setPoints(0);
      setPointsPerClick(1);
      setPointsPerSecond(0);
      
      // Reset upgrades to their initial costs
      const resetUpgrades = upgrades.map(upgrade => {
        let initialCost = 15; // default
        
        // Click upgrades
        if (upgrade.id === 'click1') initialCost = 15;
        else if (upgrade.id === 'click2') initialCost = 50;
        else if (upgrade.id === 'click3') initialCost = 200;
        else if (upgrade.id === 'click4') initialCost = 500;
        else if (upgrade.id === 'click5') initialCost = 2000;
        else if (upgrade.id === 'click6') initialCost = 7500;
        else if (upgrade.id === 'click7') initialCost = 25000;
        else if (upgrade.id === 'click8') initialCost = 100000;
        
        // Passive upgrades
        else if (upgrade.id === 'passive1') initialCost = 25;
        else if (upgrade.id === 'passive2') initialCost = 120;
        else if (upgrade.id === 'passive3') initialCost = 350;
        else if (upgrade.id === 'passive4') initialCost = 1000;
        else if (upgrade.id === 'passive5') initialCost = 3500;
        else if (upgrade.id === 'passive6') initialCost = 10000;
        else if (upgrade.id === 'passive7') initialCost = 35000;
        else if (upgrade.id === 'passive8') initialCost = 125000;
        
        return {
          ...upgrade,
          purchased: false,
          purchases: 0,
          cost: initialCost
        };
      });
      
      setUpgrades(resetUpgrades);
      setAchievements(achievements.map(achievement => ({
        ...achievement,
        achieved: false
      })));
    }
  };
  
  // UI elements
  const MainButton = () => (
    <motion.div 
      className="relative flex flex-col items-center mb-4"
      initial={false}
      animate={isGameActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3, repeat: isGameActive ? Infinity : 0, repeatType: "reverse" }}
    >
      <button
        className="w-32 h-32 rounded-full bg-black border-4 border-white/20 flex items-center justify-center focus:outline-none relative overflow-hidden shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30"
        onClick={handleMainButtonClick}
      >
        <span className="text-white text-2xl font-bold">CLIQUEZ</span>
        
        {/* Floating text elements */}
        {floatingTexts.map(text => (
          <motion.div
            key={text.id}
            className="absolute text-white font-bold text-xl"
            initial={{ opacity: 1, y: 0, x: text.x - 15 }}
            animate={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ left: text.x - 15, top: text.y - 15 }}
          >
            +{text.value}
          </motion.div>
        ))}
      </button>
    </motion.div>
  );
  
  // Menu Tabs
  const GameTabs = () => (
    <div className="flex border-b border-white/10 mb-4">
      <button
        className={`py-2 px-4 text-sm ${activeTab === 'upgrades' ? 'text-white border-b-2 border-white' : 'text-white/50'}`}
        onClick={() => setActiveTab('upgrades')}
      >
        Améliorations
      </button>
      <button
        className={`py-2 px-4 text-sm ${activeTab === 'achievements' ? 'text-white border-b-2 border-white' : 'text-white/50'}`}
        onClick={() => setActiveTab('achievements')}
      >
        Succès
      </button>
    </div>
  );
  
  // UI for showing upgrades
  const UpgradesUI = () => {
    const clickUpgrades = upgrades.filter(u => u.type === 'click');
    const passiveUpgrades = upgrades.filter(u => u.type === 'passive');
    
    return (
      <div className="overflow-y-auto max-h-60">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-purple-300 mb-1 pl-1">Améliorations de Clic</h3>
          <div className="grid gap-2">
            {clickUpgrades.map((upgrade) => (
              <motion.div 
                key={upgrade.id} 
                className={`p-2 border rounded-md flex items-center gap-3 ${
                  points >= upgrade.cost && upgrade.purchases < upgrade.maxPurchases
                    ? 'border-purple-500/30 hover:border-purple-400 cursor-pointer bg-purple-950/20'
                    : 'border-white/10 opacity-60'
                }`}
                onClick={() => purchaseUpgrade(upgrade.id)}
                whileHover={points >= upgrade.cost && upgrade.purchases < upgrade.maxPurchases ? { scale: 1.02 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  upgrade.purchased ? 'bg-purple-700/30' : 'bg-purple-900/30'
                }`}>
                  {upgrade.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">
                      {upgrade.name} {upgrade.purchases > 0 ? `(${upgrade.purchases}/${upgrade.maxPurchases})` : ''}
                    </h3>
                    <span className={`text-xs flex items-center ${points >= upgrade.cost ? 'text-green-400' : 'text-red-400'}`}>
                      <Coins size={12} className="mr-1" />
                      {upgrade.cost.toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">{upgrade.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-blue-300 mb-1 pl-1">Automatisation</h3>
          <div className="grid gap-2">
            {passiveUpgrades.map((upgrade) => (
              <motion.div 
                key={upgrade.id} 
                className={`p-2 border rounded-md flex items-center gap-3 ${
                  points >= upgrade.cost && upgrade.purchases < upgrade.maxPurchases
                    ? 'border-blue-500/30 hover:border-blue-400 cursor-pointer bg-blue-950/20'
                    : 'border-white/10 opacity-60'
                }`}
                onClick={() => purchaseUpgrade(upgrade.id)}
                whileHover={points >= upgrade.cost && upgrade.purchases < upgrade.maxPurchases ? { scale: 1.02 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  upgrade.purchased ? 'bg-blue-700/30' : 'bg-blue-900/30'
                }`}>
                  {upgrade.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">
                      {upgrade.name} {upgrade.purchases > 0 ? `(${upgrade.purchases}/${upgrade.maxPurchases})` : ''}
                    </h3>
                    <span className={`text-xs flex items-center ${points >= upgrade.cost ? 'text-green-400' : 'text-red-400'}`}>
                      <Coins size={12} className="mr-1" />
                      {upgrade.cost.toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">{upgrade.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // UI for showing achievements
  const AchievementsUI = () => {
    // Group achievements by type for better organization
    const clickAchievements = achievements.filter(a => a.type === 'clicks');
    const pointsAchievements = achievements.filter(a => a.type === 'points');
    const upgradesAchievements = achievements.filter(a => a.type === 'upgrades');
    
    return (
      <div className="overflow-y-auto max-h-60">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-amber-300 mb-1 pl-1">Succès de Clics</h3>
          <div className="grid gap-2">
            {clickAchievements.map((achievement) => (
              <motion.div 
                key={achievement.id} 
                className={`p-2 border rounded-md ${
                  achievement.achieved ? 'border-yellow-500/30 bg-yellow-900/10' : 'border-white/10'
                }`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.achieved ? 'bg-yellow-900/30' : 'bg-gray-900/30'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium flex items-center">
                      {achievement.name}
                      {achievement.achieved && (
                        <motion.span 
                          className="ml-2 text-yellow-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-xs text-white/70">{achievement.description}</p>
                  </div>
                </div>
                
                <CustomProgress
                  className={`h-1 mt-2 ${achievement.achieved ? 'bg-yellow-950' : ''}`}
                  value={getAchievementProgress(achievement)}
                  indicatorClassName={achievement.achieved ? 'bg-yellow-500' : ''}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium text-green-300 mb-1 pl-1">Succès de Points</h3>
          <div className="grid gap-2">
            {pointsAchievements.map((achievement) => (
              <motion.div 
                key={achievement.id} 
                className={`p-2 border rounded-md ${
                  achievement.achieved ? 'border-green-500/30 bg-green-900/10' : 'border-white/10'
                }`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.achieved ? 'bg-green-900/30' : 'bg-gray-900/30'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium flex items-center">
                      {achievement.name}
                      {achievement.achieved && (
                        <motion.span 
                          className="ml-2 text-green-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-xs text-white/70">{achievement.description}</p>
                  </div>
                </div>
                
                <CustomProgress
                  className={`h-1 mt-2 ${achievement.achieved ? 'bg-green-950' : ''}`}
                  value={getAchievementProgress(achievement)}
                  indicatorClassName={achievement.achieved ? 'bg-green-500' : ''}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium text-orange-300 mb-1 pl-1">Succès d'Améliorations</h3>
          <div className="grid gap-2">
            {upgradesAchievements.map((achievement) => (
              <motion.div 
                key={achievement.id} 
                className={`p-2 border rounded-md ${
                  achievement.achieved ? 'border-orange-500/30 bg-orange-900/10' : 'border-white/10'
                }`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.achieved ? 'bg-orange-900/30' : 'bg-gray-900/30'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium flex items-center">
                      {achievement.name}
                      {achievement.achieved && (
                        <motion.span 
                          className="ml-2 text-orange-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-xs text-white/70">{achievement.description}</p>
                  </div>
                </div>
                
                <CustomProgress
                  className={`h-1 mt-2 ${achievement.achieved ? 'bg-orange-950' : ''}`}
                  value={getAchievementProgress(achievement)}
                  indicatorClassName={achievement.achieved ? 'bg-orange-500' : ''}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Main game UI
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center p-4">
        {/* Main click button */}
        <MainButton />
        
        {/* Stats */}
        {isGameActive && (
          <div className="text-center mb-4">
            <div className="flex gap-8 justify-center mb-2">
              <div>
                <div className="text-xl font-bold">{points.toLocaleString('fr-FR')}</div>
                <div className="text-xs text-white/50">POINTS</div>
              </div>
              <div>
                <div className="text-xl font-bold">{clicks.toLocaleString('fr-FR')}</div>
                <div className="text-xs text-white/50">CLICS</div>
              </div>
            </div>
            <div className="flex gap-6 justify-center text-xs">
              <div className="flex items-center">
                <ChevronUp className="h-3 w-3 mr-1 text-purple-400" />
                {pointsPerClick} par clic
              </div>
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-1 text-blue-400" />
                {pointsPerSecond} par seconde
              </div>
            </div>
          </div>
        )}
        
        {/* Game UI: Upgrades and Achievements */}
        {isGameActive && showGameUI && (
          <div className="w-full">
            <GameTabs />
            
            {activeTab === 'upgrades' ? <UpgradesUI /> : <AchievementsUI />}
            
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetGame}
                className="text-xs text-white/50 hover:text-white"
              >
                Réinitialiser la progression
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickerGame;
