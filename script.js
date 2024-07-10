var currentPlayer = 1;
var grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function clickCell(x, y) {
    if (grid[x][y] > 0) {
        alert("This cell is not empty");
    } else {
        placeToken(x, y, currentPlayer);
        if (checkWin(currentPlayer)) {
            document.getElementById("message").innerText = "Player " + (currentPlayer === 1 ? "1 (X)" : "2 (O)") + " wins!";
            disableGrid();
        } else if (checkDraw()) {
            document.getElementById("message").innerText = "It's a draw!";
        } else {
            currentPlayer = 2;
            setTimeout(computerMove, 500);  // Add a delay for better user experience
        }
    }
}

function placeToken(x, y, player) {
    document.getElementById("cell_" + x + "_" + y).style.color = player === 1 ? "#FF0000" : "#0000FF";
    document.getElementById("cell_" + x + "_" + y).innerHTML = player === 1 ? "X" : "O";
    grid[x][y] = player;
}

function computerMove() {
    let bestMove = findBestMove();
    placeToken(bestMove[0], bestMove[1], currentPlayer);
    if (checkWin(currentPlayer)) {
        document.getElementById("message").innerText = "Player " + (currentPlayer === 1 ? "1 (X)" : "2 (O)") + " wins!";
        disableGrid();
    } else if (checkDraw()) {
        document.getElementById("message").innerText = "It's a draw!";
    }
    currentPlayer = 1;
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === 0) {
                grid[i][j] = currentPlayer;
                let score = minimax(grid, 0, false);
                grid[i][j] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    move = [i, j];
                }
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(2)) return 10 - depth;
    if (checkWin(1)) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = 2;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = 0;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = 1;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = 0;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] === player && grid[i][1] === player && grid[i][2] === player) return true;
        if (grid[0][i] === player && grid[1][i] === player && grid[2][i] === player) return true;
    }
    if (grid[0][0] === player && grid[1][1] === player && grid[2][2] === player) return true;
    if (grid[0][2] === player && grid[1][1] === player && grid[2][0] === player) return true;
    return false;
}

function checkDraw() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    return true;
}

function disableGrid() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById("cell_" + i + "_" + j).onclick = null;
        }
    }
}

function reset() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            grid[i][j] = 0;
            document.getElementById("cell_" + i + "_" + j).innerHTML = "&nbsp;";
            document.getElementById("cell_" + i + "_" + j).onclick = function () { clickCell(i, j); };
        }
    }
    document.getElementById("message").innerText = "";
    currentPlayer = 1;
}
