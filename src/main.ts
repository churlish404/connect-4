// imports

import "./styles/main.scss";

// variables
const player1 = "red";
const player2 = "yellow";
let currentPlayer = player1;
let board: string[][];
let isGameOver: boolean = false;

// HTML elements
const boardHTML = document.querySelector(".game__board");

// Null checks
if (!boardHTML) {
  throw new Error("Issue with board selector");
}

// functions
window.onload = () => {
  createGridHTML();
};

const createGridHTML = () => {
  for (let row = 0; row < 7; row++) {
    // create column container div

    const columnHTML = document.createElement("div");
    columnHTML.classList.add("column", `column${row + 1}`);

    for (let col = 0; col < 6; col++) {
      // create window html
      // adding a class and id  e.g. top left window will be  <div class="window" id="0:0"></div>
      const window = document.createElement("div");
      window.classList.add("window");
      window.id = col.toString() + ":" + row.toString();
      // adding event listener
      window.addEventListener("click", addToken);
      columnHTML.append(window);
    }
    // add each column div to HTML board
    boardHTML.appendChild(columnHTML);
    // add column array to board to setup [[],[]] structure
  }
  createGrid();
};

// initialising JS grid
const createGrid = () => {
  board = [];
  for (let row = 0; row < 6; row++) {
    const column = [];
    for (let col = 0; col <= 6; col++) {
      column.push(" ");
    }
    board.push(column);
  }
};

const addToken = (event: Event) => {
  const window = event.currentTarget as HTMLElement;

  // get coordinates from event.target id
  let coordinates = window.id.split(":");
  let row = parseInt(coordinates[0]);
  let col = parseInt(coordinates[1]);

  // only add token if position not already filled
  if (!window.classList.contains("filled")) {
    // add token to js array at said coordinates
    board[row][col] = currentPlayer;
    // add a blocked class so that next player can't replace
    window.classList.add("filled");

    //adding style class to html window depending on who's turn it is
    // alternate by switching who current player is immediately after
    if (currentPlayer == "red") {
      window.classList.add("red-token");
      currentPlayer = player2;
    } else {
      window.classList.add("yellow-token");
      currentPlayer = player1;
    }
  }
};
