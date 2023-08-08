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
    columnHTML.classList.add("column", `column${col + 1}`);
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
  for (let row = 0; row < 6; row++) {
    const column = [];
    for (let col = 0; col <= 6; col++) {
      column.push(" ");
    }
    // add column array to board to setup [[],[]] structure
    board.push(column);
  }
};

// help needed here!
// issue with trying to refactor addToken();

// const setWindowStyle = (window: Element) => {
//   window.classList.add("filled");

//   if (currentPlayer == "red") {
//     window.classList.add("red-token");
//     currentPlayer = player2;
//   } else {
//     window.classList.add("yellow-token");
//     currentPlayer = player1;
//   }
// };

const addToken = (event: Event) => {
  const column = event.currentTarget as HTMLElement;
  const windows = Array.from(column.children);

  let activeWindow = {
    isFilled: false,
    coordinates: "",
  };
  // let coordinates: string[];
  // const columnNumber = column.classList[1][column.classList[1].length - 1];

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
    /*ignore trying to refactor below code into setWindowStyle()
    // setWindowStyle(windows[windows.length]);
    ignore */

    windows[windows.length - 1].classList.add("filled");

    //adding style class to html window depending on who's turn it is
    // alternate by switching who current player is immediately after
    if (currentPlayer == "red") {
      windows[windows.length - 1].classList.add("red-token");
      currentPlayer = player2;
    } else {
      windows[windows.length - 1].classList.add("yellow-token");
      currentPlayer = player1;
    }
    // if the active window object already has coords aka theres already tokens in column
    // get coords for next window "up" column so can stack next token
    // set token to those coords
  } else {
    // working here to alter next line down so next row is initialised dynamically (instead of -1 should be -number of filled rows)
    const filledRows = windows.filter((row) => {
      return row.classList.contains("filled");
    });

    const numberOfFilledRows = filledRows.length;
    const nextRow: number =
      parseInt(activeWindow.coordinates[1]) - numberOfFilledRows;

    /* ignore trying to refactor below code into setWindowStyle function()
    setWindowStyle(windows[nextRow]);
  ignore */

    windows[nextRow].classList.add("filled");

    if (currentPlayer == "red") {
      windows[nextRow].classList.add("red-token");
      currentPlayer = player2;
    } else {
      windows[nextRow].classList.add("yellow-token");
      currentPlayer = player1;
    }
  }
};
