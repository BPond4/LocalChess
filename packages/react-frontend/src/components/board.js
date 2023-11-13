import React, { useState } from "react";
import "./board.css";
import Tile from "./tile.js"; 

const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];



export default function Board() {
    const [isFlipped, setIsFlipped] = useState(false);

    function flipBoard(grid) {
        // Reverse the grid if isFlipped is true
        if (isFlipped) {
          return grid.reverse();
        }
        return grid;
      }

    const handleBoardClick = () => {
        // Toggle the isFlipped state when the board is clicked
        setIsFlipped(!isFlipped);
    };

    let grid = [];

    
    for (let i = rows.length - 1; i >= 0; i--) {
        for (let j = 0; j < columns.length; j++) {
            const isDark = (i + j + 2) % 2 === 0;
            const rowLabel = rows[i];
            const colLabel = columns[j];
            const showRowLabel = ((j === 0 && !isFlipped) || (j === columns.length-1 && isFlipped));
            const showColLabel = ((i === rows.length - 1 && isFlipped)||(i===0 && !isFlipped));
        
            // Render a Tile component for each square
            grid.push(
                <Tile
                    key={`${colLabel}${rowLabel}`}
                    column={colLabel}
                    row={rowLabel}
                    chessPiece={null}
                    isDark={isDark}
                    showRowLabel={showRowLabel}
                    showColLabel={showColLabel}
                />
            );
        }
    }

    grid = flipBoard(grid);

    return (
        <div id="board-class" onClick={handleBoardClick}>
            {grid}
        </div>
    );
}