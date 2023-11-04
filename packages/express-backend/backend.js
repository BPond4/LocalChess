const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const ROW_1 = 0;
const ROW_2 = 1;
const ROW_3 = 2;
const ROW_4 = 3;
const ROW_5 = 4;
const ROW_6 = 5;
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

function createPieceForInitialPosition(row, col) {
  let pieceType = null;
  let pieceColor = null;

  if (row === ROW_1 || row === ROW_8) {
    pieceColor = (row === ROW_1) ? 'white' : 'black';

    switch (col) {
      case COL_A:
      case COL_H:
        pieceType = 'rook';
        break;
      case COL_B:
      case COL_G:
        pieceType = 'knight';
        break;
      case COL_C:
      case COL_F:
        pieceType = 'bishop';
        break;
      case COL_D:
        pieceType = 'queen';
        break;
      case COL_E:
        pieceType = 'king';
        break;
    }
  } else if (row === ROW_2 || row === ROW_7) {
    pieceType = 'pawn';
    pieceColor = (row === ROW_1) ? 'white' : 'black';
  }

  const piece = {
    type: pieceType,
    color: pieceColor,
    position: { row, col }
  };

  return piece;
}

function createInitialBoard() {
  const board = new Array(BOARD_HEIGHT);

  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    board[row] = new Array(BOARD_WIDTH);
  }

  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    for (let col = COL_A; col < BOARD_WIDTH; col++) {
      if (row === ROW_1 || row === ROW_8) {
\        board[row][col] = createPieceForInitialPosition(row, col);
      } else if (row === ROW_2 || row === ROW_7) {
        board[row][col] = createPieceForInitialPosition(row, col);
      } else {
        board[row][col] = null;
      }
    }
  }

  return board;
}

function initializeNewGame() {
  const initialBoard = createInitialBoard(); 
  
  const game = {
    board: initialBoard, 
    currentPlayer: 'white', 
    result: 'in_progress', 
    history: [], 
  };

  return game;
}

function isValidMove(game, fromSquare, toSquare) {
  const { board, currentPlayer } = game;

  // Check if 'fromSquare' and 'toSquare' are valid positions on the board.
  if (!isValidSquare(fromSquare) || !isValidSquare(toSquare)) {
    return false;
  }

  // Get the piece at 'fromSquare'.
  const fromPiece = board[fromSquare.row][fromSquare.col];

  // Ensure there is a piece at 'fromSquare' and it belongs to the current player.
  if (!fromPiece || fromPiece.color !== currentPlayer) {
    return false;
  }

  // Check if the move is valid for the specific piece type.
  if (!isValidPieceMove(game, fromSquare, toSquare, fromPiece)) {
    return false;
  }

  // If all checks pass, the move is valid.
  return true;
}

function isValidSquare(square) {
  // Check if 'square' is within the bounds of an 8x8 chessboard.
  const { row, col } = square;
  
  // Check if row and column are within the range [0, 7].
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    return true;
  } else {
    return false;
  }
}


function isValidPieceMove(game, fromSquare, toSquare, piece) {
  const { board } = game;
  const { type, color } = piece;
  const { row: fromRow, col: fromCol } = fromSquare;
  const { row: toRow, col: toCol } = toSquare;

  // Check if the 'fromSquare' and 'toSquare' are the same.
  if (fromRow === toRow && fromCol === toCol) {
    return false; // A piece cannot move to its own position.
  }

  // Check if 'toSquare' is occupied by a piece of the same color.
  if (board[toRow][toCol] && board[toRow][toCol].color === color) {
    return false; // You cannot capture your own piece.
  }

  // Implement piece-specific move validation logic.
  switch (type) {
    case 'pawn':
      // Validate pawn moves (basic pawn movement logic).
      if (color === 'white') {
        // White pawn moves forward (from row to row - 1).
        if (fromRow - 1 === toRow && fromCol === toCol) {
          return true;
        }

        // White pawn's first move allows two squares forward (from row to row - 2).
        if (fromRow === 6 && fromRow - 2 === toRow && fromCol === toCol) {
          return true;
        }

        // White pawn captures diagonally (one row up and one column left or right).
        if (fromRow - 1 === toRow && Math.abs(fromCol - toCol) === 1) {
          return true;
        }
      } else if (color === 'black') {
        // Similar logic for black pawns (moves down the board).
        // Implement black pawn move validation here.
      }
      break;

    // Implement move validation rules for other piece types (rooks, knights, bishops, queens, kings).

    default:
      return false; // Invalid piece type.
  }

  return false; // If no move conditions were met, the move is invalid.
}


function findKing(board, player) {
  // Iterate through the board to find if the player's king is still alive.
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === player) {
        return true;
      }
    }
  }
  return false;
}

function updateGameState(game, fromSquare, toSquare) {
  const { board, currentPlayer } = game;
  const { row: fromRow, col: fromCol } = fromSquare;
  const { row: toRow, col: toCol } = toSquare;

  // Move the piece from 'fromSquare' to 'toSquare'.
  const pieceToMove = board[fromRow][fromCol];
  board[toRow][toCol] = pieceToMove;
  board[fromRow][fromCol] = null;

  // Update the current player (switch turns).
  game.currentPlayer = (currentPlayer === 'white') ? 'black' : 'white';

  // Optionally, record the move in the game's history for future reference.
  game.history.push({
    from: fromSquare,
    to: toSquare,
    piece: pieceToMove,
  });
}

function checkGameResult(game) {
  const { board, currentPlayer } = game;
  if(findKing(game, currentPlayer)){
  	return 'checkmate';
  }
  else{
  	return 'in_progress';
  }
}

// Define the game state
let game = initializeNewGame(); // Implement this function to create a new chess game state
// Middleware for handling JSON requests
app.use(bodyParser.json());

// API endpoints for chess game
app.post('/move', (req, res) => {
  const { fromSquare, toSquare } = req.body;

  if (isValidMove(game, fromSquare, toSquare)) {
    // Update the game state with the valid move
    updateGameState(game, fromSquare, toSquare);

    // Check for check, checkmate, and stalemate conditions
    const gameResult = checkGameResult(game);

    // Return the updated game state and result
    res.json({ game: game, result: gameResult });
  } else {
    // Handle invalid move
    res.status(400).json({ error: 'Invalid move' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Chess game server is running on port ${PORT}`);
});