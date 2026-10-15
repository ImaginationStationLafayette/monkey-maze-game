const COLS = 28;
const ROWS = 11;

let maze = [];
let path = [];
let isDrawing = false;
let gameWon = false;

const mazeEl = document.getElementById('maze');
const resetBtn = document.getElementById('reset-btn');
const newBtn = document.getElementById('new-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winModal = document.getElementById('win-modal');

const btnUp = document.getElementById('btn-up');
const btnLeft = document.getElementById('btn-left');
const btnDown = document.getElementById('btn-down');
const btnRight = document.getElementById('btn-right');

class Cell {
  constructor(c, r) {
    this.c = c;
    this.r = r;
    // Walls: Top, Right, Bottom, Left
    this.walls = [true, true, true, true];
    this.visited = false;
    this.element = null;
  }
}

function init() {
  generateMaze();
  drawMaze();
  path = [0];
  maze[0].element.classList.add('path');
  updateCurrentMarker();
  setupEvents();
}

function generateMaze() {
  maze = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      maze.push(new Cell(c, r));
    }
  }

  // Recursive Backtracker algorithm for maze generation
  const stack = [];
  let current = maze[0];
  current.visited = true;

  // We loop until stack is empty but we use an arbitrary counter to prevent infinite loop just in case
  let iter = 0;
  while (iter < 10000) {
    iter++;
    const next = getUnvisitedNeighbor(current);
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
  
  path = [];
  gameWon = false;
}

function index(c, r) {
  if (c < 0 || r < 0 || c > COLS - 1 || r > ROWS - 1) return -1;
  return c + r * COLS;
}

function getUnvisitedNeighbor(cell) {
  const neighbors = [];
  const top = maze[index(cell.c, cell.r - 1)];
  const right = maze[index(cell.c + 1, cell.r)];
  const bottom = maze[index(cell.c, cell.r + 1)];
  const left = maze[index(cell.c - 1, cell.r)];

  if (top && !top.visited) neighbors.push(top);
  if (right && !right.visited) neighbors.push(right);
  if (bottom && !bottom.visited) neighbors.push(bottom);
  if (left && !left.visited) neighbors.push(left);

  if (neighbors.length > 0) {
    const r = Math.floor(Math.random() * neighbors.length);
    return neighbors[r];
  }
  return undefined;
}

function removeWalls(a, b) {
  const x = a.c - b.c;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  const y = a.r - b.r;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function drawMaze() {
  mazeEl.innerHTML = '';
  mazeEl.style.gridTemplateColumns = `repeat(${COLS}, var(--cell-size))`;
  mazeEl.style.gridTemplateRows = `repeat(${ROWS}, var(--cell-size))`;

  maze.forEach((cell, i) => {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    
    if (cell.walls[0]) cellEl.classList.add('wall-top');
    if (cell.walls[1]) cellEl.classList.add('wall-right');
    if (cell.walls[2]) cellEl.classList.add('wall-bottom');
    if (cell.walls[3]) cellEl.classList.add('wall-left');

    if (cell.c === 0 && cell.r === 0) cellEl.classList.add('start');
    if (cell.c === COLS - 1 && cell.r === ROWS - 1) cellEl.classList.add('end');

    cellEl.dataset.index = i;
    cellEl.dataset.c = cell.c;
    cellEl.dataset.r = cell.r;

    mazeEl.appendChild(cellEl);
    cell.element = cellEl;
  });
}

function setupEvents() {
  mazeEl.addEventListener('touchstart', handleStart, { passive: false });
  mazeEl.addEventListener('touchmove', handleMove, { passive: false });
  mazeEl.addEventListener('touchend', handleEnd);
  
  mazeEl.addEventListener('mousedown', handleStart);
  mazeEl.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);

  resetBtn.addEventListener('click', resetPath);
  newBtn.addEventListener('click', () => {
    winModal.classList.add('hidden');
    init();
  });
  playAgainBtn.addEventListener('click', () => {
    winModal.classList.add('hidden');
    init();
  });

  btnUp.addEventListener('click', () => moveDirection(0, -1));
  btnDown.addEventListener('click', () => moveDirection(0, 1));
  btnLeft.addEventListener('click', () => moveDirection(-1, 0));
  btnRight.addEventListener('click', () => moveDirection(1, 0));
}

