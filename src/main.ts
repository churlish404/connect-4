// imports
import confetti, { Options } from "canvas-confetti";
import "./styles/main.scss";

// variables
const player1 = "Red";
const player2 = "Yellow";
const rows = 6;
const columns = 7;
let board: string[][];
let currentPlayer: string;
let isGameOver: boolean = false;

// confetti option parameter objects
const options1: Options = {
  particleCount: 100,
  spread: 50,
  colors: ["#3BCF07"],
  angle: 90,
};
const options2: Options = {
  particleCount: 200,
  spread: 200,
  colors: ["#ffffff"],
  angle: 120,
};
const options3: Options = {
  particleCount: 300,
  spread: 200,
  colors: ["#E54831"],
  angle: 180,
};

// HTML elements
const boardHTML = document.querySelector(".game__board");
const gameInfo = document.querySelector(".header__game-info");
const resetButton = document.querySelector(".header__reset-button");
const player1Graphic = document.querySelector(".game__player1") as HTMLElement;
const player2Graphic = document.querySelector(".game__player2") as HTMLElement;

// Null checks
if (!boardHTML) {
  throw new Error("Issue with board selector");
}
if (!gameInfo) {
  throw new Error("Issue with gameInfo selector");
}
if (!player1Graphic) {
  throw new Error("Issue with player1 info selector");
}
if (!player2Graphic) {
  throw new Error("Issue with player2 info selector");
}
if (!resetButton) {
  throw new Error("Issue with reset-button selector");
}

// functions
window.onload = () => {
  createGridHTML();
  createGrid();
  // randomly choose who current player is
  currentPlayer = coinFlip();
};

// functions to update styles
const coinFlip = () => {
  let players = ["Red", "Yellow"];
  const startingPlayer = players[Math.round(Math.random())];
  gameInfo.innerHTML = `The virtual coin has spoken ${startingPlayer} to play first!`;
  return startingPlayer;
};

// to update turn information and style graphics appropriately
const updatePlayerDisplay = (currentPlayer: string) => {
  gameInfo.innerHTML = `${currentPlayer} to play`;
  if (currentPlayer == "Red") {
    player1Graphic.style.opacity = "1";
    player1Graphic.style.scale = "1.25";
    player2Graphic.style.opacity = "0.5";
    player2Graphic.style.scale = "1";
  } else {
    player1Graphic.style.opacity = "0.5";
    player1Graphic.style.scale = "1";
    player2Graphic.style.opacity = "1";
    player2Graphic.style.scale = "1.25";
  }
  return;
};

const createGridHTML = () => {
  for (let col = 0; col < 7; col++) {
    // create column container div

    const columnHTML = document.createElement("div");
    columnHTML.classList.add("column", `column${col}`);
    // adding event listener to each column so that user can click on column
    columnHTML.addEventListener("click", addToken);

    for (let row = 0; row < 6; row++) {
      // create window html
      // adding a class and id  e.g. top left window will be  <div class="window" id="0:0"></div>
      const window = document.createElement("div");
      window.classList.add("window");
      window.id = col.toString() + ":" + row.toString();
      columnHTML.append(window);
    }
    // add each column div to HTML board
    boardHTML.appendChild(columnHTML);
  }
};

const setWindowStyle = (window: Element) => {
  window.classList.add("filled");
  const windowColumn = parseInt(window.id.split(":")[1]);
  const windowRow = parseInt(window.id.split(":")[0]);

  //adding style class to html window depending on who's turn it is

  if (currentPlayer == "Red") {
    window.classList.add("red-token");
    // set piece in js array
    board[windowColumn][windowRow] = player1;
    // check if winning move made
    if (checkForWinner()) {
      gameOver();
      return;
    }
    currentPlayer = player2;
  } else {
    window.classList.add("yellow-token");
    board[windowColumn][windowRow] = player2;
    if (checkForWinner()) {
      gameOver();
      return;
    }
    currentPlayer = player1;
  }
  // update game info div
  updatePlayerDisplay(currentPlayer);
};
const setWinnerStyles = (winningCoordsArray: string[]) => {
  winningCoordsArray.forEach((coord) => {
    const window = document.getElementById(`${coord[1]}:${coord[0]}`);
    window!.style.scale = "1.25";
    window!.style.gap = "110%";
  });
  return;
};

// functions to perform logic

// initialising JS grid
const createGrid = () => {
  board = [];
  for (let col = 0; col < 6; col++) {
    const rowArr = [];
    for (let row = 0; row <= 6; row++) {
      rowArr.push(" ");
    }
    // add column array to board to setup [[],[]] structure
    board.push(rowArr);
  }
};

