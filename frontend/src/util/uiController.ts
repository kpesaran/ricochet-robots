
// Manages the display of the move count, and probably least moves possible display and newGame 


export default class UIController {

    moveCount: number
    constructor() {
        this.moveCount = 0;
    }
    

    increaseMoveCount() {
        this.moveCount += 1
        document.getElementById('move-count')!.textContent = `${this.moveCount}`
    }

    reduceMoveCount() {
        this.moveCount -= 1;
        if (this.moveCount < 0) {
            this.moveCount = 0; 
        }
        document.getElementById('move-count')!.textContent = `${this.moveCount}`;
    }

    resetCount() {
        this.moveCount = 0;
        document.getElementById('move-count')!.textContent = `${this.moveCount}`;
    }
    updateFinalScore() {
        document.getElementById('final-score')!.textContent = 'hi';
    }

    toggleInstructions() {
    
        const instructions = window.document.getElementById('instructions-overlay');
        if (instructions?.style.display === 'none' || !instructions?.style.display) {
            instructions!.style.display = 'flex';
        }
        else {
            instructions!.style.display = 'none';
        }
    }

    toggleMainMenu() {
        const mainMenuElement = window.document.getElementById("menu-screen");
        document.getElementById('menu-screen-final-score')!.textContent = `${this.moveCount}`
        
        if (mainMenuElement!.style.display === "flex") {
          mainMenuElement!.style.display = "none"; 
      } else {
          mainMenuElement!.style.display = "flex"; 
      }
      }
}