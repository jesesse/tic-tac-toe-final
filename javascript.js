//FACTORY FUNCTION FOR CREATING PLAYERS
const player = function (mark) {
    return {
        mark
    }
}

/*
Next step is to keep track of empty squares (array of empty indexes) sp that AI can schoose the id of the square of them, 
instead of "keep guessin" of all the of the board until it finds a empty square
*/
//MODULE FOR HANDLING GAMEBOARD DATA
const gameboardData = (() => {

    let gameboard = [];

    function createGameboard() {
        gameboard = [];
        freeSquares = [];
        for (i = 0; i < 9; i++) {
            let newSquare = document.createElement('button');
            newSquare.classList.add('square');
            newSquare.setAttribute('id', i);
            newSquare.addEventListener('click', (e) => gameControl.playRound(e.target));
            gameboard.push(newSquare);
        }
    }

    function setMark(square, currentPlayer) {
        square.textContent = currentPlayer.mark;
    }

    function getGameboard() {
        return gameboard;
    }

    return {
        setMark,
        createGameboard,
        getGameboard,
    }
})();


//MODULE FOR TAKING CARE OF UI.
const displayController = (() => {

    let gameboardContainer = document.querySelector('.gameboard');
    let gameOver = document.querySelector('.game-over');
    let gameOverText = document.querySelector('.game-over-text');
    let restartBtn = document.querySelector('.restart-Btn');

    function renderGameboard() {
        while (gameboardContainer.lastChild) gameboardContainer.removeChild(gameboardContainer.lastChild);
        for (i = 0; i < 9; i++) {
            gameboardContainer.appendChild(gameboardData.getGameboard()[i]);
        }
    }

    function showGameOver(message) {
        gameOverText.textContent = message;
        gameOver.style.display = 'flex';
    }

    function clearGameOver() {
        gameOver.style.display = 'none';
    }

    restartBtn.addEventListener('click', () => gameControl.newGame())

    return {
        renderGameboard,
        showGameOver,
        clearGameOver
    }

})();


//MODULE FOR GAME FLOW AND LOGIC
const gameControl = (() => {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let player1;
    let computerAI;
    let currentPlayer;
    let win;
    let tie;

    newGame();

    //Sets up a new game by reseting all previous conditions and clears the gameboard and renders an empty gameboard.
    function newGame() {
        player1 = player('X');
        computerAI = player('O');
        currentPlayer = player1;
        win = false;
        tie = false;
        gameboardData.createGameboard();
        displayController.renderGameboard();
        displayController.clearGameOver();
    }


    /* 
    Sets a currentPlayers mark on the gameboard and calls for function to check for conditions for game over.
    If not, changeplayer and continue the game. If square is already filled or game is already won, cannot click the square.
    This function first launches when a player has pressed a gameboard square. And after that it is automatically called again for AIs turn. 
    */
    async function playRound(square) {
        if (currentPlayer == computerAI) {
            square = aiChooseSquare();
            await sleep(400);
        }

        if (square.textContent) return;
        gameboardData.setMark(square, currentPlayer);

        checkForGameOver();

        if (win || tie) gameOver();
        else {
            if (currentPlayer == player1) {
                currentPlayer = computerAI;
                playRound();
            }
            else currentPlayer = player1;
        }
    }


    /*
    Randomly chooses an empty square from the gameboard free squares array for the AI to set mark on. 
    */
    function aiChooseSquare() {

        let bestScore = +Infinity;
        let bestMove;
        let board = gameboardData.getGameboard();

        // Go through every gameboard square, and for each of them, calculate all the possible game scenarios, 
        // and based on that, determine which is the best square to place your mark.
        for (let i = 0; i < board.length; i++) {

            if (board[i].textContent) continue;         //If square is taken, move to a next square

            board[i].textContent = currentPlayer.mark;  //place a mark to see if this is the best possible move

            let score = minimax(board, true);           // with the move on the board, recursively go see all the possible game scenarios with this move and evaluate how good the move is.

            if (score < bestScore) {                    // if the move is better than the previous best move, then this is the best move for now.
                bestScore = score;
                bestMove = board[i];                    // with the highest score, the best place to put the marker is on this index of the gameboard.
            }

            board[i].textContent = '';                   // clear the board for next possible move
        }

        return bestMove;                           

    }


    function minimax(board, isMaximazing) {

        checkForGameOver();

        if (win && currentPlayer == computerAI) {
            win = false;
            return -10;
        }
        if (win && currentPlayer == player1) {
            win = false;
            return 10;
        }
        if (tie) {
            tie = false;
            return 0;
        }

        if (isMaximazing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i].textContent) continue;


                currentPlayer = player1;
                board[i].textContent = currentPlayer.mark;

                let score = minimax(board, false);

                bestScore = Math.max (score, bestScore)
                
                board[i].textContent = '';
                currentPlayer = computerAI;

            }

            return bestScore;

        } else {
            let bestScore = +Infinity;
            for (let i = 0; i < board.length; i++) {

                if (board[i].textContent) continue;


                currentPlayer = computerAI;
                board[i].textContent = currentPlayer.mark;

                let score = minimax(board, true);

                bestScore = Math.min(score, bestScore)

                board[i].textContent = '';
                currentPlayer = player1;
            }

            return bestScore;
        }

    }



    /*
    Sets the logic for conditions for the ending of the game: win or a draw.
    */
    function checkForGameOver() {

        if (checkForRows()) win = true;
        if (checkForColumns()) win = true;
        if (checkForDiagonals()) win = true;
        if (checkForTie()) tie = true;

        function checkForRows() {
            for (let i = 0; i < 7; i += 3) {
                if (gameboardData.getGameboard()[i].textContent == currentPlayer.mark &&
                    gameboardData.getGameboard()[i + 1].textContent == currentPlayer.mark &&
                    gameboardData.getGameboard()[i + 2].textContent == currentPlayer.mark) {
                    return true;
                }
            }
        }

        function checkForColumns() {
            for (let i = 0; i < 3; i++) {
                if (gameboardData.getGameboard()[i].textContent == currentPlayer.mark &&
                    gameboardData.getGameboard()[i + 3].textContent == currentPlayer.mark &&
                    gameboardData.getGameboard()[i + 6].textContent == currentPlayer.mark) {
                    return true;
                }
            }
        }

        function checkForDiagonals() {
            if (gameboardData.getGameboard()[0].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[4].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[8].textContent == currentPlayer.mark) {
                return true;
            }

            if (gameboardData.getGameboard()[2].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[4].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[6].textContent == currentPlayer.mark) {
                return true;
            };
        }

        function checkForTie() {
            let isTie;
            for (let i = 0; i < gameboardData.getGameboard().length; i++) {
                if (gameboardData.getGameboard()[i].textContent && !win) isTie = true;
                else return false;
            }
            return isTie;
        }
    }

    function gameOver() {
        gameboardData.getGameboard().forEach(square => square.setAttribute('disabled', ''));
        if (win) displayController.showGameOver(currentPlayer.mark + " WINS!");
        if (tie) displayController.showGameOver("Its a tie");
    }

    return {
        playRound,
        newGame
    }

})();