function moveDirection(dx, dy) {
  if (gameWon || path.length === 0) return;
  const currentIdx = path[path.length - 1];
  const currentCell = maze[currentIdx];
  const targetC = currentCell.c + dx;
  const targetR = currentCell.r + dy;
  const targetIdx = index(targetC, targetR);
  
  if (targetIdx === -1) return;
  const targetCell = maze[targetIdx];
  
  if (path.length > 1 && path[path.length - 2] === targetIdx) {
    const popped = path.pop();
    maze[popped].element.classList.remove('path');
    updateCurrentMarker();
    return;
  }
  
  if (!path.includes(targetIdx) && isAdjacentAndOpen(currentCell, targetCell)) {
    addToPath(targetIdx);
    checkWin(targetIdx);
  }
}

function handleStart(e) {
  if (gameWon) return;
  e.preventDefault();
  const el = getTargetCell(e);
  if (!el) return;

  const cellIndex = parseInt(el.dataset.index);
  
  if (cellIndex === 0 || (path.length > 0 && path[path.length - 1] === cellIndex)) {
    isDrawing = true;
    if (path.length === 0) {
      addToPath(cellIndex);
    }
  } else if (path.includes(cellIndex)) {
    isDrawing = true;
    const pathIndex = path.indexOf(cellIndex);
    const toRemove = path.slice(pathIndex + 1);
    toRemove.forEach(idx => {
      maze[idx].element.classList.remove('path');
      maze[idx].element.classList.remove('current');
    });
    path = path.slice(0, pathIndex + 1);
    updateCurrentMarker();
  }
}

function handleMove(e) {
  if (!isDrawing || gameWon) return;
  e.preventDefault();
  
  const el = getTargetCell(e);
  if (!el) return;
  
  const cellIndex = parseInt(el.dataset.index);
  const cell = maze[cellIndex];
  
  const lastIndex = path[path.length - 1];
  const lastCell = maze[lastIndex];

  if (path.length > 1 && path[path.length - 2] === cellIndex) {
    const popped = path.pop();
    maze[popped].element.classList.remove('path');
    updateCurrentMarker();
    return;
  }

  if (!path.includes(cellIndex) && isAdjacentAndOpen(lastCell, cell)) {
    addToPath(cellIndex);
    checkWin(cellIndex);
  }
}

function handleEnd() {
  isDrawing = false;
}

function getTargetCell(e) {
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  const target = document.elementFromPoint(clientX, clientY);
  if (target && target.classList.contains('cell')) {
    return target;
  }
  return null;
}

function isAdjacentAndOpen(a, b) {
  if (!a || !b) return false;
  const x = a.c - b.c;
  const y = a.r - b.r;
  
  if (x === 1 && y === 0 && !a.walls[3]) return true;
  if (x === -1 && y === 0 && !a.walls[1]) return true;
  if (y === 1 && x === 0 && !a.walls[0]) return true;
  if (y === -1 && x === 0 && !a.walls[2]) return true;
  
  return false;
}

function addToPath(index) {
  path.push(index);
  const el = maze[index].element;
  el.classList.add('path');
  updateCurrentMarker();
}

function updateCurrentMarker() {
  maze.forEach(c => c.element.classList.remove('current'));
  if (path.length > 0) {
    maze[path[path.length - 1]].element.classList.add('current');
  }
}

function resetPath() {
  if (gameWon) return;
  path.forEach(idx => {
    maze[idx].element.classList.remove('path');
    maze[idx].element.classList.remove('current');
  });
  path = [0];
  maze[0].element.classList.add('path');
  updateCurrentMarker();
}

function checkWin(index) {
  if (index === maze.length - 1) {
    gameWon = true;
    isDrawing = false;
    
    maze.forEach(c => c.element.classList.remove('current'));
    
    setTimeout(() => {
      triggerConfetti();
      winModal.classList.remove('hidden');
    }, 300);
  }
}

function triggerConfetti() {
  if (window.confetti) {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fcd34d', '#4ade80', '#ec4899']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fcd34d', '#4ade80', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

init();
