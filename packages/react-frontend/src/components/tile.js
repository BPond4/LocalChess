import React from "react";

function Tile({ column, row, chessPiece, isDark, showRowLabel, showColLabel }) {
  // Determine the class name based on whether it's a dark or light square
  const squareClass = isDark ? "dark-square" : "light-square";

  return (
    <div className={`square ${squareClass}`}>
      {showRowLabel && <div className="left-center">{row}</div>}
      {showColLabel && <div className="bottom-center">{column}</div>}
      <div className="chess-piece">{chessPiece}</div>
    </div>
  );
}

export default Tile;