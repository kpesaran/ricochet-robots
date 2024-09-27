import { Board } from "../board/board"
import { BoardBuilder } from "./boardBuilder"



export class GameController {
    board: Board
    constructor() {
        this.board = new BoardBuilder.build()
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
