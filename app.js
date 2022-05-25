let gridSize = 16; // Initial Size of the Grid
let bgColor = "#ffffff";
let ink = "#000000";
let erase = false,
  gridActive = true;
let cells;
const container = document.querySelector(".gridContainer");
const colorPicker = document.querySelector("#mcolor");
const bgColorPicker = document.querySelector("#bgcolor");
const eraser = document.querySelector(".eraser");
const gridState = document.querySelector(".sGrid"); // Button For Showing Grid
const slider = document.querySelector("#myRange");
const clear = document.querySelector(".clear");

function createGrid() {
  let WIDTH = container.offsetWidth / gridSize;

  container.style.gridTemplateColumns = `repeat(${
    gridSize - 3
  }, ${WIDTH}px) 1fr 1fr 1fr`;
  container.style.gridTemplateRows = `repeat(${
    gridSize - 3
  }, ${WIDTH}px) 1fr 1fr 1fr`;

  for (let i = 0; i < gridSize ** 2; i++) {
    const square = document.createElement("div");
    square.classList.add("cell");
    square.draggable = false;

    container.appendChild(square);
  }
}

colorPicker.addEventListener("input", (e) => {
  ink = e.target.value;
  console.log(ink);
});

bgColorPicker.addEventListener("input", (e) => {
  // Selected Color Should become the background color of my grid
  container.style.backgroundColor = e.target.value;
});

eraser.addEventListener("click", (e) => {
  if (erase == false) {
    erase = true;
    e.target.textContent = "Ink";
  } else {
    erase = false;
    e.target.textContent = "Eraser";
  }
});

// The onmousedown event occurs when a user presses a mouse button over an element.

// drawClick will be called when a user clicked on a cell
function drawClick(e) {
  if (erase) {
    e.target.style.backgroundColor = "transparent";
  } else {
    e.target.style.backgroundColor = ink;
  }
}

function drawHover(e) {
  if (e.buttons > 0) {
    if (erase) {
      e.target.style.backgroundColor = "transparent";
    } else {
      e.target.style.backgroundColor = ink;
    }
  }
}

const toggleBorders = (e) => {
  if (gridActive == false) {
    e.target.textContent = "Hide Grid";
    gridActive = true;
    for (let i = 0; i < cells.length; ++i) {
      cells[i].classList.remove("border");
    }
  } else {
    e.target.textContent = "Show Grid";
    gridActive = false;
    for (let i = 0; i < cells.length; ++i) {
      cells[i].classList.add("border");
    }
  }
};

const deleteGrid = () => {
  // Remove children from container
  while (container.firstChild) {
    container.lastChild.removeEventListener("mousedown", drawClick);
    container.lastChild.removeEventListener("mousehover", drawHover);
    container.removeChild(container.lastChild);
  }
};

const resizeGrid = (e) => {
  gridSize = e.target.value;
  const size = document.querySelector("#size");
  size.textContent = `${gridSize} * ${gridSize}`;
  deleteGrid();
  createGrid(); // This will create The grid
  listen(); // This will apply event Listeners
};

const clearGrid = () => {
  for (let i = 0; i < cells.length; ++i) {
    cells[i].style.backgroundColor = "transparent";
  }
};

function listen() {
  cells = document.querySelectorAll(".cell");

  for (let i = 0; i < cells.length; ++i) {
    cells[i].addEventListener("mousedown", drawClick);
    cells[i].addEventListener("mouseenter", drawHover);
  }

  gridState.addEventListener("click", toggleBorders); // Borders added or removed

  slider.addEventListener("input", resizeGrid); // Grid Size Changed

  clear.addEventListener("click", clearGrid); // Clear Whole Grid
}

createGrid();
listen();
