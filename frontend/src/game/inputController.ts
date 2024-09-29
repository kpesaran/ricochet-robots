import { GameController } from "./gameController";

export default class InputController {
    constructor(gameController: GameController) {
        document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
      }
    
      handleKeydown(event: KeyboardEvent, gameController: GameController) {
        switch (event.key) {
          case 'ArrowUp':
            gameController.slideNorth();
            break;
          case 'ArrowDown':
            gameController.slideSouth();
            break;
          case 'ArrowLeft':
            gameController.slideWest();
            break;
          case 'ArrowRight':
            gameController.slideEast();
            break;
        }
      }
}