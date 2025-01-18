import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import redux hooks

const PatternRecallGame = () => {
  const [tiles, setTiles] = useState(Array(9).fill(false));
  const [pattern, setPattern] = useState([]);
  const [playerPattern, setPlayerPattern] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Fetch token, userCategory from redux store or local storage
  const token = useSelector(state => state.auth.token); // Assuming token is stored in auth slice
  const userCategory = useSelector(state => state.user.category); // Assuming user category is stored in user slice

  const dispatch = useDispatch();

  const generatePattern = () => {
    const newPattern = [];
    for (let i = 0; i < 5; i++) {
      newPattern.push(Math.floor(Math.random() * 9));
    }
    setPattern(newPattern);
  };

  const showPattern = async () => {
    setIsShowingPattern(true);
    for (const tileIndex of pattern) {
      setTiles(prev => {
        const newTiles = [...prev];
        newTiles[tileIndex] = true;
        return newTiles;
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      setTiles(prev => {
        const newTiles = [...prev];
        newTiles[tileIndex] = false;
        return newTiles;
      });
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsShowingPattern(false);
  };

  const handleTileClick = (index) => {
    if (isShowingPattern || gameOver) return;

    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);

    if (newPlayerPattern[newPlayerPattern.length - 1] !== pattern[newPlayerPattern.length - 1]) {
      setGameOver(true);
      // Dispatch action for game over, save score to redux store
      dispatch({ type: 'GAME_OVER', payload: { score } });
      return;
    }

    if (newPlayerPattern.length === pattern.length) {
      setScore(score + 1);
      setPlayerPattern([]);
      generatePattern();
    }
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setPlayerPattern([]);
    generatePattern();
  };

  useEffect(() => {
    if (pattern.length > 0 && !isShowingPattern) {
      showPattern();
    }
  }, [pattern]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8">Pattern Recall Game</h1>
      <p className="text-xl font-medium mb-6">Score: <span className="text-yellow-400">{score}</span></p>
      <p className="text-lg font-medium mb-6">Category: <span className="text-yellow-400">{userCategory}</span></p> {/* Display user category */}
      <div className="grid grid-cols-3 gap-4">
        {tiles.map((highlighted, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={`w-24 h-24 rounded-md flex items-center justify-center transition-all duration-300 
            ${highlighted ? 'bg-red-500' : 'bg-gray-300'} 
            ${!isShowingPattern && !gameOver ? 'hover:bg-gray-400 cursor-pointer' : ''}`}
          />
        ))}
      </div>
      {gameOver && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold mb-4">Game Over! Your final score is <span className="text-yellow-400">{score}</span>.</p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-600 transition-all duration-300"
          >
            Play Again
          </button>
        </div>
      )}
      {!gameOver && pattern.length === 0 && (
        <button
          onClick={startGame}
          className="mt-6 px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-md hover:bg-green-600 transition-all duration-300"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default PatternRecallGame;
