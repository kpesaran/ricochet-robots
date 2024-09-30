
// Manages the display of the move count, and probably least moves possible display and newGame 


export default class UIController {

    moveCount: number
    constructor() {
        this.moveCount = 0
    }

    increaseMoveCount() {
        this.moveCount += 1
        document.getElementById('move-count')!.textContent = `${this.moveCount}`
    }

    reduceMoveCount() {
        this.moveCount -= 1
        if (this.moveCount < 0) {
            this.moveCount = 0; 
        }
        document.getElementById('move-count')!.textContent = `${this.moveCount}`;
    }

}