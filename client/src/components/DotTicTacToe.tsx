import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

type Player = 'X' | 'O' | null;
type Board = (Player)[][];
type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

const DotTicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'draw'>(null);
  const [showGame, setShowGame] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>('easy');
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effet pour initialiser aléatoirement qui commence lorsque le jeu est démarré
  useEffect(() => {
    // Variable pour suivre si le composant est monté
    let isMounted = true;
    
    if (gameStarted && isMounted) {
      // On utilise un identifiant pour éviter les problèmes de timing
      const gameId = Date.now();
      sessionStorage.setItem('currentGameId', gameId.toString());
      
      // On attend un peu pour éviter les effets en cascade
      const timer = setTimeout(() => {
        // On vérifie si le composant est toujours monté et si c'est toujours le même jeu
        if (isMounted && sessionStorage.getItem('currentGameId') === gameId.toString()) {
          // Au lieu d'appeler resetGame qui appelle setState et peut créer une boucle,
          // on fait les opérations directement ici
          const newBoard = Array(3).fill(null).map(() => Array(3).fill(null));
          setBoard(newBoard);
          
          // Choisir aléatoirement qui commence
          const startPlayer = Math.random() < 0.5 ? 'X' : 'O';
          setCurrentPlayer(startPlayer);
          setWinner(null);
          
          // Si l'IA commence, faire jouer l'IA après un court délai
          if (startPlayer === 'O') {
            setTimeout(() => {
              // S'assurer qu'on est toujours dans le même état de jeu
              if (isMounted && !winner) {
                aiMove(newBoard);
              }
            }, 800);
          }
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
  }, [gameStarted]);

  // Effet pour initialiser le canvas
  useEffect(() => {
    if (!canvasRef.current || !showGame) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Assurer que le canvas a la bonne taille
    canvas.width = 300;
    canvas.height = 300;
    
    // Effacer le canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dessiner la grille avec des points
    drawGrid(ctx);
    
    // Dessiner les X et O
    drawBoard(ctx);
    
  }, [board, showGame, winner]);
  
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    
    const canvasSize = 300;
    const cellSize = canvasSize / 3;
    
    // Lignes horizontales
    for (let i = 1; i < 3; i++) {
      const y = i * cellSize;
      
      // Dessiner une ligne pointillée
      ctx.beginPath();
      for (let x = 0; x < canvasSize; x += 6) {
        ctx.moveTo(x, y);
        ctx.arc(x, y, 1, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
    
    // Lignes verticales
    for (let i = 1; i < 3; i++) {
      const x = i * cellSize;
      
      // Dessiner une ligne pointillée
      ctx.beginPath();
      for (let y = 0; y < canvasSize; y += 6) {
        ctx.moveTo(x, y);
        ctx.arc(x, y, 1, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
  };
  
  const drawX = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const canvasSize = 300;
    const cellSize = canvasSize / 3;
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const size = cellSize * 0.25;
    
    // Dessiner X avec des points
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    const pointSpacing = Math.max(2, Math.floor(size / 7));
    
    // Diagonale 1 (haut gauche à bas droite)
    for (let i = -size; i <= size; i += pointSpacing) {
      const offsetX = (i / size) * (cellSize * 0.3);
      const offsetY = (i / size) * (cellSize * 0.3);
      
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY + offsetY, Math.max(1, cellSize * 0.02), 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Diagonale 2 (haut droite à bas gauche)
    for (let i = -size; i <= size; i += pointSpacing) {
      const offsetX = (i / size) * (cellSize * 0.3);
      const offsetY = (-i / size) * (cellSize * 0.3);
      
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY + offsetY, Math.max(1, cellSize * 0.02), 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawO = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const canvasSize = 300;
    const cellSize = canvasSize / 3;
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const radius = cellSize * 0.35;
    
    // Dessiner O avec des points
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // Nombre de points adapté à la taille du cercle
    const numPoints = Math.max(12, Math.floor(radius * 0.5));
    const angleStep = (Math.PI * 2) / numPoints;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const dotX = centerX + Math.cos(angle) * radius;
      const dotY = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, Math.max(1, cellSize * 0.02), 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 'X') {
          drawX(ctx, x, y);
        } else if (cell === 'O') {
          drawO(ctx, x, y);
        }
      });
    });
    
    // Dessiner l'état du jeu (gagnant, match nul)
    if (winner) {
      const canvasWidth = ctx.canvas.width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 100, canvasWidth, 40);
      
      ctx.fillStyle = 'white';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      
      if (winner === 'draw') {
        ctx.fillText('Match nul !', canvasWidth / 2, 125);
      } else {
        ctx.fillText(`${winner} gagne !`, canvasWidth / 2, 125);
      }
    }
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (winner || !showGame || !gameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const x = Math.floor((e.clientX - rect.left) / (canvasWidth / 3));
    const y = Math.floor((e.clientY - rect.top) / (canvasHeight / 3));
    
    // Vérifier si les coordonnées sont valides
    if (x < 0 || x >= 3 || y < 0 || y >= 3) return;
    
    // Vérifier si la case est déjà occupée
    if (board[y][x] !== null) return;
    
    // Mettre à jour le plateau
    makeMove(x, y);
  };
  
  const makeMove = (x: number, y: number) => {
    if (board[y][x] !== null || winner || !gameStarted) return;
    
    const newBoard = [...board.map(row => [...row])];
    newBoard[y][x] = currentPlayer;
    setBoard(newBoard);
    
    // Vérifier s'il y a un gagnant
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameStarted(false);
      return;
    }
    
    // Changer de joueur
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    
    // Si c'est au tour de l'ordinateur, faire jouer l'IA
    if (currentPlayer === 'X') {
      setTimeout(() => {
        aiMove(newBoard);
      }, 500);
    }
  };
  
  const aiMove = (currentBoard: Board) => {
    if (winner || !gameStarted) return;
    
    // Stratégie de l'IA en fonction de la difficulté
    let move: [number, number] | null = null;
    
    switch (aiDifficulty) {
      case 'extreme':
        // Pour le niveau extrême, utiliser le minimax avec une recherche plus profonde
        move = findBestMove(currentBoard, 'O', 7);
        break;
        
      case 'hard':
        // Pour le niveau difficile, utiliser le minimax
        move = findBestMove(currentBoard, 'O', 5);
        break;
        
      case 'medium':
        // Pour le niveau moyen, l'IA essaie de gagner ou de bloquer
        // Vérifier si l'IA peut gagner
        move = findWinningMove(currentBoard, 'O');
        
        // Sinon, bloquer l'adversaire
        if (!move) {
          move = findWinningMove(currentBoard, 'X');
        }
        
        // Jouer au centre si disponible (stratégie de base)
        if (!move) {
          const center = Math.floor(3 / 2);
          if (currentBoard[center][center] === null) {
            move = [center, center];
          }
        }
        break;
        
      case 'easy':
      default:
        // Niveau facile : jouer semi-aléatoirement
        // 20% de chance de faire un bon coup si possible
        if (Math.random() < 0.2) {
          move = findWinningMove(currentBoard, 'O');
          
          if (!move && Math.random() < 0.3) {
            move = findWinningMove(currentBoard, 'X');
          }
        }
        break;
    }
    
    // Si aucun coup stratégique trouvé, jouer aléatoirement
    if (!move) {
      const emptySpots: [number, number][] = [];
      currentBoard.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === null) {
            emptySpots.push([x, y]);
          }
        });
      });
      
      if (emptySpots.length > 0) {
        move = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      }
    }
    
    // Effectuer le mouvement
    if (move) {
      const [x, y] = move;
      const newBoard = [...currentBoard.map(row => [...row])];
      newBoard[y][x] = 'O';
      setBoard(newBoard);
      
      // Vérifier s'il y a un gagnant
      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameStarted(false);
        return;
      }
      
      // Changer de joueur
      setCurrentPlayer('X');
    }
  };
  
  // Fonction pour l'algorithme minimax utilisé par l'IA difficile et extrême
  const minimax = (board: Board, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    // Vérifier si quelqu'un a gagné ou si on a atteint la profondeur maximale
    const result = checkWinner(board);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'draw') return 0;
    if (depth === 0) return evaluateBoard(board);
    
    if (isMaximizing) {
      // Tour de l'IA (maximiser score)
      let maxScore = -Infinity;
      
      // Parcourir toutes les cellules
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (board[y][x] === null) {
            // Essayer ce coup
            const newBoard = [...board.map(row => [...row])];
            newBoard[y][x] = 'O';
            
            const score = minimax(newBoard, depth - 1, false, alpha, beta);
            maxScore = Math.max(maxScore, score);
            
            // Élagage alpha-beta
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
          }
        }
      }
      
      return maxScore;
    } else {
      // Tour du joueur (minimiser score)
      let minScore = Infinity;
      
      // Parcourir toutes les cellules
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (board[y][x] === null) {
            // Essayer ce coup
            const newBoard = [...board.map(row => [...row])];
            newBoard[y][x] = 'X';
            
            const score = minimax(newBoard, depth - 1, true, alpha, beta);
            minScore = Math.min(minScore, score);
            
            // Élagage alpha-beta
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
          }
        }
      }
      
      return minScore;
    }
  };
  
  // Évaluation heuristique du plateau pour l'IA avancée
  const evaluateBoard = (board: Board): number => {
    let score = 0;
    
    // Évaluer les lignes
    for (let y = 0; y < 3; y++) {
      score += evaluateLine(board[y]);
    }
    
    // Évaluer les colonnes
    for (let x = 0; x < 3; x++) {
      const column = Array(3).fill(null).map((_, i) => board[i][x]);
      score += evaluateLine(column);
    }
    
    // Évaluer les diagonales
    const diag1 = Array(3).fill(null).map((_, i) => board[i][i]);
    score += evaluateLine(diag1);
    
    const diag2 = Array(3).fill(null).map((_, i) => board[i][2 - i]);
    score += evaluateLine(diag2);
    
    return score;
  };
  
  // Évaluer une ligne, colonne ou diagonale
  const evaluateLine = (line: Player[]): number => {
    let score = 0;
    const oCount = line.filter(cell => cell === 'O').length;
    const xCount = line.filter(cell => cell === 'X').length;
    const emptyCount = line.filter(cell => cell === null).length;
    
    // Cas favorables à l'IA (O)
    if (oCount > 0 && xCount === 0) {
      score += Math.pow(2, oCount);
    }
    
    // Cas favorables au joueur (X)
    if (xCount > 0 && oCount === 0) {
      score -= Math.pow(2, xCount);
    }
    
    return score;
  };
  
  // Trouver le meilleur coup pour l'IA avancée
  const findBestMove = (board: Board, player: 'X' | 'O', depth: number): [number, number] | null => {
    let bestScore = -Infinity;
    let bestMove: [number, number] | null = null;
    
    // Parcourir toutes les cases
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[y][x] === null) {
          // Essayer ce coup
          const newBoard = [...board.map(row => [...row])];
          newBoard[y][x] = player;
          
          const score = minimax(newBoard, depth, false);
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = [x, y];
          }
        }
      }
    }
    
    return bestMove;
  };
  
  const findWinningMove = (currentBoard: Board, player: 'X' | 'O'): [number, number] | null => {
    // Vérifier toutes les cases vides pour voir si l'une d'elles permet de gagner
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (currentBoard[y][x] === null) {
          // Simuler un coup
          const testBoard = [...currentBoard.map(row => [...row])];
          testBoard[y][x] = player;
          
          // Vérifier si ce coup gagne
          if (checkWinner(testBoard) === player) {
            return [x, y];
          }
        }
      }
    }
    
    return null;
  };
  
  const checkWinner = (currentBoard: Board): Player | 'draw' | null => {
    // Vérifier les lignes
    for (let i = 0; i < 3; i++) {
      if (currentBoard[i][0] && 
          currentBoard[i][0] === currentBoard[i][1] && 
          currentBoard[i][0] === currentBoard[i][2]) {
        return currentBoard[i][0];
      }
    }
    
    // Vérifier les colonnes
    for (let i = 0; i < 3; i++) {
      if (currentBoard[0][i] && 
          currentBoard[0][i] === currentBoard[1][i] && 
          currentBoard[0][i] === currentBoard[2][i]) {
        return currentBoard[0][i];
      }
    }
    
    // Vérifier les diagonales
    if (currentBoard[0][0] && 
        currentBoard[0][0] === currentBoard[1][1] && 
        currentBoard[0][0] === currentBoard[2][2]) {
      return currentBoard[0][0];
    }
    
    if (currentBoard[0][2] && 
        currentBoard[0][2] === currentBoard[1][1] && 
        currentBoard[0][2] === currentBoard[2][0]) {
      return currentBoard[0][2];
    }
    
    // Vérifier s'il y a match nul
    let hasEmptyCell = false;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (currentBoard[y][x] === null) {
          hasEmptyCell = true;
          break;
        }
      }
      if (hasEmptyCell) break;
    }
    
    if (!hasEmptyCell) {
      return 'draw';
    }
    
    return null;
  };
  
  const resetGame = () => {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    // Choisir aléatoirement qui commence (joueur ou IA)
    const startPlayer = Math.random() < 0.5 ? 'X' : 'O';
    setCurrentPlayer(startPlayer);
    setWinner(null);
    
    // Si l'IA commence, faire jouer l'IA après un court délai
    if (startPlayer === 'O') {
      setTimeout(() => {
        // Nouvelle partie, grille vide
        const newBoard = Array(3).fill(null).map(() => Array(3).fill(null));
        aiMove(newBoard);
      }, 800);
    }
  };
  
  const cycleDifficulty = () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'extreme'];
    const currentIndex = difficulties.indexOf(aiDifficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setAiDifficulty(difficulties[nextIndex]);
    
    // Arrêter la partie en cours si elle est démarrée
    if (gameStarted) {
      setGameStarted(false);
    }
    
    // Réinitialiser le plateau
    const newBoard = Array(3).fill(null).map(() => Array(3).fill(null));
    setBoard(newBoard);
    // Choisir aléatoirement qui commence (joueur ou IA)
    const startPlayer = Math.random() < 0.5 ? 'X' : 'O';
    setCurrentPlayer(startPlayer);
    setWinner(null);
  };
  
  if (!showGame) {
    return (
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <button 
          onClick={() => setShowGame(true)}
          className="bg-black bg-opacity-30 text-white text-opacity-80 hover:text-opacity-100 px-5 py-3 rounded-md text-sm flex items-center transition-all duration-300 hover:bg-opacity-50 shadow-lg"
        >
          <span className="mr-2">Jouer au Morpion</span>
          <div className="flex">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i}
                className="w-1.5 h-1.5 bg-white mx-0.5 rounded-full"
                style={{
                  opacity: Math.random() * 0.5 + 0.5,
                  transform: `scale(${Math.random() * 0.5 + 0.8})`
                }}
              />
            ))}
          </div>
        </button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <div className="bg-black bg-opacity-40 rounded-md p-3 shadow-xl border border-white border-opacity-10">
        <div className="mb-2 flex justify-between items-center">
          <div className="text-white text-opacity-90 text-base font-semibold">Morpion</div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                // Arrêter la partie en cours si on ouvre les options
                if (!showSettings && gameStarted) {
                  setGameStarted(false);
                  setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
                  setWinner(null);
                }
              }}
              className="text-white text-opacity-80 hover:text-opacity-100 text-xs px-2.5 py-1.5 bg-black bg-opacity-30 rounded hover:bg-opacity-50 transition-all"
            >
              Options
            </button>
            {gameStarted ? (
              <button
                onClick={() => {
                  setGameStarted(false);
                  setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
                  setWinner(null);
                }}
                className="text-white text-opacity-80 hover:text-opacity-100 text-xs px-2.5 py-1.5 bg-black bg-opacity-30 rounded hover:bg-opacity-50 transition-all"
              >
                Arrêter
              </button>
            ) : (
              <button
                onClick={() => {
                  setGameStarted(true);
                  resetGame();
                }}
                className="text-white text-opacity-80 hover:text-opacity-100 text-xs px-2.5 py-1.5 bg-black bg-opacity-30 rounded hover:bg-opacity-50 transition-all bg-green-800 bg-opacity-40"
              >
                Démarrer
              </button>
            )}
            <button
              onClick={() => {
                setShowGame(false);
                // Réinitialiser complètement le jeu quand on le ferme
                if (gameStarted) {
                  setGameStarted(false);
                  setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
                  setWinner(null);
                }
              }}
              className="text-white text-opacity-80 hover:text-opacity-100 text-xs px-2.5 py-1.5 bg-black bg-opacity-30 rounded hover:bg-opacity-50 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
        
        {showSettings && (
          <div className="mb-2 bg-black bg-opacity-30 rounded-md p-2 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <div className="text-white text-opacity-80 text-xs">Difficulté :</div>
              <button
                onClick={cycleDifficulty}
                className="text-white text-opacity-80 hover:text-opacity-100 text-xs px-2.5 py-1 bg-black bg-opacity-30 rounded hover:bg-opacity-50 transition-all"
              >
                {aiDifficulty === 'easy' && 'Facile'}
                {aiDifficulty === 'medium' && 'Moyen'}
                {aiDifficulty === 'hard' && 'Difficile'}
                {aiDifficulty === 'extreme' && 'Extrême'}
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-black bg-opacity-20 p-1 rounded">
          <canvas 
            ref={canvasRef} 
            width={300} 
            height={300} 
            style={{ width: '300px', height: '300px' }}
            onClick={handleCanvasClick}
          />
        </div>
        
        {winner ? (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => {
                setGameStarted(true);
                resetGame();
              }}
              className="text-white text-opacity-90 hover:text-opacity-100 text-sm px-3 py-1 bg-black bg-opacity-40 rounded hover:bg-opacity-60 transition-all"
            >
              {winner === 'draw' ? 'Match nul - Rejouer' : winner === 'X' ? 'Vous avez gagné - Rejouer' : 'Vous avez perdu - Rejouer'}
            </button>
          </div>
        ) : (
          <>
            {!gameStarted ? (
              <div className="text-white text-opacity-90 text-sm mt-2 text-center font-medium">
                Configurez vos options puis cliquez sur Démarrer
              </div>
            ) : (
              <>
                {currentPlayer === 'X' && (
                  <div className="text-white text-opacity-90 text-sm mt-2 text-center font-medium">
                    Votre tour - Cliquez pour jouer
                  </div>
                )}
                {currentPlayer === 'O' && (
                  <div className="text-white text-opacity-90 text-sm mt-2 text-center font-medium">
                    L'ordinateur réfléchit...
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DotTicTacToe;