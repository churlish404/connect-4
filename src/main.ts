// imports

import "./styles/main.scss";

// variables
const player1 = "red";
const player2 = "yellow";
let board: string[][];
let currentPlayer: string;
let isGameOver: boolean = false;

// HTML elements
const boardHTML = document.querySelector(".game__board");
const gameInfo = document.querySelector(".game-info");

// Null checks
if (!boardHTML) {
  throw new Error("Issue with board selector");
}
if (!gameInfo) {
  throw new Error("Issue with gameInfo selector");
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
  console.log(window);
  const windowColumn = parseInt(window.id.split(":")[1]);
  const windowRow = parseInt(window.id.split(":")[0]);

  //adding style class to html window depending on who's turn it is
  // alternate by switching who current player is immediately after
  if (currentPlayer == "red") {
    window.classList.add("red-token");
    board[windowColumn][windowRow] = player1;
    currentPlayer = player2;
  } else {
    window.classList.add("yellow-token");
    board[windowColumn][windowRow] = player2;
    currentPlayer = player1;
  }
  console.log(board);
};

const addToken = (event: Event) => {
  // return out of function early as don't want to allow players to add tokens if game is over
  // if (checkWinner()) {
  //   return;
  // }
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

const checkWinner = () => {
  // check horizontal "connect-4"
  // check vertical "connect-4"
  // check diagonal "connect-4"
  // check reverse diagonal "connect-4"
  // if connect-4 found
  // isGameOver = true;
  // return isGameOver;
  // else {
  //   return false;
  // }
};
