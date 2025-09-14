const GRID_SCALE = 0.8;
const DARKEN_STEP = 0.1;
const HOVER_DELAY = 10;
const MIN_SQUARES = 2;
const MAX_SQUARES = 100;

let numberOfSquares = 16;

const siteWrapper = document.querySelector('#siteWrapper');
let gridContainer;

const clearButton = document.querySelector('#clearGrid');
const newGridButton = document.querySelector('#createGrid');

function calcContainerSize() {
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  return Math.floor(GRID_SCALE * minDimension);
}

function setContainerSize(container, size) {
  container.style.width = container.style.height = `${size}px`;
}

function resizeSquares(gridContainer, size, num){
    const squareSize = size / num;
    gridContainer.querySelectorAll('.square').forEach(square => {
        square.style.width = square.style.height = `${squareSize}px`;
    });
}

function setupHoverEffect(gridContainer) {
  let hoverTimeout;

    gridContainer.addEventListener('mouseover', (e) => {
        if (!e.target.classList.contains('square')) return;
        clearTimeout(hoverTimeout);
            
        hoverTimeout = setTimeout(() => {
          let brightness = parseFloat(e.target.dataset.brightness) || 1;
          brightness = Math.max(DARKEN_STEP, brightness - DARKEN_STEP);
          e.target.dataset.brightness = brightness;
          e.target.style.filter = `brightness(${brightness})`;
        }, HOVER_DELAY);
    });

    gridContainer.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('square')) clearTimeout(hoverTimeout);
    });
}

function createGrid (num) {
    const containerSize = calcContainerSize();
    setContainerSize(siteWrapper, containerSize);

    if (gridContainer) { gridContainer.remove()};

    gridContainer = document.createElement('div');
    gridContainer.classList.add('gridContainer');
    setContainerSize(gridContainer, containerSize);
    siteWrapper.appendChild(gridContainer);

    for (let i = 1; i <= num ** 2; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.brightness = 1; //sets initial brightness to 100%
        square.style.backgroundColor = getRandomMosaicHsl();
        gridContainer.appendChild(square);
    }
    resizeSquares(gridContainer, containerSize, num);

    setupHoverEffect(gridContainer);
}

function resizeGrid() {
    const containerSize = calcContainerSize();
    setContainerSize(siteWrapper, containerSize);
    setContainerSize(gridContainer, containerSize);
    resizeSquares(gridContainer, containerSize, numberOfSquares);
} 

// function getRandomLightBlueHsl() {
//   const h = 240; // Blue hue
//   const s = Math.floor(Math.random() * 31) + 70; // Saturation 70-100
//   const l = Math.floor(Math.random() * 26) + 70; // Lightness 70-95
//   return `hsl(${h}, ${s}%, ${l}%)`;
// }

function getRandomMosaicHsl() {
  // Seed colors [hue, sat, light]
  const seeds = [
    [200, 80, 50], // Sea Blue
    [175, 70, 45], // Turquoise
    [50, 90, 60],  // Lemon Yellow
    [15, 70, 50]   // Terracotta Red
  ];

  // Pick a random seed
  const [h, s, l] = seeds[Math.floor(Math.random() * seeds.length)];

  // Add some variation so results don’t look too uniform
  const hue = (h + (Math.random() * 20 - 10) + 360) % 360; // ±10° hue shift
  const sat = Math.min(100, Math.max(50, s + Math.floor(Math.random() * 21) - 10)); // ±10, clamp 50–100
  const light = Math.min(95, Math.max(35, l + Math.floor(Math.random() * 21) - 10)); // ±10, clamp 35–95

  return `hsl(${Math.round(hue)}, ${sat}%, ${light}%)`;
}

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
  };
};

const debouncedResize = debounce(resizeGrid, 150);

clearButton.addEventListener('click', () => (createGrid(numberOfSquares)));

newGridButton.addEventListener('click', () => {
  let squareInput = parseInt(prompt(`Enter a number of squares between ${MIN_SQUARES} and ${MAX_SQUARES}`, numberOfSquares), 10);
  if (isNaN(squareInput)) return;
  numberOfSquares = Math.max(MIN_SQUARES, Math.min(MAX_SQUARES, squareInput));
  createGrid(numberOfSquares);
});

window.addEventListener('resize', debouncedResize);

createGrid(numberOfSquares);
