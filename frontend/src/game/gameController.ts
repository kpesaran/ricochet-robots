import { Board } from "../board/board"
import { BoardBuilder } from "../util/boardBuilder"
import { SceneController } from "../scene/sceneController"
import InputController from "../util/inputController"
import UIController from "../util/uiController"

export class GameController {
    board: Board
    sceneController: SceneController
    inputController: InputController
    UIController: UIController
    
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.build()
        this.inputController = new InputController(this)
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.UIController = new UIController()
        
    }
    // Methods to update game state based on user choices
    
    slideNorth() {
        let newPos = this.board.findMoves().north
       
        if (newPos) {
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.updateMoveCount()
        }
    }

    slideSouth() {
        let newPos = this.board.findMoves().south
       
        if (newPos) {
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.updateMoveCount()
        }
    }
    slideEast() {
        let newPos = this.board.findMoves().east
       
        if (newPos) {
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.updateMoveCount()
        }

    }

    slideWest() {
        let newPos = this.board.findMoves().west
       
        if (newPos) {
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.updateMoveCount()
        }
        
    }
    
  
    // Move a non-target Robot 

  

    
}
   
    


    

