
import Row from "./Row";

function GameBoard({
  pastGuesses,
  currentGuess,
  evaluateGuess
}) {
  return (
    <div className="game-board">
      {Array.from({ length: 6 }).map((_, rowIndex) => {
        let letters = "";
        let statuses = Array(5).fill("");

        if (rowIndex < pastGuesses.length) {
          letters = pastGuesses[rowIndex];
          statuses = evaluateGuess(letters);
        } else if (rowIndex === pastGuesses.length) {
          letters = currentGuess;
        }

        const letterArray = Array.from(
          { length: 5 },
          (_, i) => letters[i] || ""
        );

        return (
          <Row
            key={rowIndex}
            letters={letterArray}
            statuses={statuses}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;
