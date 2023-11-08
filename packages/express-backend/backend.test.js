import backend from './backend.js';

// Tests run fine, ask about why the testing says that it is waiting on something, could be port thing idk

describe('Chess Game Movement', () => {

	// 2 pawn moving tests are failing here, both have to do with isValidMove logic, needs fixing
	let game;
  
	beforeEach(() => {
	  game = backend.initializeNewGame();
	});
	
	test('Initial board setup', () => {
		const board = backend.createInitialBoard();
		expect(board[0][0].type).toBe('rook');
		expect(board[0][0].color).toBe('white');
		// Add tests to check all pieces are in the right square possibly
	  });

	  test('Valid move for pawn from A2 to A3', () => {
		const fromSquare = { row: 1, col: 0 };
		const toSquare = { row: 2, col: 0 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(true);
	  });
	
	  test('Invalid move from A2 to B3', () => {
		const fromSquare = { row: 1, col: 0 };
		const toSquare = { row: 2, col: 1 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(false);
	  });

	  test('Valid move for pawn from A2 to A4 (first move)', () => {
		const fromSquare = { row: 1, col: 0 };
		const toSquare = { row: 3, col: 0 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(true);
	  });

	  test('Valid move for pawn from A4 to A6 (second move)', () => {
		const fromSquare = { row: 1, col: 0 };
		const toSquare = { row: 3, col: 0 };
		backend.updateGameState(game, fromSquare, toSquare)
		const fromSquare2 = { row: 3, col: 0 }
		const tosquare2 = { row: 6, col: 0 }
		const isValid2 = backend.isValidMove(game, fromSquare2, tosquare2);
		expect(isValid2).toBe(false);
	  });

	  test('Valid move for pawn capturing a piece diagonally', () => {
		const game = backend.initializeNewGame();
		game.board[1][0] = { type: 'pawn', color: 'white', position: { row: 1, col: 0 } };
		game.board[2][1] = { type: 'pawn', color: 'black', position: { row: 2, col: 1 } };
		const fromSquare = { row: 1, col: 0 };
		const toSquare = { row: 2, col: 1 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(true);
	  });
	
});

describe('Check Game Result', () => {

	// Check game status tests should be good but code needs to be fixed in backend.js, some logic is off
	test('Game is finished - White king captured', () => {
	  const game = backend.initializeNewGame();
	  game.board[0][3] = { type: 'king', color: 'black', position: { row: 0, col: 4 } };
	  game.currentPlayer = 'white';
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('finished');
	});
  
	test('Game is finished - Black king captured', () => {
	  const game = backend.initializeNewGame();
	  game.board[7][4] = { type: 'king', color: 'white', position: { row: 7, col: 4 } };
	  game.currentPlayer = 'black';
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('finished');
	});
  
	test('Game is in progress - No kings captured', () => {
	  const game = backend.initializeNewGame();
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('in_progress');
	});

  });