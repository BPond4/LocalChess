import React from "react";

function Tile({
  column,
  row,
  chessPiece,
  isDark,
  showRowLabel,
  showColLabel,
  onClick,
  isSelected
}) {
  // Determine the class name based on whether it's a dark or light square
  let squareClass = isDark ? "dark-square" : "light-square";
  squareClass =
    isSelected && isDark ? "selected-dark-square" : squareClass;
  squareClass =
    isSelected && !isDark
      ? "selected-light-square"
      : squareClass;

  const handleClick = () => {
    onClick(column, row);
  };

  return (
    <div
      className={`square ${squareClass}`}
      onClick={handleClick}
    >
      {showRowLabel && <div className="left-center">{row}</div>}
      {showColLabel && (
        <div className="bottom-center">{column}</div>
      )}
      <div className="chess-piece">
        {chessPiece && (
          <img
            src={chessPiece}
            width="90px"
            height="90px"
            alt="piece"
          />
        )}
      </div>
    </div>
  );
}

export default Tile;
