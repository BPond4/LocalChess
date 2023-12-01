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
		expect(board[0][1].type).toBe('knight')
		expect(board[0][1].color).toBe('white')
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

	  test('Valid move for pawn capturing a piece diagonally', () => {
		const game = backend.initializeNewGame();
		game.board[1][0] = { type: 'pawn', color: 'white', position: { row: 1, col: 0 } };
		game.board[2][1] = { type: 'pawn', color: 'black', position: { row: 2, col: 1 } };
		const fromSquare = { row: 1, col: 0 };
		const toSquare = { row: 2, col: 1 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(true);
	  });

	  test('Valid move for knight from B1 to C3', () => {
		const fromSquare = { row: 0, col: 1 };
		const toSquare = { row: 2, col: 2 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(true);
	  });

	  test('Valid move for knight from B1 to A3', () => {
		const fromSquare = { row: 0, col: 1 };
		const toSquare = { row: 2, col: 0 };
		const isValid = backend.isValidMove(game, fromSquare, toSquare);
		expect(isValid).toBe(true);
	  });

	  test('Invalid move for knight from B1 to A3 after pawn moved there', () => {
		const pfrom = { row: 1, col: 0 }
		const pto = { row: 2, col: 0 }
		const pbfrom = { row: 6, col: 0 }
		const pbto = { row: 5, col: 0 }
		backend.updateGameState(game, pfrom, pto)
		backend.updateGameState(game, pbfrom, pbto)
		const kfromSquare = { row: 0, col: 1 };
		const ktoSquare = { row: 2, col: 0 };
		const isValid = backend.isValidMove(game, kfromSquare, ktoSquare);
		expect(isValid).toBe(false);
	  });


	  test('Invalid move for knight from B1 to B2 - even if free since not valid way to move', () => {
		const pfrom = { row: 1, col: 1 }
		const pto = { row: 2, col: 1 }
		const pbfrom = { row: 6, col: 0 }
		const pbto = { row: 5, col: 0 }
		backend.updateGameState(game, pfrom, pto)
		backend.updateGameState(game, pbfrom, pbto)
		const kfromSquare = { row: 0, col: 1 };
		const ktoSquare = { row: 1, col: 1 };
		const isValid = backend.isValidMove(game, kfromSquare, ktoSquare);
		expect(isValid).toBe(false);
	  });
	
});

describe('Check Game Result', () => {

	// Check game status tests should be good but code needs to be fixed in backend.js, some logic is off
	test('Game is finished - White king captured', () => {
	  const game = backend.initializeNewGame();
	  game.board[7][4]= null;
	  game.board[0][4] = { type: 'king', color: 'black', position: { row: 0, col: 4 } };
	  game.currentPlayer = 'white';
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('finished');
	});
  
	test('Game is finished - Black king captured', () => {
	  const game = backend.initializeNewGame();
	  game.board[7][4] = { type: 'king', color: 'white', position: { row: 7, col: 4 } };
	  game.board[0][4] = null;
	  game.currentPlayer = 'black';
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('finished');
	});
  
	test('Initial game - White king not captured', () => {
	  const game = backend.initializeNewGame();
	  game.currentPlayer = 'white';
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('in_progress');
	});

	test('Initial game - Black king not captured', () => {
	  const game = backend.initializeNewGame();
	  game.currentPlayer = 'black';
	  const result = backend.checkGameResult(game);
	  expect(result).toBe('in_progress');
	});

  });