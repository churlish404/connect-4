// imports

import "./styles/main.scss";

// variables
const player1 = "red";
const player2 = "yellow";
const rows = 6;
const columns = 7;
let board: string[][];
let currentPlayer: string;
let isGameOver: boolean = false;

// HTML elements
const boardHTML = document.querySelector(".game__board");
const gameInfo = document.querySelector(".game-info");
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

// functions
window.onload = () => {
  createGridHTML();
  createGrid();
  // randomly choose who current player is
  currentPlayer = coinFlip();
};

const coinFlip = () => {
  let players = ["red", "yellow"];
  const startingPlayer = players[Math.round(Math.random())];
  gameInfo.innerHTML = `${startingPlayer} to play first!`;
  return startingPlayer;
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

// to update turn information and style graphics appropriately
const updatePlayerDisplay = (currentPlayer: string) => {
  gameInfo.innerHTML = `${currentPlayer} to play`;
  if (currentPlayer == "red") {
    player1Graphic.style.opacity = "1";
    player2Graphic.style.opacity = "0.5";
  } else {
    player1Graphic.style.opacity = "0.5";
    player2Graphic.style.opacity = "1";
  }
  return;
};

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

const setWindowStyle = (window: Element) => {
  window.classList.add("filled");
  const windowColumn = parseInt(window.id.split(":")[1]);
  const windowRow = parseInt(window.id.split(":")[0]);

  //adding style class to html window depending on who's turn it is
  // check if winning move made
  // if game not won change who current player is
  if (currentPlayer == "red") {
    window.classList.add("red-token");
    board[windowColumn][windowRow] = player1;
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
    } else return false;
  }
  return true;
};

const checkForWinner = (): boolean => {
  // check horizontal "connect-4"
  // columns - 3 to
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns - 3; col++) {
      // if window isn't empty check for horizontal win horizontally
      if (board[row][col] != " ") {
        if (horizontalAdjacentTokens(board, row, col)) {
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
          return true;
        }
      }
    }
  }
  // check diagonal "connect-4"
  // don't need to check all of board as some diagonals wont allow connect 4
  for (let row = 5; row > rows - 3; row--) {
    for (let col = 0; col < columns - 4; col++) {
      if (board[row][col] != " ") {
        if (diagonalAdjacentTokens(board, row, col)) {
          return true;
        }
      }
    }
  }

  // check reverse diagonal "connect-4"
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < columns - 4; col++) {
      if (board[row][col] != " ") {
        if (antiDiagonalAdjacentTokens(board, row, col)) {
          return true;
        }
      }
    }
  }
  // if connect-4 found
  // isGameOver = true;
  // return isGameOver;
  // else {
  return false;
  // }
};

const gameOver = () => {
  gameInfo.innerHTML = `${currentPlayer} wins`;
  return;
};
