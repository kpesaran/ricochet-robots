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
    menuOpen: Boolean
    controlsLocked: Boolean
    
    constructor() {
        const newBoard = new BoardBuilder()
        this.controlsLocked = false
        this.board = newBoard.build()
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.UIController = new UIController()
        this.inputController = new InputController(this, this.sceneController, this.UIController)
        this.boardHistory = new RobotStateHistory()
        this.menuOpen = false
    }
    // Methods to update game state based on user choices
    resetGame() {
        this.boardHistory.initialBoardState(this.board)
        this.boardHistory = new RobotStateHistory()
        this.sceneController.placeRobots(this.board)

        this.sceneController.lightUpPaths(0)
        this.UIController.resetCount()
    }

    newGame() {
        this.UIController.resetCount()
        this.boardHistory = new RobotStateHistory()
        const newBoard = new BoardBuilder()
        this.board = newBoard.buildRandom()
        this.sceneController.updateBoardPositions(this.board) 
    }

    reverseLastMove() {
        this.UIController.reduceMoveCount()
        this.boardHistory.undoState(this.board)
        this.sceneController.placeRobots(this.board)
    }

    checkWinCondition() {
        return this.board.checkRobotAtTarget()
    }

    handleWin() {
        this.UIController.toggleMainMenu()
    }

    slideRobot(robotIndex: number, direction: Direction) {
        let endingPositions = this.board.findMoves(robotIndex)
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
            this.boardHistory.addState(this.board)
            this.board.updateRobotPosition(newPos, robotIndex)
            this.sceneController.updateRobot(robotIndex)
            this.UIController.increaseMoveCount()
        }
        if (robotIndex === 0 && this.checkWinCondition()) {
            this.handleWin()
            return
        }
    }
 
    handleNonTargetRobotMove(newPosition: Position, robotIndex: number | null) {
        this.boardHistory.addState(this.board) 
        this.board.updateRobotPosition(newPosition, robotIndex!)
        this.sceneController.placeRobots(this.board)
        this.UIController.increaseMoveCount()
    }

    lockControls() {
        this.controlsLocked = false 
    }

    unlockControls() {
        this.controlsLocked = true
    }

}
   
    


    

