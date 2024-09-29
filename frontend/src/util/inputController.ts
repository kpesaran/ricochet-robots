import { GameController } from "../game/gameController";
import * as THREE from 'three';

export default class InputController {
  rayCaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  constructor(gameController: GameController) {
    
      // Raycaster & Mouse
    this.rayCaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
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
    gameController.updateMousePosition(this.mouse.x, this.mouse.y);
  }
  
  
}