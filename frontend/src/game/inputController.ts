import { GameController } from "./gameController";
import { MousePosition } from "./mousePosition";

export default class InputController {
    mouse: MousePosition
    constructor(gameController: GameController) {
        this.mouse = {x:0,y:0}
        document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
        document.addEventListener('mousemove', (event) => this.handleMouseMove(event, gameController));
        
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
    handleMouseMove(event: MouseEvent, gameController: GameController) {
        this.mouse.x = (event.clientX / gameController.sceneController.sizes.width) * 2 - 1;
        this.mouse.y = (event.clientY / gameController.sceneController.sizes.width) * 2 - 1;
      }
}