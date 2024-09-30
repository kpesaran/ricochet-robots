// BoardStateHistory stores the previous board states

import { Board } from "../board/board"

// Right now passing around references of a board. Need to make a deep copy.
export default class BoardStateHistory {
    history: Board[]
    constructor(board: Board) {
        this.history = [board]
    }

    addState(board: Board) {
        console.log(this.history)
        this.history.push(board)
    }

    undoState() {
        if (this.history.length > 1) {
            return this.history.pop()
        }
        return this.history[0]        
    }


    initialBoardState() {
        return this.history[0]
    }

}