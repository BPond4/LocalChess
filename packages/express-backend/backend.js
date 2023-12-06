//import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import Game from "./game-service.js";
//const express = require('express');
//const cors = require('cors');

const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000", // Replace with the actual domain of your frontend
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   // credentials: true,
//   optionsSuccessStatus: 204
// };

app.use(cors());

app.use(express.json());

const ROW_1 = 0;
const ROW_2 = 1;
// const ROW_3 = 2;
const ROW_4 = 3;
const ROW_5 = 4;
// const ROW_6 = 5;
const ROW_7 = 6;
const ROW_8 = 7;

const COL_A = 0;
const COL_B = 1;
const COL_C = 2;
const COL_D = 3;
const COL_E = 4;
const COL_F = 5;
const COL_G = 6;
const COL_H = 7;

const BOARD_HEIGHT = 8;
const BOARD_WIDTH = 8;

const WHITE = "white";
const BLACK = "black";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const QUEEN = "queen";
const KING = "king";
const PAWN = "pawn";
const IN_PROGRESS = "in_progress";
const FINISHED = "finished";

const ONE_ROW_BEFORE = -1;
const ONE_ROW_AFTER = 1;
const ONE_COL_BEFORE = -1;
const ONE_COL_AFTER = 1;

const ONE_COL_DIFFERENCE = 1;
// const ONE_ROW_DIFFERENCE = 1;

const TWO_HORIZONTAL_SQUARES = 2;
const ONE_VERTICAL_SQUARE = 1;

const TWO_VERTICAL_SQUARES = 2;
const ONE_HORIZONTAL_SQUARE = 1;

// const BAD_REQUEST = 400;
// const PORT_NUMBER = 300;

const port = 8000;

/* This function creates the appropiate piece type with the appropiate color
and position depending on the row and column it is given. 
First, the function checks if the row given is the top most or bottom most
row (the rows where the initial pieces are the non-pawn pieces). If this is 
the case, it then checks the piece color depending on whether the row is at the
top or bottom. If it is at the bottom, then the piece must be white. Else, it 
must be black. In Columns A and H, the piece created must be a rook. In 
Columns B and G, the piece created must be a knight. In Columns C and F,
the piece must be a bishop. In Column D, the piece must be a Queen. In Column
E, the piece must be a king.

In addition to creating non-pawn pieces, this function also creates pawn pieces.
It first checks if the rows are equal to the rows where pawns start (Row 2 and
Row 1). If this is the case, it then determines the pawn color depnding on the row.

This function returns the piece created with its pieceType, pieceColor, and position.
*/
function createPieceForInitialPosition(row, col) {
  let pieceType = null;
  let pieceColor = null;

  if (row === ROW_1 || row === ROW_8) {
    pieceColor = row === ROW_1 ? WHITE : BLACK;
    switch (col) {
      case COL_A:
      case COL_H:
        pieceType = ROOK;
        break;
      case COL_B:
      case COL_G:
        pieceType = KNIGHT;
        break;
      case COL_C:
      case COL_F:
        pieceType = BISHOP;
        break;
      case COL_D:
        pieceType = QUEEN;
        break;
      case COL_E:
        pieceType = KING;
        break;
    }
  } else if (row === ROW_2 || row === ROW_7) {
    pieceType = PAWN;
    pieceColor = row === ROW_2 ? WHITE : BLACK;
  }

  let piece = {
    type: pieceType,
    color: pieceColor,
    position: { row, col }
  };
  return piece;
}

/*This function is used to create the initial pieces in their initial positions
at the start of the game. 

This function first creates a 2D 8x8 array to mimic the chessboard.
It then loops through all the 64 squares of the chessboard. If the row
being traversed is Row 1 or Row 8, this function uses createPieceForInitialPosition
to create non-pawn piece in all the columns. createPieceForInitialPosition returns
the appropiate piece with the appropiate color and the variable board stores that piece
in the appropiate location. 
If the row being traversed is Row 1 or Row 8, this function uses createPieceForInitialPosition
to create pawn pieces in all the columns. 
If the rows being traversed are none of the previously mentioned rows, the board populates these
positions with a null value.*/
function createInitialBoard() {
  let board = new Array(BOARD_HEIGHT);

  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    board[row] = new Array(BOARD_WIDTH);
  }

  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    for (let col = COL_A; col < BOARD_WIDTH; col++) {
      if (row === ROW_1 || row === ROW_8) {
        board[row][col] = createPieceForInitialPosition(
          row,
          col
        );
      } else if (row === ROW_2 || row === ROW_7) {
        board[row][col] = createPieceForInitialPosition(
          row,
          col
        );
      } else {
        board[row][col] = null;
      }
    }
  }

  return board;
}

