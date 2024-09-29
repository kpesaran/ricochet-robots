import { GameController } from "../game/gameController";
import * as THREE from 'three'

export default class InputController {
  constructor(gameController: GameController) {

    document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, gameController));
    document.addEventListener('mousedown',(event)=> this.handleMouseDown(event, gameController) )
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
    let x = (event.clientX / gameController.sceneController.sizes.width) * 2 - 1;
    let y = -(event.clientY / gameController.sceneController.sizes.height) * 2 + 1;
    gameController.sceneController.
    updateMousePosition(x, y);
  }


  handleMouseDown(event: MouseEvent, gameController: GameController) {
    const rayCaster = gameController.sceneController.rayCaster
    const mouse = gameController.sceneController.mouse
    const camera = gameController.sceneController.camera

  rayCaster.setFromCamera(mouse, camera);

  const robotIntersects = rayCaster.intersectObjects(gameController.sceneController.robotPieces);
    let selectedPiece: THREE.Object3D | undefined
    let isDragging
  if (robotIntersects.length > 0) {
      // Select the robot
      if (!selectedPiece) {
          selectedPiece = robotIntersects[0]!.object;
          isDragging = true;
      } 
      // Place the robot
      else if (selectedPiece === robotIntersects[0]!.object) {
          isDragging = false;
          selectedPiece = undefined;
      }
    
      console.log(selectedPiece)
  } 
  // If clicked on grid and a piece is selected
  else if (isDragging && selectedPiece) {
      const gridIntersects = rayCaster.intersectObject(gameController.sceneController.gridPlane!);
      if (gridIntersects.length > 0) {
          // const intersectPoint = gridIntersects[0]!.point;
          // selectedPiece.position.copy(snapToGrid(intersectPoint));
          isDragging = false;
          selectedPiece = undefined;
      }
  }
}
}