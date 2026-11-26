
function evaluateGuess(guess, solution) {
  const result = Array(5).fill("absent");
  const remainingLetters = {};

  // First pass: identify correct-position letters
  for (let i = 0; i < 5; i++) {
    if (guess[i] === solution[i]) {
      result[i] = "correct";
    } else {
      const letter = solution[i];
      remainingLetters[letter] =
        (remainingLetters[letter] || 0) + 1;
    }
  }

  // Second pass: identify letters in the wrong position
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") {
      continue;
    }

    const letter = guess[i];

    if (remainingLetters[letter] > 0) {
      result[i] = "present";
      remainingLetters[letter]--;
    }
  }

  return result;
}

export default evaluateGuess;
