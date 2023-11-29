import React, { useState } from "react";
import "./board.css";
import Tile from "./tile.js"; 

const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];



export default function Board() {
    const [isFlipped, setIsFlipped] = useState(false);

<<<<<<< Updated upstream
    function flipBoard(grid) {
        // Reverse the grid if isFlipped is true
        if (isFlipped) {
          return grid.reverse();
        }
        return grid;
=======
  const handleFlipBoard = () => {
    setGrid((prevGrid) => {
      const reversedGrid = [...prevGrid].reverse();
      return reversedGrid.map((data, index) => {
        const isLeft = index % columns.length === 0;
        const isBottom = index >= reversedGrid.length - columns.length;

        return { ...data, showRowLabel: isLeft, showColLabel: isBottom };
      });
    });
  };


  function move(fromSquare, toSquare) {
    const promise = fetch('http://localhost:8000/move' , {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body:  JSON.stringify([fromSquare, toSquare])
    });

    return promise;
  }
  
  const handleSquareClick = (column, row) => {
    console.log("handleSquareClick");
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];

      const selectedIndex = newGrid.findIndex(
        (data) => data.column === column && data.row === row
      );

      newGrid[selectedIndex] = { ...newGrid[selectedIndex], isSelected: true };

      const prevTile = newGrid.findIndex(
        (data) => data.isSelected === true && (data.column !== column || data.row !== row)
      );
      console.log("PrevTile: ",newGrid[prevTile]);
      if (prevTile!==-1) {
        if (newGrid[prevTile].hasPiece) {
          console.log("PREVPIECE: ",newGrid[prevTile].chessPiece);
          const tempChessPiece = newGrid[prevTile].chessPiece;
          move([newGrid[prevTile].row, newGrid[prevTile].column], [newGrid[selectedIndex].row, newGrid[selectedIndex].column])
            .then(response => response.json())
            .then(result => {
              if(result.message== "Valid move"){
                console.log(result.message);
                newGrid[selectedIndex] = { ...newGrid[selectedIndex], chessPiece: tempChessPiece, hasPiece: true };
                newGrid[prevTile] = { ...newGrid[prevTile], chessPiece: null, hasPiece: false };
              }
              else{
                console.log(result.message);
              }
          })
       .catch(error => {
          console.log("Error: ", error);
       });
     }
        newGrid[selectedIndex] = { ...newGrid[selectedIndex], isSelected: false };
        newGrid[prevTile] = { ...newGrid[prevTile], isSelected: false };
>>>>>>> Stashed changes
      }

    const handleBoardClick = () => {
        // Toggle the isFlipped state when the board is clicked
        setIsFlipped(!isFlipped);
    };

<<<<<<< Updated upstream
    let grid = [];
=======
  //  const handleSquareClick = (column, row) => {
  //   setGrid((prevGrid) => {
  //     const newGrid = [...prevGrid];

  //     const selectedIndex = newGrid.findIndex(
  //       (data) => data.column === column && data.row === row
  //     );

  //     newGrid[selectedIndex] = { ...newGrid[selectedIndex], isSelected: true };

  //     const prevTile = newGrid.findIndex(
  //       (data) => data.isSelected === true && (data.column !== column || data.row !== row)
  //     );
  //     console.log("PrevTile: ",newGrid[prevTile]);
  //     if (prevTile!==-1) {
  //       if (newGrid[prevTile].hasPiece) {
  //         console.log("PREVPIECE: ",newGrid[prevTile].chessPiece);
  //         const tempChessPiece = newGrid[prevTile].chessPiece;
  //         newGrid[selectedIndex] = { ...newGrid[selectedIndex], chessPiece: tempChessPiece, hasPiece: true };

  //         newGrid[prevTile] = { ...newGrid[prevTile], chessPiece: null, hasPiece: false };
  //         handleFlipBoard();
  //       }
  //       newGrid[selectedIndex] = { ...newGrid[selectedIndex], isSelected: false };
  //       newGrid[prevTile] = { ...newGrid[prevTile], isSelected: false };
  //     }

  //     return newGrid;
  //   });
  // };

>>>>>>> Stashed changes

    
    for (let i = rows.length - 1; i >= 0; i--) {
        for (let j = 0; j < columns.length; j++) {
            const isDark = (i + j + 2) % 2 === 0;
            const rowLabel = rows[i];
            const colLabel = columns[j];
            const showRowLabel = ((j === 0 && !isFlipped) || (j === columns.length-1 && isFlipped));
            const showColLabel = ((i === rows.length - 1 && isFlipped)||(i===0 && !isFlipped));

            let chessPiece = null;

            if (i === 6) {
                chessPiece = "/Chess_pdt60.png";
            } else if (i === 1) {
                chessPiece = "/Chess_plt60.png";
            } else if((i===0 && j===0)||(i===0 && j===7)){
                chessPiece = "/Chess_rlt60.png";
            } else if((i===7 && j===7)||(i===7 && j===0)){
                chessPiece = "/Chess_rdt60.png";
            } else if((i===0 && j===1)||(i===0 && j===6)){
                chessPiece = "/Chess_nlt60.png";
            } else if((i===7 && j===6)||(i===7 && j===1)){
                chessPiece = "/Chess_ndt60.png";
            } else if((i===0 && j===2)||(i===0 && j===5)){
                chessPiece = "/Chess_blt60.png";
            } else if((i===7 && j===5)||(i===7 && j===2)){
                chessPiece = "/Chess_bdt60.png";
            } else if((i===0 && j===3)){
                chessPiece = "/Chess_qlt60.png";
            } else if((i===7 && j===3)){
                chessPiece = "/Chess_qdt60.png";
            } else if((i===0 && j===4)){
                chessPiece = "/Chess_klt60.png";
            } else if((i===7 && j===4)){
                chessPiece = "/Chess_kdt60.png";
            }
            
        
            // Render a Tile component for each square
            grid.push(
                <Tile
                    key={`${colLabel}${rowLabel}`}
                    column={colLabel}
                    row={rowLabel}
                    chessPiece={chessPiece}
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