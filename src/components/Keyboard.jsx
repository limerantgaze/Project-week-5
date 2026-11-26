
const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
];

function Keyboard({ onKeyPress, letterStatuses }) {
  return (
    <div className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => {
            const status =
              letterStatuses[key] || "";

            return (
              <button
                key={key}
                className={`key ${status} ${
                  key.length > 1 ? "wide-key" : ""
                }`}
                onClick={() =>
                  onKeyPress(
                    key === "BACKSPACE" ? "BACKSPACE" : key
                  )
                }
                aria-label={key}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
