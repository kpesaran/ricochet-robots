import { Board } from "../board/board"
import { BoardBuilder } from "../util/boardBuilder"



export class GameController {
    board: Board
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.build()
    }



    // Methods to update game state based on user choices

    slideNorth() {

    }

    slideSouth() {

    }

    slideEast() {

    }

    slideWest() {

    }

   
    // Move a non-target Robot

    // moveRobotNorth() {
    //     const currentPosition = this.board.robotPositions[0]
    //     const positionNorth = this.board.checkDirections(currentPosition.row, currentPosition.column, 'North')
        
    //     if (positionNorth) {
    //         this.board.robotPositions[0]= positionNorth
    //     }
    //     this.updateRobotsUI()
    // }


    

}
