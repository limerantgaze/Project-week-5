
import { useState, useEffect, useCallback } from "react";
import "./App.css";

import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import GameOverModal from "./components/GameOverModal";

import evaluateGuess from "./utils/evaluateGuess";

function App() {
  // Hidden answer (fixed during development and demonstration)
  const [solutionWord, setSolutionWord] = useState("APPLE");

  // Current letters being typed
  const [currentGuess, setCurrentGuess] = useState("");

  // Previously submitted guesses
  const [pastGuesses, setPastGuesses] = useState([]);

  // Current game condition
  const [gameStatus, setGameStatus] = useState("IN_PROGRESS");

  // Add a letter to the current guess
  const addLetter = useCallback((letter) => {
    if (gameStatus !== "IN_PROGRESS") return;

    if (!/^[A-Z]$/.test(letter)) return;

    setCurrentGuess((previous) => {
      if (previous.length >= 5) {
        return previous;
      }

      return previous + letter;
    });
  }, [gameStatus]);

  // Delete the last letter
  const deleteLetter = useCallback(() => {
    if (gameStatus !== "IN_PROGRESS") return;

    setCurrentGuess((previous) =>
      previous.slice(0, -1)
    );
  }, [gameStatus]);

  // Submit the current guess
  const submitGuess = useCallback(() => {
    if (gameStatus !== "IN_PROGRESS") return;

    if (currentGuess.length !== 5) {
      alert("Please enter exactly five letters!");
      return;
    }

    const newGuesses = [...pastGuesses, currentGuess];

    setPastGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === solutionWord) {
      setGameStatus("WON");
    } else if (newGuesses.length === 6) {
      setGameStatus("LOST");
    }
  }, [
    currentGuess,
    pastGuesses,
    solutionWord,
    gameStatus
  ]);

  // Handle both physical and virtual keyboard inputs
  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== "IN_PROGRESS") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE" || key === "Backspace") {
      deleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  }, [
    gameStatus,
    submitGuess,
    deleteLetter,
    addLetter
  ]);

  // Listen for physical keyboard events
  useEffect(() => {
    function handlePhysicalKeyboard(event) {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleKeyPress("ENTER");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        handleKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    }

    window.addEventListener(
      "keydown",
      handlePhysicalKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handlePhysicalKeyboard
      );
    };
  }, [handleKeyPress]);

  // Calculate the color of every virtual keyboard key
  const letterStatuses = {};

  pastGuesses.forEach((guess) => {
    const results = evaluateGuess(guess, solutionWord);

    guess.split("").forEach((letter, index) => {
      const newStatus = results[index];
      const oldStatus = letterStatuses[letter];

      const priority = {
        absent: 1,
        present: 2,
        correct: 3
      };

      if (
        !oldStatus ||
        priority[newStatus] > priority[oldStatus]
      ) {
        letterStatuses[letter] = newStatus;
      }
    });
  });

  // Restart the game
  function restartGame() {
    setSolutionWord("APPLE");
    setCurrentGuess("");
    setPastGuesses([]);
    setGameStatus("IN_PROGRESS");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>WORDLE</h1>
        <p>Guess the hidden five-letter word!</p>
      </header>

      <main className="game-container">

        <GameBoard
          pastGuesses={pastGuesses}
          currentGuess={currentGuess}
          evaluateGuess={(guess) =>
            evaluateGuess(guess, solutionWord)
          }
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          letterStatuses={letterStatuses}
        />

        <div className="attempt-counter">
          Attempts used: {pastGuesses.length} / 6
        </div>

      </main>

      <GameOverModal
        gameStatus={gameStatus}
        solutionWord={solutionWord}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;
