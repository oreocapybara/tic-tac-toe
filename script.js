// The gameboard object allows the game to create the board, update its values, and print the updated board in the console
function GameBoard() {
	const row = 3;
	const column = 3;
	const board = [];

	//Create a 2d array that will append the Cell object;
	for (let i = 0; i < row; i++) {
		board[i] = [];
		for (let j = 0; j < column; j++) {
			board[i].push(Cell());
		}
	}

	// Method to get the board
	const getBoard = () => board;

	// Method to update the board
	const updateBoard = (row, column, action) => {
		if (board[row][column].getValue() !== 0) return; // if the selected cell has a value return
		board[row][column].addPlayerAction(action);
	};

	// Method to print the board
	const printBoard = () => {
		const boardWithValues = board.map((row) =>
			row.map((cell) => cell.getValue()),
		);
		console.log(boardWithValues);
	};

	return { getBoard, updateBoard, printBoard };
}

function Cell() {
	let value = 0;

	// get the Cell value
	const getValue = () => value;

	const addPlayerAction = (player) => {
		value = player;
	};

	return { addPlayerAction, getValue };
}

function GameController(
	playerOneName = "PlayerOne",
	playerTwoName = "PlayerTwo",
) {
	const board = GameBoard(); //Initialize the GameBoard

	// declare the playerArray
	const players = [
		{
			name: playerOneName,
			action: 'X',
		},
		{
			name: playerTwoName,
			action: 'O',
		},
	];

	let activePlayer = players[0];

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name}'s turn`);
	};

	const playRound = (row, column) => {
		console.log(`${getActivePlayer().name} places in [${row}][${column}]`);
		board.updateBoard(row, column, getActivePlayer().action);

		//Winner logic
		const checkWin = () => {
			const arrayBoard = board.getBoard();
			// 1. Rows
			const rowWin = arrayBoard.some(
				(row) =>
					row[0].getValue() !== 0 &&
					row.every((cell) => cell.getValue() === row[0].getValue()),
			);

			// 2. Columns
			const colWin = arrayBoard[0]
				.map((_, i) => i)
				.some(
					(colIndex) =>
						arrayBoard[0][colIndex].getValue() !== 0 &&
						arrayBoard.every(
							(row) =>
								row[colIndex].getValue() ===
								arrayBoard[0][colIndex].getValue(),
						),
				);

			// 3. Diagonals
			const diag1Win = arrayBoard.every(
				(row, i) =>
					row[i].getValue() !== 0 &&
					row[i].getValue() === arrayBoard[0][0].getValue(),
			);
			const diag2Win = arrayBoard.every((row, i) => {
				const targetCol = arrayBoard.length - 1 - i;
				return (
					row[targetCol].getValue() !== 0 &&
					row[targetCol].getValue() ===
						arrayBoard[0][arrayBoard.length - 1].getValue()
				);
			});

			if (rowWin || colWin || diag1Win || diag2Win) {
				console.log(`${getActivePlayer().name} Wins!`);
				return true;
			}

			const isTie = arrayBoard.every((row) =>
				row.every((cell) => cell.getValue() !== 0),
			);

			if (isTie) {
				console.log("It's a tie!");
				return false;
			}

			return false;
		};

		//Check for Winner
		if (checkWin()) return;

		switchActivePlayer();
		printNewRound();
	};

	printNewRound();

	return {
		playRound,
		getActivePlayer,
		getBoard: board.getBoard,
	};
}

function ScreenController() {
	const game = GameController();
	const boardDiv = document.querySelector(".board");
	const turnDiv = document.querySelector(".turn");

	const updateScreen = () => {
		// clear the board
		boardDiv.textContent = "";

		//get the updated board
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		//Display Player turn
		turnDiv.textContent = `${activePlayer.name}'s turn`;

		//Render the board squares
		board.forEach((row, rowIndex) =>
			row.forEach((cell, colIndex) => {
				const cellButton = document.createElement('button');
				cellButton.classList = "cell";

				cellButton.dataset.row = rowIndex
				cellButton.dataset.column = colIndex;
				cellButton.textContent = cell.getValue();
				boardDiv.appendChild(cellButton);
			}),
		);
	};

	// Add event listener for the board
	function clickHandlerBoard(e) {
		const selectedRow = e.target.dataset.row
		const selectedColumn = e.target.dataset.column;
		// Make sure I've clicked a column and not the gaps in between
		if (!selectedColumn) return;

		game.playRound(selectedRow, selectedColumn);
		updateScreen();
	}
	boardDiv.addEventListener("click", clickHandlerBoard);

	// Initial render
	updateScreen();
}

ScreenController();
