import { GameController } from "../game/gameController";
import * as THREE from 'three'

export default class InputController {
  selectedPiece: THREE.Object3D | undefined
  constructor(gameController: GameController) {
    document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, gameController));
    document.addEventListener('mousedown', (event) => this.handleMouseDown(event, gameController))
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
    gameController.sceneController.updateMousePosition(x, y);
    if (this.selectedPiece) {
      this.moveRobot(gameController)
    }
  }

  handleMouseDown(event: MouseEvent, gameController: GameController) {
    const rayCaster = gameController.sceneController.rayCaster
    const mouse = gameController.sceneController.mouse
    const camera = gameController.sceneController.camera

  rayCaster.setFromCamera(mouse, camera);

  const robotIntersects = rayCaster.intersectObjects(gameController.sceneController.robotPieces);

  if (robotIntersects.length > 0) {
      // Select the robot
      if (!this.selectedPiece) {
          this.selectedPiece = robotIntersects[0]!.object;
      } 
      // Place the robot
      else if (this.selectedPiece) {
          this.selectedPiece = undefined;
      }
    
  } 
  // If clicked on grid and a piece is selected
  else if (this.selectedPiece) {
      const gridIntersects = rayCaster.intersectObject(gameController.sceneController.gridPlane!);
      if (gridIntersects.length > 0) {
        const intersectPoint = gridIntersects[0]!.point;
        console.log(intersectPoint)
          this.selectedPiece.position.copy(this.snapToGrid(intersectPoint));
          this.selectedPiece = undefined;
      }
  }
  }
  
  
  snapToGrid(position: THREE.Vector3) {
    // cellsize is 1
    const snappedX = Math.round(position.x / 1) * 1 ;
    const snappedZ = Math.round(position.z / 1) * 1;
    
    const clampedX = Math.max(0, Math.min(15, snappedX));
    const clampedZ = Math.max(0, Math.min(15, snappedZ));
  
  return new THREE.Vector3(clampedX, .5, clampedZ);
  }
  moveRobot(gameController: GameController) {
    const rayCaster = gameController.sceneController.rayCaster
    const mouse = gameController.sceneController.mouse
    const camera = gameController.sceneController.camera
    if (this.selectedPiece) {
      rayCaster.setFromCamera(mouse, camera);
      // Ensures robot will be moved to position on plane
        const gridIntersects = rayCaster.intersectObject(gameController.sceneController.gridPlane!);
        if (gridIntersects.length > 0) {
            const intersectPoint = gridIntersects[0]!.point;
          this.selectedPiece.position.copy(intersectPoint);
          this.selectedPiece.position.y = .5
        }
    }
  }
}