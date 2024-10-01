// Responsible for handling event listeners for user inputs  

import { GameController } from "../game/gameController";
import * as THREE from 'three'


export default class InputController {
  selectedPiece: THREE.Mesh| undefined
  constructor(gameController: GameController) {
    document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, gameController));
    document.addEventListener('mousedown', () => this.handleMouseDown(gameController))
    document.getElementById('reverse-move-button')!.addEventListener('click', () => gameController.reverseLastMove())
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

  handleMouseDown(gameController: GameController) {
    const rayCaster = gameController.sceneController.rayCaster
    const mouse = gameController.sceneController.mouse
    const camera = gameController.sceneController.camera

    rayCaster.setFromCamera(mouse, camera);

    const robotIntersects = rayCaster.intersectObjects(gameController.sceneController.robotPieces);

    if (robotIntersects.length > 0) {
    console.log(robotIntersects)
      // Select the robot
      if (!this.selectedPiece) {
        const intersectedObject = robotIntersects[0]!.object
        if (intersectedObject instanceof THREE.Mesh) {
          
          this.selectedPiece = intersectedObject
          console.log(this.selectedPiece)
        }
      }
      // Place the robot
      else if (this.selectedPiece) {
         
        rayCaster.setFromCamera(mouse, camera);
        // Ensures robot will be moved to position on plane
        const gridIntersects = rayCaster.intersectObject(gameController.sceneController.gridPlane!);
        if (gridIntersects.length > 0) {

          const intersectPoint = gridIntersects[0]!.point;
          const placedCol = Math.round(intersectPoint.x + 7.5)
          const placedRow = Math.round(intersectPoint.z + 7.5)
        
        // find robot by position 
          let robotIndex
          for (let i = 0; i < gameController.sceneController.robotPieces.length; i++) {
          
            if (this.selectedPiece === gameController.sceneController.robotPieces[i]) {
              robotIndex = i
          }
        }
        if (robotIndex) {
          gameController.board.robotPositions[robotIndex] = { row: placedRow, column: placedCol }
          gameController.sceneController.placeRobots(gameController.board)
        }
        
      }    
          this.selectedPiece = undefined;
      }
  } 
  }
  
  moveRobot(gameController: GameController) {
    const rayCaster = gameController.sceneController.rayCaster
    const mouse = gameController.sceneController.mouse
    const camera = gameController.sceneController.camera
    console.log(mouse.y)
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