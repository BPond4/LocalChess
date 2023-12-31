import React, { useState, useEffect } from "react";
import "./board.css";
import Tile from "./tile.js";
//import axios from 'axios';

const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Board() {
  let game_id;
  const [grid, setGrid] = useState([]);

  const handleFlipBoard = () => {
    setGrid((prevGrid) => {
      const reversedGrid = [...prevGrid].reverse();
      return reversedGrid.map((data, index) => {
        const isLeft = index % columns.length === 0;
        const isBottom =
          index >= reversedGrid.length - columns.length;

        return {
          ...data,
          showRowLabel: isLeft,
          showColLabel: isBottom
        };
      });
    });
  };

  const updateBoard = () => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      return newGrid;
    });
  };

  function newGame() {
    const game_data = {
      player1: "Nick",
      player2: "Kevin",
      move_list: [],
      winner: "tbd"
    };

    const promise = fetch(
      "https://local-chess.azurewebsites.net/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(game_data)
      }
    );
    console.log("New game promise resolved.");
    return promise;
  }

  function move(fromSquare, toSquare, gid) {
    const promise = fetch(
      "https://local-chess.azurewebsites.net/move",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([fromSquare, toSquare, gid])
      }
    );
    console.log(gid);
    console.log("Promise resolved");
    return promise;
  }

  const handleSquareClick = (column, row) => {
    console.log("handleSquareClick");
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];

      const selectedIndex = newGrid.findIndex(
        (data) => data.column === column && data.row === row
      );

      newGrid[selectedIndex] = {
        ...newGrid[selectedIndex],
        isSelected: true
      };

      const prevTile = newGrid.findIndex(
        (data) =>
          data.isSelected === true &&
          (data.column !== column || data.row !== row)
      );
      console.log("PrevTile: ", newGrid[prevTile]);
      if (prevTile !== -1) {
        if (newGrid[prevTile].hasPiece) {
          console.log(
            "PREVPIECE: ",
            newGrid[prevTile].chessPiece
          );
          const tempChessPiece = newGrid[prevTile].chessPiece;

          move(
            [newGrid[prevTile].row, newGrid[prevTile].column],
            [
              newGrid[selectedIndex].row,
              newGrid[selectedIndex].column
            ],
            game_id
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.message === "Valid move") {
                newGrid[selectedIndex] = {
                  ...newGrid[selectedIndex],
                  chessPiece: tempChessPiece,
                  hasPiece: true,
                  isSelected: false
                };
                newGrid[prevTile] = {
                  ...newGrid[prevTile],
                  chessPiece: null,
                  hasPiece: false,
                  isSelected: false
                };
                newGrid[selectedIndex] = {
                  ...newGrid[selectedIndex],
                  isSelected: false
                };
                updateBoard();
                console.log(result.message);
              } else {
                console.log(result.message);
                return newGrid;
              }
            })
            .catch((error) => {
              console.log("Error: ", error);
            });
        }
        newGrid[prevTile] = {
          ...newGrid[prevTile],
          isSelected: false
        };
      }

      return newGrid;
    });
  };

  function start() {
    let tempGrid = [];
    for (let i = rows.length - 1; i >= 0; i--) {
      for (let j = 0; j < columns.length; j++) {
        const isDark = (i + j + 2) % 2 === 0;
        const rowLabel = rows[i];
        const colLabel = columns[j];
        const showRowLabel = j === 0;
        const showColLabel = i === 0;
        let hasPiece = false;

        let chessPiece = null;

        if (i === 6) {
          chessPiece = "/Chess_pdt60.png";
          hasPiece = true;
        } else if (i === 1) {
          chessPiece = "/Chess_plt60.png";
          hasPiece = true;
        } else if (
          (i === 0 && j === 0) ||
          (i === 0 && j === 7)
        ) {
          chessPiece = "/Chess_rlt60.png";
          hasPiece = true;
        } else if (
          (i === 7 && j === 7) ||
          (i === 7 && j === 0)
        ) {
          chessPiece = "/Chess_rdt60.png";
          hasPiece = true;
        } else if (
          (i === 0 && j === 1) ||
          (i === 0 && j === 6)
        ) {
          chessPiece = "/Chess_nlt60.png";
          hasPiece = true;
        } else if (
          (i === 7 && j === 6) ||
          (i === 7 && j === 1)
        ) {
          chessPiece = "/Chess_ndt60.png";
          hasPiece = true;
        } else if (
          (i === 0 && j === 2) ||
          (i === 0 && j === 5)
        ) {
          chessPiece = "/Chess_blt60.png";
          hasPiece = true;
        } else if (
          (i === 7 && j === 5) ||
          (i === 7 && j === 2)
        ) {
          chessPiece = "/Chess_bdt60.png";
          hasPiece = true;
        } else if (i === 0 && j === 3) {
          chessPiece = "/Chess_qlt60.png";
          hasPiece = true;
        } else if (i === 7 && j === 3) {
          chessPiece = "/Chess_qdt60.png";
          hasPiece = true;
        } else if (i === 0 && j === 4) {
          chessPiece = "/Chess_klt60.png";
          hasPiece = true;
        } else if (i === 7 && j === 4) {
          chessPiece = "/Chess_kdt60.png";
          hasPiece = true;
        }

        tempGrid.push({
          key: `${colLabel}${rowLabel}`,
          column: colLabel,
          row: rowLabel,
          chessPiece: chessPiece,
          isDark: isDark,
          showRowLabel: showRowLabel,
          showColLabel: showColLabel,
          onClick: handleSquareClick,
          hasPiece: hasPiece,
          isSelected: false
        });
      }
    }

    setGrid(tempGrid);
  }

  useEffect(() => {
    newGame()
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        game_id = result;
        start();
      })
      .catch((error) => {
        console.error("Start Error", error);
      });
  }, []);

  return (
    <div>
      <div id="board-class">
        {grid.map((data) => (
          <Tile key={`${data.column}${data.row}`} {...data} />
        ))}
      </div>
      <button onClick={handleFlipBoard}>Flip Board</button>
    </div>
  );
}