/*This function is used to start a new game.
The board is set to its initalState.
The current player selected is white (white moves first in chess).
The result of the game is in progress (nobody won or lost so far).
The history is left blank (no moves have been made yet). */
function initializeNewGame(gameid) {
  const initialBoard = createInitialBoard();

  const game = {
    board: initialBoard,
    currentPlayer: WHITE,
    result: IN_PROGRESS,
    lastMoveHistory: [],
    lastBoardHistory: [],
    gid: gameid
  };

  return game;
}

/*The function is used to check if the move a player made can be considered
a valid move. It checks if the movement is within bounds of the chessboard.
It then checks if the piece selected belongs to the player. Finally, it checks
if the piece is allowed to move to toSquare based on its piece rules. */
function isValidMove(game, fromSquare, toSquare) {
  const { board, currentPlayer } = game;

  let row = fromSquare[0];
  let col = fromSquare[1];

  for (let row2 = ROW_1; row2 < BOARD_HEIGHT; row2++) {
    for (let col2 = COL_A; col2 < BOARD_WIDTH; col2++) {
      if (board[row2][col2]) {
        // console.log(board[row2][col2].color + " " + board[row2][col2].type);
      } else {
        //console.log("("+row2+", "+col2+")");
      }
    }
  }
  if (!isValidSquare(fromSquare) || !isValidSquare(toSquare)) {
    //console.log("isValidSquare");
    return false;
  }

  // let fromPiece = board[fromSquare[0]][fromSquare[1]];

  if (!board[row][col]) {
    //console.log("("+row+", "+col+")");
    return false;
  }

  if (board[row][col].color !== currentPlayer) {
    // console.log("fromPiece.color = " + board[row][col].color);
    // console.log("currentPlayer = " + currentPlayer);
    return false;
  }

  if (
    !isValidPieceMove(
      game,
      fromSquare,
      toSquare,
      board[row][col]
    )
  ) {
    // console.log("isValidPieceMove");
    return false;
  }

  return true;
}

/*This function checks whether the destination to move a piece is within bounds
of the chessboard. If it is within bounds, the function returns true. Else, it
returns false. */
function isValidSquare(square) {
  const row = square[0];
  const col = square[1];

  if (
    row >= ROW_1 &&
    row < BOARD_HEIGHT &&
    col >= COL_A &&
    col < BOARD_WIDTH
  ) {
    return true;
  } else {
    return false;
  }
}

/*The isBlockedDiagonal function serves to determine if there are any obstructing pieces in the diagonal path between two given chessboard squares. 
This function takes as input the coordinates of the starting square (fromRow and fromCol), the target square (toRow and toCol), and the board, 
which represents the current state of the chessboard. It calculates the direction of movement by comparing the target square's coordinates with the 
starting square and then iterates along the diagonal path, checking each square in between. 
If it encounters a piece on the path, it returns true, indicating that the diagonal path is blocked. 
If the function reaches the target square without encountering any pieces, it returns false, signifying that the diagonal path is clear for movement. 
This function is particularly useful for implementing movement rules for pieces that can move diagonally, such as the bishop and queen in a chess game.
*/
function isBlockedDiagonal(
  fromRow,
  fromCol,
  toRow,
  toCol,
  board
) {
  let rowDirection =
    toRow > fromRow ? ONE_ROW_AFTER : ONE_ROW_BEFORE;
  let colDirection =
    toCol > fromCol ? ONE_COL_AFTER : ONE_COL_BEFORE;

  let row_iterator = fromRow + rowDirection;
  let col_iterator = fromCol + colDirection;

  while (row_iterator !== toRow && col_iterator !== toCol) {
    if (board[row_iterator][col_iterator]) {
      return true;
    }
    row_iterator += rowDirection;
    col_iterator += colDirection;
  }

  return false;
}

