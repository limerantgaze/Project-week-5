
import Tile from "./Tile";

function Row({ letters, statuses }) {
  return (
    <div className="row">
      {letters.map((letter, index) => (
        <Tile
          key={index}
          letter={letter}
          status={statuses[index]}
        />
      ))}
    </div>
  );
}

export default Row;
