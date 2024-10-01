import { Board } from "../board/board"

import { BoardBuilder } from "../util/boardBuilder"
import { SceneController } from "../scene/sceneController"
import InputController from "../util/inputController"
import UIController from "../util/uiController"
import RobotStateHistory from "../util/RobotStateHistory"
import { Position } from "../board/position"

export class GameController {
    board: Board
    sceneController: SceneController
    inputController: InputController
    UIController: UIController
    boardHistory: RobotStateHistory
    
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.build()
        this.inputController = new InputController(this)
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.UIController = new UIController()
        this.boardHistory = new RobotStateHistory()
    }
    // Methods to update game state based on user choices
    reverseLastMove() {
        // Update display
        this.UIController.reduceMoveCount()
        // Update board history
        this.boardHistory.undoState(this.board)
        // Update scene
        this.sceneController.placeRobots(this.board)
        
    }
    
    slideNorth() {
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
        }
        
    }
    // Move a non-target Robot 
    handleNonTargetRobotMove(newPosition: Position,robotIndex: number | null) {
        // add to history
        this.boardHistory.addState(this.board) 

        // Update board state 
      
      if (robotIndex) {
        this.board.robotPositions[robotIndex] = { row: newPosition.row, column: newPosition.column }
        
      }
        // Update Scene
        this.sceneController.placeRobots(this.board)

        // Update score
        this.UIController.increaseMoveCount()
    }
}
   
    


    