const addToken = (event: Event) => {
  // return out of function early as don't want to allow players to add tokens if game is over
  if (isGameOver) {
    return;
  }
  const column = event.currentTarget as HTMLElement;
  const windows = Array.from(column.children);

  // to store coordinates of filled token on column & flag if column is empty
  let activeWindow = {
    isFilled: false,
    coordinates: "",
  };

  // // checking for existing filled windows in column
  windows.forEach((window: any) => {
    // loop down column and check if each window is "filled"
    if (window.classList.contains("filled")) {
      activeWindow.isFilled = true;
      activeWindow.coordinates = window.id.split(":");
    }
  });

  // if active window object has no coords set - aka no tokens in this column
  // add a filled class to the bottom window
  if (!activeWindow.coordinates) {
    windows[windows.length - 1].classList.add("filled");
    setWindowStyle(windows[windows.length - 1]);

    // if the active window object already has coords aka theres already tokens in column
  } else {
    // getting number of rows in this column where window is filled
    const filledRows = windows.filter((row) => {
      return row.classList.contains("filled");
    });
    const numberOfFilledRows = filledRows.length;
    //
    const nextAvailableRow: number =
      parseInt(activeWindow.coordinates[1]) - numberOfFilledRows;

    windows[nextAvailableRow].classList.add("filled");
    setWindowStyle(windows[nextAvailableRow]);
  }
};

const horizontalAdjacentTokens = (
  board: string[][],
  row: number,
  col: number
) => {
  let adjacentTokens = 0;
  for (let i = 1; i < 4; i++) {
    if (board[row][col] == board[row][col + i]) {
      adjacentTokens++;
    } else {
      return false;
    }
  }
  return true;
};

const verticalAdjacentTokens = (
  board: string[][],
  row: number,
  col: number
) => {
  let adjacentTokens = 0;
  for (let i = 1; i < 4; i++) {
    if (board[row][col] == board[row + i][col]) {
      adjacentTokens++;
    } else return false;
  }
  return true;
};

const diagonalAdjacentTokens = (
  board: string[][],
  row: number,
  col: number
) => {
  let adjacentTokens = 0;
  for (let i = 1; i < 4; i++) {
    if (board[row][col] == board[row - i][col + i]) {
      adjacentTokens++;
    } else return false;
  }
  return true;
};

const antiDiagonalAdjacentTokens = (
  board: string[][],
  row: number,
  col: number
) => {
  let adjacentTokens = 0;
  for (let i = 1; i < 4; i++) {
    if (board[row][col] == board[row + i][col + i]) {
      adjacentTokens++;
      console.log(adjacentTokens);
    } else return false;
  }

  return true;
};

const checkForWinner = (): boolean => {
  // check horizontal "connect-4"
  // columns - 3 to stop going out of bounds
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns - 3; col++) {
      // if window isn't empty check for horizontal win horizontally
      if (board[row][col] != " ") {
        if (horizontalAdjacentTokens(board, row, col)) {
          setWinnerStyles([
            `${row}${col}`,
            `${row}${col + 1}`,
            `${row}${col + 2}`,
            `${row}${col + 3}`,
          ]);
          return true;
        }
      }
    }
  }
  // check vertical "connect-4"
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows - 3; row++) {
      // if window isn't empty check for horizontal win horizontally
      if (board[row][col] != " ") {
        if (verticalAdjacentTokens(board, row, col)) {
          setWinnerStyles([
            `${row}${col}`,
            `${row + 1}${col}`,
            `${row + 2}${col}`,
            `${row + 3}${col}`,
          ]);
          return true;
        }
      }
    }
  }
  // check diagonal "connect-4"
  // don't need to check all of board as some diagonals wont allow connect 4
  for (let row = 5; row > rows - 3; row--) {
    for (let col = 0; col < columns - 3; col++) {
      if (board[row][col] != " ") {
        if (diagonalAdjacentTokens(board, row, col)) {
          setWinnerStyles([
            `${row}${col}`,
            `${row - 1}${col + 1}`,
            `${row - 2}${col + 2}`,
            `${row - 3}${col + 3}`,
          ]);
          return true;
        }
      }
    }
  }

  // check reverse diagonal "connect-4"
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < columns - 3; col++) {
      if (board[row][col] != " ") {
        if (antiDiagonalAdjacentTokens(board, row, col)) {
          setWinnerStyles([
            `${row}${col}`,
            `${row + 1}${col + 1}`,
            `${row + 2}${col + 2}`,
            `${row + 3}${col + 3}`,
          ]);
          return true;
        }
      }
    }
  }
  return false;
};

const fireConfetti = () => {
  confetti(options1);

  setTimeout(() => {
    confetti(options2);
  }, 500);

  setTimeout(() => {
    confetti(options3);
  }, 700);
};

const resetGame = () => {
  location.reload();
};

const gameOver = () => {
  gameInfo.innerHTML = `${currentPlayer} wins!`;
  isGameOver = true;
  fireConfetti();
  setTimeout(() => {
    resetGame();
  }, 5000);

  return;
};

// event listeners

resetButton.addEventListener("click", resetGame);

// lock screen orientation

screen.orientation.lock("portrait");
