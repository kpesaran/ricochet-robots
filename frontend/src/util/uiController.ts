import { GameController } from "../game/gameController"



export default class UIController {

    moveCount: number
    constructor(gameController: GameController) {
        this.moveCount = 0
        document.getElementById('reverse-move-button')!.addEventListener('click', () => gameController.reverseLastMove())
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