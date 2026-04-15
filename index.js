// Player creating factory function
const Player = (name, sign) => {
    this.name = name;
    this.sign = sign;
    return { name, sign }
}

// Creating the instances of players required
const player1 = Player("P1", "X")
const player2 = Player("P2", "O")

// GameBoard object
const GameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""]
    const setValue = (index, sign) => {
        board[index] = sign
    }
    const getValue = (index) => {
        return board[index]
    }
    const resetBoard = ()=>{
        for (let i = 0; i < board.length; i++) {
            board[i] = ""
        }
    }
})()

// GameController function for marking the board with the sign and futher checking for the winner
