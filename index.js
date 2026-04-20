const Gameboard = (() => { 
    // Initializing the gameboard
    let gameboard = ["","","","","","","","",""]

    // For displaying the gameboard
    const render = () => {
        let boardHTML = ""
        gameboard.forEach((square, index)=>{
            boardHTML += `<div class="square" id="square-${index}" data-mark="${square}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML
        const squares = document.querySelectorAll(".square")
        squares.forEach((square)=>{
            square.addEventListener("click", Game.handleClick)
        })
    }
    
    // Update board state at given index
    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }
    
    const getBoard = () => gameboard;

    return {
        render,
        update,
        getBoard
    }
})();

// Factory function to create a player
const createPlayer = (name, mark) => {
    return {
        name, mark
    }
}

// The gameController which controls all the functions of the game
const Game = (() => {
    let players = [] 
    let currentPlayerIndex; //keeps check of the current player
    let gameOver; //checks if the game is still in play

    // To start the game
    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value || "Player 1", "X"),
            createPlayer(document.querySelector("#player2").value || "Player 2", "O")
        ]

        currentPlayerIndex = 0
        gameOver = false
        Gameboard.render();
        displayMessage(`${players[currentPlayerIndex].name}'s turn (X)`);
    }

    // Handles the click for every square
    const handleClick = (event) => {
        if (gameOver) return;
        
        let index = parseInt(event.target.id.split("-")[1])
        
        if (Gameboard.getBoard()[index] !== "") return;
        
        Gameboard.update(index, players[currentPlayerIndex].mark);
        
        if (checkForWin(Gameboard.getBoard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayMessage(`${players[currentPlayerIndex].name} won!`);
        } else if (checkForTie(Gameboard.getBoard())) {
            gameOver = true;
            displayMessage("It's a tie!");
        } else {
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            displayMessage(`${players[currentPlayerIndex].name}'s turn (${players[currentPlayerIndex].mark})`);
        }
    }
    
    const restart = () => {
        for (let i = 0; i < 9; i++){
            Gameboard.update(i, "");
        }
        Gameboard.render();
        
        if (players.length > 0) {
            currentPlayerIndex = 0;
            gameOver = false;
            displayMessage(`${players[currentPlayerIndex].name}'s turn (X)`);
        } else {
            document.querySelector("#message").innerHTML = "";
            gameOver = true; // Still waiting for start
        }
    }

    return {
        start, 
        handleClick,
        restart
    }
})();

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

const displayMessage = (message) => {
    // We update message with an animation by forcing a reflow
    const messageEl = document.querySelector("#message");
    messageEl.innerHTML = message;
    messageEl.classList.remove("fade-in");
    void messageEl.offsetWidth; // trigger reflow
    messageEl.classList.add("fade-in");
}

const startButton = document.querySelector("#start-button")
startButton.addEventListener("click", () => {
    Game.start()
})

const restartButton = document.querySelector("#restart-button")
restartButton.addEventListener("click", () => {
    Game.restart()
})

// Initialize the board on load but do not allow play yet
Gameboard.render();
Game.restart();