const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');

const GRID_SIZE = 8; 
const TILE_SIZE = canvas.width / GRID_SIZE;
const COLORS = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93']; // Toy Blast style colors

let grid = [];
let score = 0;
let moves = 20;

// Initialize Grid
function initGrid() {
    grid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        grid[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            grid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c]) {
                ctx.fillStyle = grid[r][c];
                // Draw rounded rectangles for a "toy" look
                drawRoundedRect(c * TILE_SIZE + 2, r * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4, 8);
                
                // Add a little highlight for shine
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(c * TILE_SIZE + 10, r * TILE_SIZE + 8, TILE_SIZE - 30, 5);
            }
        }
    }
}

function drawRoundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
}

// Find connected cubes of same color (Flood Fill Algorithm)
function getMatches(row, col, color, visited = new Set()) {
    const key = `${row},${col}`;
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || 
        visited.has(key) || grid[row][col] !== color) {
        return [];
    }

    visited.add(key);
    let matches = [{row, col}];

    matches = matches.concat(getMatches(row + 1, col, color, visited));
    matches = matches.concat(getMatches(row - 1, col, color, visited));
    matches = matches.concat(getMatches(row, col + 1, color, visited));
    matches = matches.concat(getMatches(row, col - 1, color, visited));

    return matches;
}

function handleAction(e) {
    if (moves <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    const color = grid[row][col];
    const matches = getMatches(row, col, color);

    if (matches.length >= 2) {
        // Blast them!
        matches.forEach(m => grid[m.row][m.col] = null);
        score += matches.length * 10;
        moves--;
        
        updateUI();
        applyGravity();
        
        setTimeout(() => {
            fillEmpty();
            drawGrid();
        }, 200);
    }
}

function applyGravity() {
    for (let c = 0; c < GRID_SIZE; c++) {
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
            if (grid[r][c] === null) {
                for (let k = r - 1; k >= 0; k--) {
                    if (grid[k][c] !== null) {
                        grid[r][c] = grid[k][c];
                        grid[k][c] = null;
                        break;
                    }
                }
            }
        }
    }
    drawGrid();
}

function fillEmpty() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === null) {
                grid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
        }
    }
}

function updateUI() {
    scoreEl.innerText = score;
    movesEl.innerText = moves;
    if (moves <= 0) {
        alert("Game Over! Your score: " + score);
        location.reload();
    }
}

canvas.addEventListener('mousedown', handleAction);
initGrid();
drawGrid();