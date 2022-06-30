
//FACTORY FUNCTION FOR CREATING PLAYERS
const player = function (mark) {
    return {
        mark
    }
}


//MODULE FOR HANDLING GAMEBOARD DATA
const gameboardData = (() => {

    let gameboard = [];

    function createGameboard() {
        gameboard = [];
        freeSquares = [];
        for (i = 0; i < 9; i++) {
            let newSquare = document.createElement('div');
            newSquare.classList.add('square');
            newSquare.setAttribute('id', i);
            newSquare.addEventListener('click', referenceFunction = (e) => gameControl.setMark(e.target));
            gameboard.push(newSquare);
        }
    }

    function getGameboard() {
        return gameboard;
    }

    return {
        createGameboard,
        getGameboard
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
        gameOverText.textContent = "";
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
    
    
    let player1;
    let computerAI;
    let currentPlayer;
    let totalMoves;
    let win;

    newGame();

    //Sets up a new game by reseting all previous conditions and clears the gameboard and renders an empty gameboard.
    function newGame() {
        player1 = player('X');
        computerAI = player('O');
        currentPlayer = player1;
        totalMoves = 9;
        win = false;
        gameboardData.createGameboard();
        displayController.renderGameboard();
        displayController.clearGameOver();
    }


    /* Sets a currentPlayers mark on the gameboard and calls for function to check for conditions for game over. if not, changeplayer and continue the game. If square is already filled or game is already won, cannot click the square.
    
    This function first launches when a player has pressed a gameboard square. And after that it is automatically called again for AIs turn. */
    function setMark(square) {
        if (currentPlayer == computerAI) square = aiChooseSquare();
        if (square.textContent || win) return; 
        square.textContent = currentPlayer.mark;
        totalMoves--;
        if (checkForGameOver()) gameOver();
        else changeCurrentPlayer();
    }

    /*Randomly chooses an empty square from the gameboard array for the AI to set mark on. */
    function aiChooseSquare(){
        let randomIndex = Math.floor(Math.random() * (8 - 0 + 1) + 0);
        while (gameboardData.getGameboard()[randomIndex].textContent) {
            randomIndex = Math.floor(Math.random() * (8 - 0 + 1) + 0);
        }
        return gameboardData.getGameboard()[randomIndex]

    }

    /*Sets the logic for conditions for the ending of the game: win or a draw.*/ 
    function checkForGameOver() {

        //CHECK FOR ROW WINS:
        for (i = 0; i < 7; i += 3) {
            if (gameboardData.getGameboard()[i].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[i + 1].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[i + 2].textContent == currentPlayer.mark) {
                    win = true;
                    return true;
                }
        }

        //CHECK FOR COLUMN WINS:
        for (i = 0; i < 3; i++) {
            if (gameboardData.getGameboard()[i].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[i + 3].textContent == currentPlayer.mark &&
                gameboardData.getGameboard()[i + 6].textContent == currentPlayer.mark) {
                    win = true;
                    return true;
                }
        }

        //CHECK FOR DIAGONAL WINS:
        if (gameboardData.getGameboard()[0].textContent == currentPlayer.mark &&
            gameboardData.getGameboard()[4].textContent == currentPlayer.mark &&
            gameboardData.getGameboard()[8].textContent == currentPlayer.mark) {
                win = true;
                return true;
            }

        if (gameboardData.getGameboard()[2].textContent == currentPlayer.mark &&
            gameboardData.getGameboard()[4].textContent == currentPlayer.mark &&
            gameboardData.getGameboard()[6].textContent == currentPlayer.mark) {
                win = true;
                return true;
            };

        if (totalMoves == 0) return true;
    }

    /*Changes current player. If the next round is AIs turn, call setMark immediatley for AI to make its move. Else change current player to player to wait for user to make their move.*/
    function changeCurrentPlayer() {
        if (currentPlayer == player1) {
            currentPlayer = computerAI;
            setMark();
        }
        else currentPlayer = player1;
    }

      /*Sets the correct message to be displayed for user when the game is over and calls the displayController to show it and prompt a newgame option*/ 
      function gameOver() {
        let message;
        if (totalMoves == 0 && win == false) message = "IT'S A DRAW."
        else message = currentPlayer.mark + " WINS!"
        displayController.showGameOver(message);
    }

    return {
        setMark,
        newGame
    }

})();