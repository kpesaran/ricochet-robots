import { Board } from "../board/board"
import { BoardBuilder } from "../util/boardBuilder"
import { SceneController } from "../scene/sceneController"
import InputController from "../util/inputController"
import { MousePosition } from "./mousePosition"



export class GameController {
    board: Board
    sceneController: SceneController
    inputController: InputController
    mouse: MousePosition
    constructor() {
        const newBoard = new BoardBuilder()
        this.board = newBoard.build()
        this.inputController = new InputController(this)
        this.sceneController = new SceneController('canvas.webgl', this.board)
        this.mouse = {x:0,y:0}
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
        }
        
    }
    
  
    // Move a non-target Robot 

    updateMousePosition(x: number, y: number) {
        this.mouse.x = x;
        this.mouse.y = y;
    }

    
}
   
    


    