/*
The isBlockedHorizontal function is designed to evaluate and determine the feasibility of horizontal movement 
between two columns on a chessboard. 
It takes into account the starting row and column (fromRow and fromCol) as well as the target row and column 
(toRow and toCol) as input parameters. 
The function begins by comparing the starting and target columns to determine the direction of the movement. 
If the target column is greater than the starting column, the function iterates through the squares between these 
columns, checking for any obstructing pieces. 
In case it encounters an obstruction during the iteration, it returns true, indicating that the horizontal path 
is obstructed. 
Conversely, if the target column is less than the starting column, the function iterates in the opposite direction 
to check for obstructions. 
If no obstructions are found during the iteration, the function returns false, 
indicating that the horizontal movement is valid and unobstructed. 
This function is crucial for implementing movement rules for pieces like the rook and queen in a chess game, 
as they can move horizontally along columns.
*/

function isBlockedHorizontal(
  fromRow,
  fromCol,
  toRow,
  toCol,
  board
) {
  if (fromCol < toCol) {
    for (let i = fromCol + ONE_COL_AFTER; i < toCol; i++) {
      if (board[fromRow][i] != null) {
        return true;
      }
    }
    return false;
  }
  if (fromCol > toCol) {
    for (let i = toCol + ONE_COL_AFTER; i < fromCol; i++) {
      if (board[fromRow][i] != null) {
        return true;
      }
    }
    return false;
  }
}

/*
The isBlockedVertical function is designed to assess the viability of vertical movement, specifically from one row 
to another on a chessboard. 
This function takes as parameters the starting row and column (fromRow and fromCol) and the target row and 
column (toRow and toCol). 
The function begins by comparing the starting row and the target row to determine the direction of movement. 
If the target row is greater than the starting row, the function iterates through the squares between the 
starting and target rows, checking for any obstructing pieces along the same column. 
Should an obstruction be found during the iteration, the function returns true, 
indicating that the vertical path is blocked. 
Conversely, if the target row is less than the starting row, the function iterates in the 
opposite direction to examine for obstructions. 
If no obstructions are encountered during the iteration, the function returns false, 
signifying that the vertical movement is permissible and unobstructed. 
This function is invaluable for implementing movement rules for chess pieces like the rook and queen, 
as they are capable of moving vertically along rows on the chessboard.
*/

function isBlockedVertical(
  fromRow,
  fromCol,
  toRow,
  toCol,
  board
) {
  if (fromRow < toRow) {
    for (let i = fromRow + ONE_ROW_AFTER; i < toRow; i++) {
      if (board[i][fromCol] != null) {
        return true;
      }
    }
    return false;
  }
  if (fromRow > toRow) {
    for (let i = toRow + ONE_ROW_AFTER; i < fromRow; i++) {
      if (board[i][fromCol] != null) {
        return true;
      }
    }
    return false;
  }
}

