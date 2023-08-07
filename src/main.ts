import "./styles/main.scss";
const board = document.querySelector(".game__board");

if (!board) {
  throw new Error("Issue with board selector");
}

const generateGrid = (rows: number, columns: number) => {
  for (let i = 0; i <= rows; i++) {
    // create column div
    const column = document.createElement("div");
    column.classList.add("column", `column${i + 1}`);
    for (let j = 1; j < columns; j++) {
      // create window
      const window = document.createElement("div");
      window.classList.add("window", `row${columns - j}`);
      column.append(window);
    }
    board.appendChild(column);
  }
};

generateGrid(6, 7);
