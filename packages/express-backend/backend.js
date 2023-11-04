const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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

const WHITE = 'white';
const BLACK = 'black';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const QUEEN = 'queen';
const KING = 'king';
const PAWN = 'pawn';
const IN_PROGRESS = 'in_progress';
const FINISHED = 'finished';

const BAD_REQUEST = 400;
const PORT_NUMBER = 300;

const PORT = 3000;

function createPieceForInitialPosition(row, col) {
  let pieceType = null;
  let pieceColor = null;

  if (row === ROW_1 || row === ROW_8) {
    pieceColor = (row === ROW_1) ? WHITE : BLACK;

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
    pieceColor = (row === ROW_1) ? WHITE : BLACK;
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
    currentPlayer: WHITE, 
    result: IN_PROGRESS, 
    history: [], 
  };

  return game;
}

function isValidMove(game, fromSquare, toSquare) {
  const { board, currentPlayer } = game;

  if (!isValidSquare(fromSquare) || !isValidSquare(toSquare)) {
    return false;
  }

  const fromPiece = board[fromSquare.row][fromSquare.col];

  if (!fromPiece || fromPiece.color !== currentPlayer) {
    return false;
  }

  if (!isValidPieceMove(game, fromSquare, toSquare, fromPiece)) {
    return false;
  }

  return true;
}

function isValidSquare(square) {
  const { row, col } = square;
  
  if (row >= ROW_1 && row < BOARD_HEIGHT && col >= COL_A && col < BOARD_WIDTH) {
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

  if (fromRow === toRow && fromCol === toCol) {
    return false; 
  }

  if (board[toRow][toCol] && board[toRow][toCol].color === color) {
    return false; 
  }

  switch (type) {
    case PAWN:
      if (color === WHITE) {
      	let nextRow = frontRow+1;
        if (toRow == nextRow && fromCol === toCol && board[toRow][toCol]==null) {
          return true;
        }
        if (fromRow === ROW_2 && toRow == ROW_4 && fromCol === toCol && board[toRow][toCol]==null) {
          return true;
        }
        if (toRow == nextRow && Math.abs(fromCol - toCol) === 1 && board[toRow][toCol] && board[toRow][toCol].color === BLACK) {
          return true;
        }
      } else if (color === BLACK) {
	        let nextRow = frontRow-1;
	        if (toRow == nextRow && fromCol === toCol && board[toRow][toCol]==null) {
	          return true;
	        }
	        if (fromRow === ROW_7 && toRow == ROW_5 && fromCol === toCol && board[toRow][toCol] == null) {
	          return true;
	        }
	        if (toRow == nextRow && Math.abs(fromCol - toCol) === 1 && board[toRow][toCol] && board[toRow][toCol].color === WHITE) {
	          return true;
	        }
      }
      break;

    default:
      return false; 
  }

  return false; 
}


function findKing(board, player) {
  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    for (let col = COL_A; col < BOARD_WIDTH; col++) {
      const piece = board[row][col];
      if (piece && piece.type === KING && piece.color === player) {
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

  const pieceToMove = board[fromRow][fromCol];
  board[toRow][toCol] = pieceToMove;
  board[fromRow][fromCol] = null;

  game.currentPlayer = (currentPlayer === WHITE) ? BLACK : WHITE;

  game.history.push({
    from: fromSquare,
    to: toSquare,
    piece: pieceToMove,
  });
}

function checkGameResult(game) {
  const { board, currentPlayer } = game;
  if(findKing(game, currentPlayer)){
  	return FINISHED;
  }
  else{
  	return IN_PROGRESS;
  }
}

let game = initializeNewGame(); 

app.use(bodyParser.json());

app.post('/move', (req, res) => {
  const { fromSquare, toSquare } = req.body;

  if (isValidMove(game, fromSquare, toSquare)) {
    updateGameState(game, fromSquare, toSquare);
    const gameResult = checkGameResult(game);
    res.json({ game: game, result: gameResult });
  } else {
    res.status(BAD_REQUEST).json({ error: 'Invalid move' });
  }
});

app.listen(PORT, () => {
  console.log(`Chess game server is running on port ${PORT}`);
});