/*
The isValidPieceMove function is a fundamental component of a LocalChess game that evaluates the validity of a 
move for a given chess piece, considering the current game state. 
It takes several parameters, including the game state (game), the starting and target squares 
(fromSquare and toSquare), and the piece being moved (piece). 
Within the function, it extracts relevant information such as the type and color of the piece, 
as well as the coordinates of the source and destination squares. 
The function then proceeds to apply specific movement rules for each type of chess piece, 
including pawns, rooks, knights, bishops, queens, and kings.

For pawns, it checks for valid pawn moves, considering factors like direction, capturing, and initial double-step 
moves. 
Rooks, knights, bishops, queens, and kings each have their unique movement rules, 
and the function correctly applies these rules to determine the legitimacy of their moves. 
It also employs helper functions like isBlockedVertical, isBlockedHorizontal, and isBlockedDiagonal to check for 
obstructions in the path of movement, ensuring that the move aligns with the rules of chess. 
The function returns true if the move is valid and allowed, and false if the move is invalid or obstructed. 
This comprehensive function plays a crucial role in enforcing the rules of LocalChess 
and enabling the smooth flow of a LocalChess game.
*/
function isValidPieceMove(game, fromSquare, toSquare, piece) {
  const { board } = game;
  const { type, color } = piece;
  const fromRow = fromSquare[0];
  const fromCol = fromSquare[1];
  const toRow = toSquare[0];
  const toCol = toSquare[1];

  if (fromRow === toRow && fromCol === toCol) {
    return false;
  }

  if (
    board[toRow][toCol] &&
    board[toRow][toCol].color === color
  ) {
    return false;
  }

  switch (type) {
    case PAWN: {
      if (color === WHITE) {
        let nextRow = fromRow + ONE_ROW_AFTER;
        if (
          toRow == nextRow &&
          fromCol === toCol &&
          board[toRow][toCol] == null
        ) {
          return true;
        } else if (
          fromRow === ROW_2 &&
          toRow == ROW_4 &&
          fromCol === toCol &&
          board[toRow][toCol] == null
        ) {
          return true;
        } else if (
          toRow == nextRow &&
          Math.abs(fromCol - toCol) === ONE_COL_DIFFERENCE &&
          board[toRow][toCol] &&
          board[toRow][toCol].color === BLACK
        ) {
          return true;
        }
        return false;
      } else if (color === BLACK) {
        let nextRow = fromRow + ONE_ROW_BEFORE;
        if (
          toRow == nextRow &&
          fromCol === toCol &&
          board[toRow][toCol] == null
        ) {
          return true;
        } else if (
          fromRow === ROW_7 &&
          toRow == ROW_5 &&
          fromCol === toCol &&
          board[toRow][toCol] == null
        ) {
          return true;
        } else if (
          toRow == nextRow &&
          Math.abs(fromCol - toCol) === ONE_COL_DIFFERENCE &&
          board[toRow][toCol] &&
          board[toRow][toCol].color === WHITE
        ) {
          return true;
        }
        return false;
      }
      break;
    }
    case ROOK: {
      if (fromRow === toRow) {
        return !isBlockedHorizontal(
          fromRow,
          fromCol,
          toRow,
          toCol,
          board
        );
      } else if (fromCol == toCol) {
        return !isBlockedVertical(
          fromRow,
          fromCol,
          toRow,
          toCol,
          board
        );
      }

      return false;

      //break;
    }
    case KNIGHT: {
      let knightRowDiff = Math.abs(fromRow - toRow);
      let knightColDiff = Math.abs(fromCol - toCol);

      if (
        (knightRowDiff === TWO_VERTICAL_SQUARES &&
          knightColDiff === ONE_HORIZONTAL_SQUARE) ||
        (knightRowDiff == ONE_VERTICAL_SQUARE &&
          knightColDiff == TWO_HORIZONTAL_SQUARES)
      ) {
        return true;
      }
      return false;
      //break;
    }
    case BISHOP: {
      let bishopRowDiff = Math.abs(fromRow - toRow);
      let bishopColDiff = Math.abs(fromCol - toCol);

      if (bishopRowDiff === bishopColDiff) {
        if (
          !isBlockedDiagonal(
            fromRow,
            fromCol,
            toRow,
            toCol,
            board
          )
        ) {
          return true;
        }
      }

      return false;

      //break;
    }
    case QUEEN: {
      if (fromRow === toRow) {
        return !isBlockedHorizontal(
          fromRow,
          fromCol,
          toRow,
          toCol,
          board
        );
      }

      if (fromCol == toCol) {
        return !isBlockedVertical(
          fromRow,
          fromCol,
          toRow,
          toCol,
          board
        );
      }

      let queenRowDiff = Math.abs(fromRow - toRow);
      let queenColDiff = Math.abs(fromCol - toCol);

      if (queenRowDiff === queenColDiff) {
        if (
          !isBlockedDiagonal(
            fromRow,
            fromCol,
            toRow,
            toCol,
            board
          )
        ) {
          return true;
        }
      }

      return false;

      //break;
    }
    case KING: {
      let kingRowDiff = Math.abs(fromRow - toRow);
      let kingColDiff = Math.abs(fromCol - toCol);

      if (kingRowDiff <= 1 && kingColDiff <= 1) {
        return true;
      }

      return false;

      //break;
    }
    default:
      return false;
  }
}

/*This function finds the player's king by traversing through the whole board. 
If the player's king can be found, the king is still not captured. 
If the player's king can not be found, then the king has been captured. 

This variant of chess does not have checks or checkmate. A player wins instead
by capturing the enemy king.*/

