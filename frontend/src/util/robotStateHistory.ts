// RobotStateHistory stores and manages the previous robot positions

import { Board } from "../board/board"
import { Position } from "../board/position"

export default class RobotStateHistory {
    history: [Position, Position,Position,Position][]
    constructor() {
        this.history = []
    }

    public addState(board: Board) {
        this.history.push(this.copyRobotPositions(board.robotPositions))
    }

    public undoState(board: Board) {
 
        if (this.history.length > 0) {
            const prevState = this.history.pop()
            
            if (prevState) {
                board.robotPositions = this.copyRobotPositions(prevState)
            }
        }
        return        
    }
    
    public initialBoardState(board: Board) {
        if (this.history[0]) {
            board.robotPositions = this.history[0]
        } 
    }

    private copyRobotPositions(robotPositions: [Position,Position,Position,Position]):[Position,Position,Position,Position] {

        let copiedRobotPositions: [Position, Position, Position, Position] = robotPositions.map(pos => ({
            row: pos.row,
            column: pos.column
        })) as [Position, Position, Position, Position];
        
        return copiedRobotPositions
      }
    

}