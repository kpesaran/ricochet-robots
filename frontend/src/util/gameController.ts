import { Board } from "../board/board"
import { BoardBuilder } from "./boardBuilder"
import { Robot } from "../board/robot"


export class GameController {
    board: Board
    constructor() {
        this.board = new BoardBuilder.build()
    }



    // updateRobotsUI() {
        
    // }

    // moveRobotNorth() {
    //     const currentPosition = this.board.robotPositions[0]
    //     const positionNorth = this.board.checkDirections(currentPosition.row, currentPosition.column, 'North')
        
    //     if (positionNorth) {
    //         this.board.robotPositions[0]= positionNorth
    //     }
    //     this.updateRobotsUI()
    // }


    

}
