import express from 'express';
import bodyParser from 'body-parser';
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
  const board = new Array(BOARD_HEIGHT);

  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    board[row] = new Array(BOARD_WIDTH);
  }

  for (let row = ROW_1; row < BOARD_HEIGHT; row++) {
    for (let col = COL_A; col < BOARD_WIDTH; col++) {
      if (row === ROW_1 || row === ROW_8) {
        board[row][col] = createPieceForInitialPosition(row, col);
      } else if (row === ROW_2 || row === ROW_7) {
        board[row][col] = createPieceForInitialPosition(row, col);
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

/*The function is used to check if the move a player made can be considered
a valid move. It checks if the movement is within bounds of the chessboard.
It then checks if the piece selected belongs to the player. Finally, it checks
if the piece is allowed to move to toSquare based on its piece rules. */
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

/*This function checks whether the destination to move a piece is within bounds
of the chessboard. If it is within bounds, the function returns true. Else, it
returns false. */
function isValidSquare(square) {
  const { row, col } = square;
  
  if (row >= ROW_1 && row < BOARD_HEIGHT && col >= COL_A && col < BOARD_WIDTH) {
    return true;
  } else {
    return false;
  }
}

/*This function checks whether a chess piece can move to its final destination
based on the particular piece's rules. First, the function checks that the player
is not moving a piece to its own location and it checks that the piece being moved 
belongs to the player. These rules apply regardless of chess piece that is selected
to move. The switch case then applies different rules dpeending on the piece selected.
Currently, only the functionality of pawns has been implemented for the minimum viable
product. If the pawn is white, the code implements functionality that allows a pawn to
(1) move up one spot (as long as there are no pieces in the next spot)
(2) move two spots forward if the pawn is at starting position and there are no
other pieces in the destination.
(3) capture a piece diagonally (checks if pawn moves diagonally and moves to a
position occupied by an enemy chess piece).

Without loss of generality, similar functionality is implemented for black pawns.
*/
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
      	let nextRow = fromRow+1;
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
	        let nextRow = fromRow-1;
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

/*This function finds the player's king by traversing through the whole board. 
If the player's king can be found, the king is still not captured. 
If the player's king can not be found, then the king has been captured. 

This variant of chess does not have checks or checkmate. A player wins instead
by capturing the enemy king.*/

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

/* This function is used to update the current game state and board. 
It also switches been both players' turns as well as pushing the most
recent move to history. */

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

/*This function checks if the game is finished or not.
If the current player's king can be found, the game is still in progress.
Else, the game is finished (the player's king has been captured.) */
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

export default {
  createPieceForInitialPosition,
  createInitialBoard,
  initializeNewGame,
  isValidMove,
  isValidSquare,
  isValidPieceMove,
  findKing,
  updateGameState,
  checkGameResult,
};