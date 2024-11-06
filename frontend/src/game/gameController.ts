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
        this.board = newBoard.buildRandom()
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.inputController = new InputController(this, this.sceneController)
        this.UIController = new UIController()
        this.boardHistory = new RobotStateHistory()
    }
    // Methods to update game state based on user choices
    resetGame() {
        this.boardHistory.initialBoardState(this.board)
        this.boardHistory = new RobotStateHistory()
        this.sceneController.placeRobots(this.board)
        this.UIController.resetCount()
    }

    newGame() {
        this.boardHistory = new RobotStateHistory()
        this.sceneController.destroy()
        this.sceneController.debug.dispose()
        const newBoard = new BoardBuilder()
        this.board = newBoard.buildRandom()
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.UIController.resetCount()
    }

    reverseLastMove() {
        this.UIController.reduceMoveCount()
        this.boardHistory.undoState(this.board)
        this.sceneController.placeRobots(this.board)
    }

    checkWinCondition() {
        return this.board.checkRobotAtTarget()
    }

    gameWon() {
        const mainMenuElement = window.document.getElementById("menu-screen")
  
        if (mainMenuElement!.style.display === "none") {
            mainMenuElement!.style.display = "flex";
        }
        else {
            mainMenuElement!.style.display = "none"; 
        }
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
            this.boardHistory.addState(this.board)
            this.board.updateRobotPosition(newPos, 0)
            this.sceneController.updateTargetRobot()
            this.UIController.increaseMoveCount()
        }
        if (this.board.checkRobotAtTarget()) {
            this.gameWon()
            return
        }
        console.log(newPos)
        
    }
 
    handleNonTargetRobotMove(newPosition: Position, robotIndex: number | null) {
        this.boardHistory.addState(this.board) 
        this.board.updateRobotPosition(newPosition, robotIndex!)
        this.sceneController.placeRobots(this.board)
        this.UIController.increaseMoveCount()
    }
}
   
    


    

