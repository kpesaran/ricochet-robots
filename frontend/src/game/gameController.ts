import { Board } from "../board/board"
import { BoardBuilder } from "../util/boardBuilder"
import { SceneController } from "../scene/sceneController"
import InputController from "../util/inputController"
import UIController from "../util/uiController"
import BoardStateHistory from "../util/boardStateHistory"

export class GameController {
    board: Board
    sceneController: SceneController
    inputController: InputController
    UIController: UIController
    boardHistory: BoardStateHistory
    
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.build()
        this.inputController = new InputController(this)
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.UIController = new UIController(this)
        this.boardHistory = new BoardStateHistory()
        
        
    }
    // Methods to update game state based on user choices
    reverseLastMove() {
        // Update display
        this.UIController.reduceMoveCount()
        // Update board history
        this.boardHistory.undoState(this.board)
        // Update scene
        this.sceneController.placeRobots(this.board)
        console.log(this.board.robotPositions)
        
    }
    
    slideNorth() {
        // update history
        
        let newPos = this.board.findMoves().north
       
        if (newPos) {
            // store history
            this.boardHistory.addState(this.board)
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.increaseMoveCount()
            
        }
    }

    slideSouth() {
        let newPos = this.board.findMoves().south
       
        if (newPos) {
            // store history
            this.boardHistory.addState(this.board)
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.increaseMoveCount()
            
        }
    }
    slideEast() {
        let newPos = this.board.findMoves().east
       
        if (newPos) {
            // store history
            this.boardHistory.addState(this.board)
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.increaseMoveCount()
        }

    }

    slideWest() {
        let newPos = this.board.findMoves().west
       
        if (newPos) {
            // store history
            this.boardHistory.addState(this.board)
             // update board state
            this.board.robotPositions[0].row = newPos.row
            this.board.robotPositions[0].column = newPos.column
            // update scene
            this.sceneController.updateTargetRobot()
            // Update UI counter
            this.UIController.increaseMoveCount()
            // Update board history
        }
        
    }
    // Move a non-target Robot 
}
   
    


    

