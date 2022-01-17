class Board{
    constructor(width, height) {
        this.widht = width;
        this.height = height;

        const gameBoard  = new Array(10);
    

        for (var i = 0; i < 10; i++) {
            gameBoard[i] = new Array(10).fill(0);
            
        }


        this.game = gameBoard;
        this.winStates = [
            [0, 1, 2], [3, 4, 5],[6, 7, 8],
            [0, 3, 6], [1, 4, 7],[2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        this.end = false
        this.turn = 'X'
        this.switch = new Map([['X', 'O'], ['O', 'X']])
    }

    move(height,width){
        console.log("move", height, width);
        // if (!this.game[index] && !this.end){
        //     const newState = [...this.game]
            //newState.splice(, 1, piece)

        if(this.game[height][width] === 0){
            this.game[height][width] = 1;

        }else if(this.game[height][width] === 1){
            this.game[height][width] = 2;

        }else if(this.game[height][width] === 2){
            this.game[height][width] = 0;

        }else{
            this.game[height][width] = 1;

        }

        console.log(this.game);
           
        //}


    }

    switchTurn(){
        this.turn = this.switch.get(this.turn)
    }

    checkWinner(player){
        return this.winStates.some(state =>(
          state.every((position => this.game[position] === player))
        ))
    }
    
    checkDraw(){
        return this.game.every(value => value !== null)
    }

    reset(){
        this.game = new Array(9).fill(null)
        this.tur = 'X'
    }
}

module.exports = Board