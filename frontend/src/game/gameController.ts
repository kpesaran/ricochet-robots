import { Board } from "../board/board"
import { BoardBuilder } from "../util/boardBuilder"
import { SceneController } from "../scene/sceneController"
import InputController from "./inputController"



export class GameController {
    board: Board
    sceneController: SceneController
    inputController: InputController
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.build()
        this.inputController = new InputController(this)
        this.sceneController = new SceneController('canvas.webgl', this.board)

    }



    // Methods to update game state based on user choices

    slideNorth() {
        
    }

    slideSouth() {
        // let newPos = { row: 5, column: 0 }
        // this.board.robotPositions[0] = newPos
        // this.sceneController.placeRobots(this.board)
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
