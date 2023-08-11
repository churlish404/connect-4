export const createGridHTML = () => {
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
