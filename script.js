// DOM Elements
const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const turnDisplay = document.getElementById('turn-display');
const scoreDisplay = document.getElementById('score-display');
const newGameBtn = document.getElementById('new-game-btn');
const messageDisplay = document.getElementById('message-display');

// Game State Variables
let currentBoardSize;
let winCondition;
let board; // 2D array representing the game grid
let currentPlayer; // 'X' (player) or 'O' (AI)
let gameActive;
let currentLevel;
let playerScore = 0;
let aiScore = 0;
let draws = 0;
const maxLevel = 7; // Example max level, corresponds to a (7+2)x(7+2) = 9x9 board

// --- Game Initialization ---
function initializeGame(level) {
    currentLevel = level;
    currentBoardSize = currentLevel + 2; // Level 1 -> 3x3, Level 2 -> 4x4, etc.
    // Winning condition: 3-in-a-row for 3x3, 4 for 4x4, 5 for 5x5 and larger boards.
    winCondition = Math.min(currentBoardSize, 5);

    board = Array.from({ length: currentBoardSize }, () =>
        Array(currentBoardSize).fill('')
    );
    currentPlayer = 'X'; // Player X always starts
    gameActive = true;

    messageDisplay.style.opacity = '0';
    messageDisplay.style.pointerEvents = 'none'; // Ensure clicks pass through when hidden
    renderBoard();
    updateDisplay();
}

// --- Render Board Dynamically ---
function renderBoard() {
    gameBoard.innerHTML = ''; // Clear previous board cells
    gameBoard.style.gridTemplateColumns = `repeat(${currentBoardSize}, 1fr)`;

    for (let r = 0; r < currentBoardSize; r++) {
        for (let c = 0; c < currentBoardSize; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

// --- Update UI Display (Level, Turn, Score) ---
function updateDisplay() {
    levelDisplay.textContent = `Level: ${currentLevel} (${currentBoardSize}x${currentBoardSize})`;

    const playerSymbolSpan = document.createElement('span');
    playerSymbolSpan.classList.add('current-player-symbol', `player-${currentPlayer}`);
    playerSymbolSpan.textContent = currentPlayer;

    turnDisplay.innerHTML = ''; // Clear previous content
    turnDisplay.append('Player ', playerSymbolSpan, `'s Turn`);

    scoreDisplay.textContent = `Score: P ${playerScore} | AI ${aiScore} | D ${draws}`;
}

// --- Handle Cell Click Event ---
function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Ignore click if game is not active or cell is already marked
    if (!gameActive || board[row][col] !== '') return;

    makeMove(row, col, currentPlayer);

    if (checkWin(row, col, currentPlayer)) {
        handleGameEnd(currentPlayer);
    } else if (checkDraw()) {
        handleGameEnd('Draw');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        updateDisplay();
        if (currentPlayer === 'O') {
            setTimeout(aiMove, 700); // AI moves after a short delay for better UX
        }
    }
}

// --- Make a move (update board data and UI) ---
function makeMove(row, col, player) {
    board[row][col] = player;
    const cellElement = gameBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.textContent = player;
    cellElement.classList.add('marked', `player-${player}-mark`);
}

// --- Check Win Condition ---
function checkWin(row, col, player) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1] // Horizontal, Vertical, Diagonal (\), Diagonal (/)
    ];

    // Check in all 4 main directions and their opposites
    for (const [dr, dc] of directions) {
        let count = 1;
        count += countConsecutive(row, col, dr, dc, player); // Positive direction
        count += countConsecutive(row, col, -dr, -dc, player); // Negative direction

        if (count >= winCondition) {
            return true;
        }
    }
    return false;
}

// Helper function to count consecutive marks in a given direction
function countConsecutive(row, col, dr, dc, player) {
    let count = 0;
    // Iterate up to winCondition - 1 steps (as the initial cell is already counted)
    for (let i = 1; i < winCondition; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        // Check bounds and if the cell matches the player's mark
        if (newRow >= 0 && newRow < currentBoardSize &&
            newCol >= 0 && newCol < currentBoardSize &&
            board[newRow][newCol] === player) {
            count++;
        } else {
            break; // Stop if boundary or non-matching cell is found
        }
    }
    return count;
}

// --- Check Draw Condition ---
function checkDraw() {
    return board.every(row => row.every(cell => cell !== ''));
}

