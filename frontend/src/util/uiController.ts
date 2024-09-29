


export default class UIController {

    moveCount: number
    constructor() {
        this.moveCount = 0
    }

    updateMoveCount() {
        this.moveCount += 1
        document.getElementById('move-count')!.textContent = `${this.moveCount}`
    }

}