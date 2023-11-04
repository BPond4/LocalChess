const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;


function createPieceForInitialPosition(row, col) {
  // Initialize variables to store piece type and color.
  let pieceType = null;
  let pieceColor = null;

  // Determine the piece type and color based on the row (rank).
  if (row === 0 || row === 7) {
    // Pieces for the first (top) and eighth (bottom) ranks.
    pieceColor = (row === 0) ? 'white' : 'black';

    switch (col) {
      case 0:
      case 7:
        pieceType = 'rook';
        break;
      case 1:
      case 6:
        pieceType = 'knight';
        break;
      case 2:
      case 5:
        pieceType = 'bishop';
        break;
      case 3:
        pieceType = 'queen';
        break;
      case 4:
        pieceType = 'king';
        break;
    }
  } else if (row === 1 || row === 6) {
    // Pawns for the second (white) and seventh (black) ranks.
    pieceType = 'pawn';
    pieceColor = (row === 1) ? 'white' : 'black';
  }

  // Create and return the piece object.
  const piece = {
    type: pieceType,
    color: pieceColor,
    position: { row, col }
  };

  return piece;
}

function createInitialBoard() {
  // Create an 8x8 2D array to represent the chessboard.
  const board = new Array(8);

  for (let row = 0; row < 8; row++) {
    board[row] = new Array(8);
  }

  // Place the initial chess pieces on the board.
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (row === 0 || row === 7) {
        // Place rooks, knights, bishops, queens, and kings for both white and black players in the first and last ranks.
        board[row][col] = createPieceForInitialPosition(row, col);
      } else if (row === 1 || row === 6) {
        // Place pawns for both white and black players in the second and seventh ranks.
        board[row][col] = createPieceForInitialPosition(row, col);
      } else {
        // Empty squares in all other positions.
        board[row][col] = null;
      }
    }
  }

  return board;
}

function initializeNewGame() {
  // Define the initial state of the chess game
  const initialBoard = createInitialBoard(); // Implement this function to set up the starting positions of chess pieces.
  
  const game = {
    board: initialBoard, // The 2D array representing the chessboard.
    currentPlayer: 'white', // The player to make the first move.
    result: 'in_progress', // The initial game result (e.g., 'in_progress').
    history: [], // An array to store the history of moves for potential game replay or undo.
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

  // Validate that the move doesn't put the current player in check.
  if (movePutsPlayerInCheck(game, fromSquare, toSquare)) {
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


function movePutsPlayerInCheck(game, fromSquare, toSquare) {
  // Simulate the move temporarily.
  const { board, currentPlayer } = game;
  const { row: fromRow, col: fromCol } = fromSquare;
  const { row: toRow, col: toCol } = toSquare;

  const originalPieceAtToSquare = board[toRow][toCol];
  board[toRow][toCol] = board[fromRow][fromCol];
  board[fromRow][fromCol] = null;

  // Check if the current player is now in check.
  const inCheck = isPlayerInCheck(game, currentPlayer);

  // Revert the move to its original state.
  board[fromRow][fromCol] = board[toRow][toCol];
  board[toRow][toCol] = originalPieceAtToSquare;

  return inCheck;
}

function isPlayerInCheck(game, player) {
  const { board } = game;

  // Find the king's position for the specified player.
  const kingPosition = findKingPosition(board, player);

  // Iterate through the entire board to find opponent pieces.
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];

      if (piece && piece.color !== player) {
        // Check if the opponent's piece can attack the king's position.
        if (isValidPieceMove(game, { row, col }, kingPosition, piece)) {
          return true; // Player is in check.
        }
      }
    }
  }

  return false; // Player is not in check.
}

function findKingPosition(board, player) {
  // Iterate through the board to find the position of the player's king.
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === player) {
        return { row, col };
      }
    }
  }
}

// Define the game state
let game = initializeNewGame(); // Implement this function to create a new chess game state
// Middleware for handling JSON requests
app.use(bodyParser.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Chess game server is running on port ${PORT}`);
});