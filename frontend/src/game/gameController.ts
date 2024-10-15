import { Board } from "../board/board"

import { BoardBuilder } from "../util/boardBuilder"
import { SceneController } from "../scene/sceneController"
import InputController from "../util/inputController"
import UIController from "../util/uiController"
import RobotStateHistory from "../util/robotStateHistory"
import { Position } from "../board/position"
import { Direction } from "../board/direction"

export class GameController {
    board: Board
    sceneController: SceneController
    inputController: InputController
    UIController: UIController
    boardHistory: RobotStateHistory
    
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.generateEdgeWalls().generatePairedWalls().build()
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.inputController = new InputController(this, this.sceneController)
        this.UIController = new UIController()
        this.boardHistory = new RobotStateHistory()
    }
    // Methods to update game state based on user choices
    resetGame() {
        // use original state and wipe history
        this.boardHistory.initialBoardState(this.board)
        this.boardHistory = new RobotStateHistory()
        // update scene
        this.sceneController.placeRobots(this.board)
        // update display
        this.UIController.resetCount()


    }
    reverseLastMove() {
        // Update display
        this.UIController.reduceMoveCount()
        // Update board history
        this.boardHistory.undoState(this.board)
        // Update scene
        this.sceneController.placeRobots(this.board)
        
    }

    slideTargetRobot(direction: Direction) {
        let endingPositions = this.board.findMoves()
        let newPos 
        if (direction === Direction.North) {
            newPos = endingPositions.north
        }
        else if (direction === Direction.West) {
            newPos = endingPositions.west
        }
        else if (direction === Direction.East) {
            newPos = endingPositions.east
        }
        else if (direction === Direction.South) {
            newPos = endingPositions.south
        }
        if (newPos) {
            // store history
            this.boardHistory.addState(this.board)
             // update board state
            this.board.updateRobotPosition(newPos, 0)
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
        this.board.updateRobotPosition(newPosition, robotIndex!)

        // Update Scene
        this.sceneController.placeRobots(this.board)

        // Update score
        this.UIController.increaseMoveCount()
    }
}
   
    


    

