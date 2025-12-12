import React, { useEffect, useState, useCallback } from 'react';
import { Brain, Check, Sparkles, Loader2, RefreshCw, Trophy, X, Circle, Clock, User, Bot, Minus } from 'lucide-react';

interface LoadingScreenProps {
  topic: string;
  generatedTitle: string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ topic, generatedTitle }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // --- Tic Tac Toe State ---
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X always goes first
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X'); // Randomly assigned at start
  const [winner, setWinner] = useState<'Player' | 'Computer' | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });

  // Define the progression steps
  const steps = [
    "Analyzing learning path...",
    "Structuring course modules...",
    "Drafting detailed lessons...",
    "Creating final assessment..."
  ];

  // --- Loading Animation Logic ---
  useEffect(() => {
    if (!generatedTitle) {
      setCurrentStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [generatedTitle, steps.length]);

  // --- Game Initialization ---
  useEffect(() => {
    // Randomly decide who starts first (X goes first)
    // If player is X, player starts. If player is O, computer starts.
    const isPlayerStarting = Math.random() > 0.5;
    setPlayerSymbol(isPlayerStarting ? 'X' : 'O');
  }, []);

  // --- Computer Turn Logic (Medium Difficulty) ---
  const makeComputerMove = useCallback(() => {
    if (winner) return;

    const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
    const opponentSymbol = playerSymbol;

    // Helper to find winning move for a specific symbol
    const findWinningMove = (symbol: string): number | null => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      for (let line of lines) {
        const [a, b, c] = line;
        const squares = [board[a], board[b], board[c]];
        if (squares.filter(s => s === symbol).length === 2 && squares.includes(null)) {
           // Find the null index
           if (board[a] === null) return a;
           if (board[b] === null) return b;
           if (board[c] === null) return c;
        }
      }
      return null;
    };

    let moveIndex: number | null = null;

    // 1. Try to Win
    moveIndex = findWinningMove(computerSymbol);

    // 2. Block Opponent
    if (moveIndex === null) {
      moveIndex = findWinningMove(opponentSymbol);
    }

    // 3. Take Center
    if (moveIndex === null && board[4] === null) {
      moveIndex = 4;
    }

    // 4. Random Available
    if (moveIndex === null) {
      const available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      if (available.length > 0) {
        moveIndex = available[Math.floor(Math.random() * available.length)];
      }
    }

    if (moveIndex !== null) {
      handleMove(moveIndex, computerSymbol);
    }
  }, [board, playerSymbol, winner]);

  // Trigger Computer Move
  useEffect(() => {
    const isComputerTurn = (isXNext && playerSymbol === 'O') || (!isXNext && playerSymbol === 'X');
    
    if (isComputerTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 600); // Delay for realism
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, playerSymbol, makeComputerMove]);


  // --- Game Mechanics ---
  const checkGameStatus = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winnerSymbol: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleMove = (index: number, symbolOverride?: string) => {
    if (board[index] || winner) return;

    const currentSymbol = isXNext ? 'X' : 'O';
    // Ensure we aren't moving out of turn (extra safety for clicks)
    if (!symbolOverride && currentSymbol !== playerSymbol) return;

    const newBoard = [...board];
    newBoard[index] = symbolOverride || currentSymbol;
    setBoard(newBoard);
    
    const result = checkGameStatus(newBoard);
    
    if (result) {
      const isPlayerWinner = result.winnerSymbol === playerSymbol;
      setWinner(isPlayerWinner ? 'Player' : 'Computer');
      setWinningLine(result.line);
      setScores(prev => ({
        ...prev,
        player: isPlayerWinner ? prev.player + 1 : prev.player,
        computer: !isPlayerWinner ? prev.computer + 1 : prev.computer
      }));
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setIsXNext(true); // X always starts
    // Randomize who is X again for the next game
    setPlayerSymbol(Math.random() > 0.5 ? 'X' : 'O');
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 min-h-[80vh] relative overflow-y-auto">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-100 via-purple-100 to-orange-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse"></div>

      {/* Main Container - Expanded width for split view */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* LEFT COLUMN: Progress & Status */}
        <div className="flex-1 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/60 flex flex-col justify-between order-2 md:order-1">
          <div>
            <div className="bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center text-center border border-slate-100 mb-6">
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-accent mb-4 border border-slate-100 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Brain size={32} strokeWidth={1.5} className="animate-pulse" />
              </div>
              
              <div className="space-y-3 w-full">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Building Course</div>
                  
                  {generatedTitle ? (
                    <h3 className="text-xl font-bold text-slate-800 font-heading leading-tight animate-fade-in">
                      {generatedTitle}
                    </h3>
                  ) : (
                    <div className="h-14 w-full bg-slate-200/70 rounded-lg animate-pulse"></div>
                  )}
              </div>
            </div>

            <div className="space-y-5 px-2">
              {steps.slice(0, generatedTitle ? steps.length : 0).map((stepText, index) => {
                  if (index >= currentStep) return null;
                  return (
                    <div key={index} className="flex items-center gap-4 animate-fade-in-up">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center border border-green-200 shadow-sm flex-shrink-0">
                          <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-slate-600 font-medium text-sm">{stepText}</span>
                    </div>
                  );
              })}
            </div>
          </div>

          {/* Active Step Footer */}
          <div className="mt-8 bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-100">
                <div className="h-full bg-accent animate-progress-indeterminate"></div>
            </div>
            
            <div className="w-10 h-10 bg-white rounded-full text-accent flex items-center justify-center border border-blue-100 shadow-sm flex-shrink-0 z-10">
                {generatedTitle ? (
                  <Sparkles size={18} className="animate-pulse" />
                ) : (
                  <Loader2 size={18} className="animate-spin" />
                )}
            </div>
            
            <div className="flex-1 z-10">
                <span className="text-blue-900 font-semibold text-sm block">
                  {generatedTitle ? steps[currentStep] : "Formulating course title..."}
                </span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
             <Clock size={12} />
             <span>Estimated wait time: 2-3 minutes</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Tic Tac Toe Game */}
        <div className="flex-1 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 flex flex-col items-center order-1 md:order-2">
            
            <div className="w-full mb-6 flex justify-between items-start">
               <div>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Mini Game</span>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">Tic Tac Toe</h3>
               </div>
               
               {/* Scoreboard */}
               <div className="flex gap-2">
                  <div className="flex flex-col items-center bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 min-w-[60px]">
                      <span className="text-[10px] font-bold uppercase text-blue-400">You</span>
                      <span className="text-xl font-bold text-blue-700">{scores.player}</span>
                  </div>
                  <div className="flex flex-col items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 min-w-[60px]">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Draw</span>
                      <span className="text-xl font-bold text-slate-600">{scores.draws}</span>
                  </div>
                  <div className="flex flex-col items-center bg-purple-50 px-3 py-2 rounded-xl border border-purple-100 min-w-[60px]">
                      <span className="text-[10px] font-bold uppercase text-purple-400">AI</span>
                      <span className="text-xl font-bold text-purple-700">{scores.computer}</span>
                  </div>
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[320px]">
                {/* Turn Indicators */}
                <div className="flex justify-between items-center w-full mb-4 px-4 bg-slate-100/50 p-2 rounded-full">
                    <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 ${!winner && ((isXNext && playerSymbol === 'X') || (!isXNext && playerSymbol === 'O')) ? 'bg-white text-blue-600 shadow-sm scale-105' : 'text-slate-400'}`}>
                        <User size={14} /> You ({playerSymbol})
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 ${!winner && ((isXNext && playerSymbol === 'O') || (!isXNext && playerSymbol === 'X')) ? 'bg-white text-purple-600 shadow-sm scale-105' : 'text-slate-400'}`}>
                        <Bot size={14} /> Computer ({playerSymbol === 'X' ? 'O' : 'X'})
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-3 w-full aspect-square bg-slate-100 p-3 rounded-2xl shadow-inner relative">
                    {/* Disable interactions if computer turn */}
                    {(!winner && ((isXNext && playerSymbol === 'O') || (!isXNext && playerSymbol === 'X'))) && (
                       <div className="absolute inset-0 z-10 cursor-wait"></div>
                    )}

                    {board.map((cell, index) => {
                        const isWinningCell = winningLine?.includes(index);
                        return (
                            <button
                                key={index}
                                onClick={() => handleMove(index)}
                                disabled={!!cell || !!winner}
                                className={`
                                    rounded-xl flex items-center justify-center text-4xl font-bold transition-all duration-300
                                    ${cell ? 'bg-white shadow-sm scale-100' : 'bg-slate-200/50 hover:bg-white/60 scale-95 hover:scale-100'}
                                    ${isWinningCell ? 'bg-green-100 ring-4 ring-green-200 z-10' : ''}
                                `}
                            >
                                {cell === 'X' && <X size={44} className={`text-accent ${isWinningCell ? 'text-green-600' : ''} animate-scale-up`} />}
                                {cell === 'O' && <Circle size={36} strokeWidth={3.5} className={`text-purple-500 ${isWinningCell ? 'text-green-600' : ''} animate-scale-up`} />}
                            </button>
                        )
                    })}
                </div>
            
                {/* Game Footer / Result */}
                <div className="mt-6 h-14 w-full flex items-center justify-center">
                    {winner ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <span className={`text-lg font-bold mb-2 ${winner === 'Player' ? 'text-green-600' : winner === 'Computer' ? 'text-purple-600' : 'text-slate-600'}`}>
                                {winner === 'Draw' ? "It's a Draw!" : winner === 'Player' ? "You Won! 🎉" : "AI Won! 🤖"}
                            </span>
                            <button 
                                onClick={resetGame}
                                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 flex items-center gap-2"
                            >
                                <RefreshCw size={14} /> Play Again
                            </button>
                        </div>
                    ) : (
                         <div className="text-slate-400 text-xs font-medium flex items-center gap-2">
                            {((isXNext && playerSymbol === 'X') || (!isXNext && playerSymbol === 'O')) ? (
                              <>Your turn</>
                            ) : (
                              <><Loader2 size={12} className="animate-spin" /> AI is thinking...</>
                            )}
                         </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};