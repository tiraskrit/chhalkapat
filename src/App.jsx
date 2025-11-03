import React, { useState, useEffect } from 'react';
import { Shuffle, Users, Eye, EyeOff } from 'lucide-react';

// Sample words - can be loaded from JSON
const WORD_LIST = [
  "Pizza", "Banana", "Guitar", "Ocean", "Mountain", "Coffee", "Dragon",
  "Rainbow", "Sunset", "Castle", "Robot", "Unicorn", "Rocket", "Diamond",
  "Thunder", "Butterfly", "Volcano", "Galaxy", "Treasure", "Wizard",
  "Phoenix", "Carnival", "Compass", "Lighthouse", "Orchestra", "Pyramid"
];

const ChhalKapat = () => {
  const [gameState, setGameState] = useState('setup'); // setup, revealing, started
  const [numPlayers, setNumPlayers] = useState(3);
  const [numImposters, setNumImposters] = useState(1);
  const [playerNames, setPlayerNames] = useState(['', '', '']);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState(null);

  useEffect(() => {
    setPlayerNames(Array(numPlayers).fill(''));
  }, [numPlayers]);

  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    // Validate all players have names
    if (playerNames.some(name => !name.trim())) {
      alert('Please enter names for all players!');
      return;
    }

    // Select random word
    const selectedWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

    // Randomly assign imposters
    const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
    const shuffled = [...playerIndices].sort(() => Math.random() - 0.5);
    const imposterIndices = shuffled.slice(0, numImposters);

    // Create game data with random order
    const randomOrder = [...playerIndices].sort(() => Math.random() - 0.5);
    const players = randomOrder.map(i => ({
      name: playerNames[i],
      isImposter: imposterIndices.includes(i),
      word: imposterIndices.includes(i) ? 'IMPOSTER' : selectedWord
    }));

    // Pick random starting player (non-imposter)
    const nonImposters = players.filter(p => !p.isImposter);
    const starter = nonImposters[Math.floor(Math.random() * nonImposters.length)];

    setGameData({ players, word: selectedWord });
    setStartingPlayer(starter.name);
    setGameState('revealing');
    setCurrentPlayerIndex(0);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < gameData.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsRevealing(false);
    } else {
      setGameState('started');
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setCurrentPlayerIndex(0);
    setIsRevealing(false);
    setGameData(null);
    setStartingPlayer(null);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">ChhalKapat</h1>
            <p className="text-gray-600">Find the imposter among you!</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Number of Players
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={numPlayers}
                onChange={(e) => setNumPlayers(parseInt(e.target.value) || '')}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 3) setNumPlayers(3);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Eye className="inline w-4 h-4 mr-1" />
                Number of Imposters
              </label>
              <input
                type="number"
                min="1"
                max={numPlayers - 1}
                value={numImposters}
                onChange={(e) => setNumImposters(parseInt(e.target.value) || '')}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) setNumImposters(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Player Names
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playerNames.map((name, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-200"
            >
              <Shuffle className="inline w-5 h-5 mr-2" />
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'revealing') {
    const currentPlayer = gameData.players[currentPlayerIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-white text-lg mb-2">
              Player {currentPlayerIndex + 1} of {gameData.players.length}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{currentPlayer.name}</h2>
          </div>

          <div
            className="relative bg-white rounded-3xl shadow-2xl p-8 cursor-pointer select-none"
            onMouseDown={() => setIsRevealing(true)}
            onMouseUp={() => setIsRevealing(false)}
            onMouseLeave={() => setIsRevealing(false)}
            onTouchStart={() => setIsRevealing(true)}
            onTouchEnd={() => setIsRevealing(false)}
            style={{
              transform: isRevealing ? 'scale(1.05) translateY(-10px)' : 'scale(1)',
              transition: 'all 0.3s ease',
              boxShadow: isRevealing ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
              {!isRevealing ? (
                <>
                  <EyeOff className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-400 text-sm font-medium">Hold to reveal your word</p>
                </>
              ) : (
                <>
                  <div className={`text-5xl font-bold mb-4 ${currentPlayer.isImposter ? 'text-red-600' : 'text-purple-600'}`}>
                    {currentPlayer.word}
                  </div>
                  {currentPlayer.isImposter && (
                    <p className="text-red-500 text-sm">You are the imposter!</p>
                  )}
                </>
              )}
            </div>
          </div>

          <button
            onClick={nextPlayer}
            className="w-full mt-6 bg-white text-purple-600 font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-200"
          >
            {currentPlayerIndex < gameData.players.length - 1 ? 'Next Player' : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'started') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Started!</h2>
            <p className="text-xl text-gray-600 mb-2">
              <span className="font-bold text-red-600">{numImposters}</span> imposter{numImposters > 1 ? 's' : ''} among you
            </p>
            <p className="text-lg text-gray-700 mt-4">
              <span className="font-bold text-green-600">{startingPlayer}</span> starts the discussion!
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-600 text-sm">
              Discuss and figure out who the imposter is! The imposter doesn't know the word.
            </p>
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-200"
          >
            New Game
          </button>
        </div>
      </div>
    );
  }
};

export default ChhalKapat;