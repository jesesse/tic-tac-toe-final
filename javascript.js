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
    let player2;
    let currentPlayer;
    let moves;
    let win;

    newGame();

    //Resets all previous conditions and starts a new game.
    //Clears the gameboard and renders and ampty gameboard.
    function newGame() {
        player1 = player('X');
        player2 = player('O');
        currentPlayer = player1;
        moves = 9;
        win = false;

        gameboardData.createGameboard();
        displayController.renderGameboard();
        displayController.clearGameOver();
    }


    /* Sets a currentPlayers mark on the gameboard and calls for function to check if they have won, or if its a draw. if not, changeplayer and continue the game. */
    function setMark(square) {
        if (square.textContent || win) return;
        square.textContent = currentPlayer.mark;
        moves--;
        if (checkForGameOver()) gameOver();
        else changeCurrentPlayer();
    }

    /*Sets the logic for conditions for the ending of the game: win or a draw.
    */ 
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

        if (moves == 0) return true;
    }

    function changeCurrentPlayer() {
        if (currentPlayer == player1) currentPlayer = player2;
        else currentPlayer = player1;
    }

      /*Sets the correct message to be displayed for user when the game is over and calls the displayController to show it and prompt a newgame option*/ 
      function gameOver() {
        let message;
        if (moves == 0 && win == false) message = "IT'S A DRAW"
        else message = currentPlayer.mark + " WINS!"
        displayController.showGameOver(message);
    }

    return {
        setMark,
        newGame
    }

})();