function findKing(board, player) {
  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    for (let col = COL_A; col < BOARD_WIDTH; col++) {
      if (board[row] && board[row][col] !== null) {
        const piece = board[row][col];
        if (
          piece &&
          piece.type === KING &&
          piece.color === player
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/* This function is used to update the current game state and board. 
It also switches been both players' turns as well as pushing the most
recent move to history. */

function updateGameState(game, fromSquare, toSquare) {
  const { board, currentPlayer } = game;
  const fromRow = fromSquare[0];
  const fromCol = fromSquare[1];
  const toRow = toSquare[0];
  const toCol = toSquare[1];

  const pieceToMove = board[fromRow][fromCol];
  board[toRow][toCol] = pieceToMove;
  board[fromRow][fromCol] = null;

  game.currentPlayer = currentPlayer === WHITE ? BLACK : WHITE;
  //console.log("Current player");

  game.lastMoveHistory.push({
    from: fromSquare,
    to: toSquare,
    piece: pieceToMove
  });

  // Game.updateGame(game.gid, game.lastMoveHistory)
  //   .then((result) => {
  //     console.log("game updated in database");
  //   })
  //   .catch((error) => {
  //     console.error("error updating game in database", error);
  //   });

  game.lastBoardHistory.push(board);
}

/*This function checks if the game is finished or not.
If the current player's king can be found, the game is still in progress.
Else, the game is finished (the player's king has been captured.) */
function checkGameResult(game) {
  const { board, currentPlayer } = game;
  if (findKing(board, currentPlayer)) {
    return IN_PROGRESS;
  } else {
    return FINISHED;
  }
}

let game = null;

app.post("/start", (req, res) => {
  let new_game = req.body;
  Game.createGame(new_game)
    .then(result => {
      game = initializeNewGame(result._id);
      res.status(201).send(result._id);
    })
    .catch((error) => {
      console.log(error);
    })
});

app.post("/move", (req, res) => {
  //const { fromSquare, toSquare } = req.body;

  let fromSquare = req.body[0];
  let toSquare = req.body[1];

  fromSquare[0] = parseInt(fromSquare[0], 10) - 1;
  toSquare[0] = parseInt(toSquare[0], 10) - 1;

  if (toSquare[1] == "a") {
    toSquare[1] = COL_A;
  }
  if (toSquare[1] == "b") {
    toSquare[1] = COL_B;
  }
  if (toSquare[1] == "c") {
    toSquare[1] = COL_C;
  }
  if (toSquare[1] == "d") {
    toSquare[1] = COL_D;
  }
  if (toSquare[1] == "e") {
    toSquare[1] = COL_E;
  }
  if (toSquare[1] == "f") {
    toSquare[1] = COL_F;
  }
  if (toSquare[1] == "g") {
    toSquare[1] = COL_G;
  }
  if (toSquare[1] == "h") {
    toSquare[1] = COL_H;
  }

  if (fromSquare[1] == "a") {
    fromSquare[1] = COL_A;
  }
  if (fromSquare[1] == "b") {
    fromSquare[1] = COL_B;
  }
  if (fromSquare[1] == "c") {
    fromSquare[1] = COL_C;
  }
  if (fromSquare[1] == "d") {
    fromSquare[1] = COL_D;
  }
  if (fromSquare[1] == "e") {
    fromSquare[1] = COL_E;
  }
  if (fromSquare[1] == "f") {
    fromSquare[1] = COL_F;
  }
  if (fromSquare[1] == "g") {
    fromSquare[1] = COL_G;
  }
  if (fromSquare[1] == "h") {
    fromSquare[1] = COL_H;
  }
  // fromSquare[0] = fromSquare[1];
  // fromSquare[1] = temp;

  // toSquare[0] = toSquare[1];
  // toSquare[1] = temp2;

  // console.log(fromSquare);
  // console.log(toSquare);
  // console.log("-------");

  const gameResult = checkGameResult(game);

  if (
    isValidMove(game, fromSquare, toSquare) &&
    gameResult == IN_PROGRESS
  ) {
    updateGameState(game, fromSquare, toSquare);
    // res.json({ game: game, result: gameResult });
    res.json({ message: "Valid move" });
  } else {
    //res.status(BAD_REQUEST).json({ error: 'Invalid move' });
    res.json({ message: "Invalid move" });
  }
});

// app.get('/', (req, res) => {
//   res.send("Hello World");
// });

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});

export default {
  createPieceForInitialPosition,
  createInitialBoard,
  initializeNewGame,
  isValidMove,
  isValidSquare,
  isValidPieceMove,
  findKing,
  updateGameState,
  checkGameResult
};
