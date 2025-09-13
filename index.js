let numberOfSquares = 16;

function createGrid (num) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minDimension = Math.min(windowWidth, windowHeight);
    const containerSize = Math.floor(0.8 * minDimension);
    console.log(minDimension);

    const siteWrapper = document.querySelector('#siteWrapper');
    siteWrapper.style.width = siteWrapper.style.height = containerSize + 'px';

    let gridContainer = document.querySelector('.gridContainer');
    gridContainer.style.width = gridContainer.style.height = containerSize + 'px';

    if (gridContainer) {
      gridContainer.remove();
    }

    gridContainer = document.createElement('div');
    gridContainer.classList.add('gridContainer');
    
    siteWrapper.appendChild(gridContainer);

    for (let i = 1; i <= num ** 2; i++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.width = square.style.height = (containerSize / num) + 'px';
        square.dataset.brightness = 1; //sets initial brightness to 100%
        square.style.backgroundColor = getRandomMosaicHsl();
        gridContainer.appendChild(square);
    }
    
    let hoverTimeout;
    gridContainer.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('square')) {
            
          clearTimeout(hoverTimeout);

          hoverTimeout = setTimeout(() => {
            let brightness = parseFloat(e.target.dataset.brightness) || 1;
            const darkenValue = 0.1;
            brightness = Math.max(-0.1, brightness - darkenValue);
            e.target.dataset.brightness = brightness;
            e.target.style.filter = `brightness(${brightness})`;
          }, 25);
        }
    });

    gridContainer.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('square')) {
            clearTimeout(hoverTimeout);
        }
    });
}

function getRandomLightBlueHsl() {
  const h = 240; // Blue hue
  const s = Math.floor(Math.random() * 31) + 70; // Saturation 70-100
  const l = Math.floor(Math.random() * 26) + 70; // Lightness 70-95
  return `hsl(${h}, ${s}%, ${l}%)`;
}

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

const clearButton = document.querySelector('#clearGrid');
clearButton.addEventListener('click', () => (createGrid(numberOfSquares)));

const newGridButton = document.querySelector('#createGrid');
newGridButton.addEventListener('click', () => {
  let squareInput = parseInt(prompt("Enter a number of squares between 2 and 32", numberOfSquares), 10);
  if (isNaN(squareInput)) return;
  numberOfSquares = Math.max(2, Math.min(32, squareInput));
  createGrid(numberOfSquares);
});

function resizeGrid() {
  const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minDimension = Math.min(windowWidth, windowHeight);
    const containerSize = Math.floor(0.8 * minDimension);

    const siteWrapper = document.querySelector('#siteWrapper');
    siteWrapper.style.width = siteWrapper.style.height = containerSize + 'px';

    let gridContainer = document.querySelector('.gridContainer')
    gridContainer.style.width = gridContainer.style.height = containerSize + 'px';

    const squareSize = containerSize / numberOfSquares;
    const squares = gridContainer.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.width = square.style.height = squareSize + 'px';
    });
} 

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedResize = debounce(resizeGrid, 150);

window.addEventListener('resize', debouncedResize);

createGrid(numberOfSquares);
