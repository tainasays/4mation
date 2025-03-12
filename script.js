const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const size = 7;
let currentPlayer = 'blue';
let lastMove = null;
let boardState = Array(size).fill(null).map(() => Array(size).fill(null));

function createBoard() {
    board.innerHTML = ''; // Limpa o tabuleiro existente
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', cellClick);
            board.appendChild(cell);
        }
    }
    updateMessage();
}

function cellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (boardState[row][col] !== null) return;

    if (lastMove && !isValidMove(row, col) && hasValidMoves()) return;

    boardState[row][col] = currentPlayer;
    cell.classList.add(currentPlayer);
    
    lastMove = { row, col };
    
    // atualiza movimentos válidos
    highlightValidMoves();
    
    // verifica vitória ou empate
    setTimeout(() => {
        if (checkWin(row, col)) {
            message.textContent = `${currentPlayer === 'blue' ? 'Azul' : 'Vermelho'} venceu!`;
            board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', cellClick));
            return;
        }
        
        if (isBoardFull()) {
            message.textContent = 'Empate!';
            board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', cellClick));
            return;
        }
        
        currentPlayer = currentPlayer === 'blue' ? 'red' : 'blue';
        updateMessage();
    }, 100);
}

function isValidMove(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    return directions.some(([dx, dy]) => {
        const newRow = lastMove.row + dx;
        const newCol = lastMove.col + dy;
        return newRow === row && newCol === col;
    });
}

function highlightValidMoves() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('valid');
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (boardState[row][col] === null && (!lastMove || isValidMove(row, col) || !hasValidMoves())) {
            cell.classList.add('valid');
        }
    });
}
// atualiza mensagem
function updateMessage() {
    message.textContent = `Vez do jogador: ${currentPlayer === 'blue' ? 'Azul' : 'Vermelho'}`;
}

function checkWin(row, col) {
    const directions = [
        [[-1, -1], [1, 1]], [[-1, 0], [1, 0]], [[-1, 1], [1, -1]],
        [[0, -1], [0, 1]], [[1, -1], [-1, 1]], [[1, 0], [-1, 0]], [[1, 1], [-1, -1]]
    ];

    return directions.some(direction => {
        return direction.reduce((count, [dx, dy]) => {
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < size && c >= 0 && c < size && boardState[r][c] === currentPlayer) {
                count++;
                r += dx;
                c += dy;
            }
            return count;
        }, 1) >= 4;
    });
}

function isBoardFull() {
    return boardState.flat().every(cell => cell !== null);
}

function hasValidMoves() {
    if (!lastMove) return true;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    return directions.some(([dx, dy]) => {
        const newRow = lastMove.row + dx;
        const newCol = lastMove.col + dy;
        return newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && boardState[newRow][newCol] === null;
    });
}

function restartGame() {
    currentPlayer = 'blue';
    lastMove = null;
    boardState = Array(size).fill(null).map(() => Array(size).fill(null));
    createBoard();
    highlightValidMoves();
}

restartButton.addEventListener('click', restartGame);

createBoard();
highlightValidMoves();