// --- Handle Game End (Win/Loss/Draw) ---
function handleGameEnd(result) {
    gameActive = false;
    let message = '';

    if (result === 'X') { // Player wins
        playerScore++;
        message = 'Player X Wins!';
        if (currentLevel < maxLevel) {
            messageDisplay.style.backgroundImage = 'var(--accent-gradient-1)'; // Player win gradient
            showMessage(message);
            setTimeout(() => initializeGame(currentLevel + 1), 2000); // Advance to next level
        } else {
            // Player won at max level
            showMessage('YOU CONQUERED THE NEXUS!');
            setTimeout(() => {
                messageDisplay.style.opacity = '0';
                alert('Congratulations, you have mastered all levels! Starting a new game from Level 1.');
                playerScore = 0; aiScore = 0; draws = 0; // Reset scores for a fresh start
                initializeGame(1);
            }, 3000);
        }
    } else if (result === 'O') { // AI wins
        aiScore++;
        message = 'AI Wins!';
        messageDisplay.style.backgroundImage = 'var(--accent-gradient-2)'; // AI win gradient
        showMessage(message);
    } else { // Draw
        draws++;
        message = 'It\'s a Draw!';
        // Custom gradient for draw messages
        messageDisplay.style.backgroundImage = 'linear-gradient(45deg, #a770ef 0%, #cf8bf3 50%, #fbc2eb 100%)';
        showMessage(message);
    }
    updateDisplay();
}

// --- Display Game Message (e.g., "Player X Wins!") ---
function showMessage(msg) {
    messageDisplay.textContent = msg;
    messageDisplay.style.opacity = '1';
    messageDisplay.style.pointerEvents = 'auto'; // Block clicks while message is up
    messageDisplay.style.animation = 'none'; // Reset animation
    void messageDisplay.offsetWidth; // Trigger reflow
    messageDisplay.style.animation = 'fadeInScale 0.5s forwards'; // Re-apply animation

    // Hide message after a delay, unless it's a player win that leads to a new level
    if (msg !== 'Player X Wins!' || currentLevel >= maxLevel) {
        setTimeout(() => {
            if (!gameActive) { // Only hide if the game is still inactive (i.e. not immediately restarting for next level)
                messageDisplay.style.animation = 'none'; // Stop animation so it doesn't override opacity
                messageDisplay.style.opacity = '0';
                messageDisplay.style.pointerEvents = 'none';
            }
        }, 1500);
    }
}

// --- AI Logic (Basic: Win, Block, then Random) ---
function aiMove() {
    if (!gameActive) return;

    // 1. Check if AI can win on its current turn
    let bestMove = findStrategicMove('O');
    if (bestMove) {
        makeMove(bestMove.row, bestMove.col, 'O');
        if (checkWin(bestMove.row, bestMove.col, 'O')) {
            handleGameEnd('O');
            return;
        }
    }

    // 2. If no winning move for AI, check if Player (X) can win and block them
    if (!bestMove) {
        bestMove = findStrategicMove('X'); // Check for player X's winning move
        if (bestMove) {
            makeMove(bestMove.row, bestMove.col, 'O'); // Block player X
            if (checkWin(bestMove.row, bestMove.col, 'O')) { // Edge case: blocking creates AI win
                handleGameEnd('O');
                return;
            }
        }
    }

    // 3. Otherwise, make a random move
    if (!bestMove) {
        const emptyCells = [];
        for (let r = 0; r < currentBoardSize; r++) {
            for (let c = 0; c < currentBoardSize; c++) {
                if (board[r][c] === '') {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const { row, col } = emptyCells[randomIndex];
            makeMove(row, col, 'O');
            if (checkWin(row, col, 'O')) { // Check if random move results in AI win
                handleGameEnd('O');
                return;
            }
        }
    }

    // After AI's move, check for draw
    if (checkDraw()) {
        handleGameEnd('Draw');
        return;
    }

    // If game continues, switch back to Player X
    currentPlayer = 'X';
    updateDisplay();
}

// Helper function for AI to find a winning or blocking move
function findStrategicMove(player) {
    // Iterate through all empty cells
    for (let r = 0; r < currentBoardSize; r++) {
        for (let c = 0; c < currentBoardSize; c++) {
            if (board[r][c] === '') {
                board[r][c] = player; // Temporarily make the move
                if (checkWin(r, c, player)) {
                    board[r][c] = ''; // Undo the temporary move
                    return { row: r, col: c }; // Found a winning/blocking move
                }
                board[r][c] = ''; // Undo the temporary move
            }
        }
    }
    return null; // No strategic move found
}

// --- Event Listeners ---
newGameBtn.addEventListener('click', () => {
    playerScore = 0; // Reset scores for a completely new game sequence
    aiScore = 0;
    draws = 0;
    initializeGame(1); // Start from Level 1
});

// Initial Game Setup on page load
initializeGame(1);