// Responsible for handling event listeners for user inputs  

import { Direction } from "../board/direction";
import { GameController } from "../game/gameController";
import * as THREE from 'three'
import { SceneController } from "../scene/sceneController";


export default class InputController {
  selectedPiece: THREE.Mesh| undefined
  constructor(gameController: GameController, sceneController: SceneController) {
    document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, gameController, sceneController));
    document.addEventListener('mousedown', () => this.handleMouseDown(gameController))
    document.getElementById('reverse-move-button')!.addEventListener('click', () => gameController.reverseLastMove())
    document.getElementById('reset-button')!.addEventListener('click', () => gameController.resetGame())
    window.addEventListener('resize', () => gameController.sceneController.onResize());
    

  }
    
  handleKeydown(event: KeyboardEvent, gameController: GameController) {
    switch (event.key) {
      case 'ArrowUp':
        gameController.slideTargetRobot(Direction.North);
        break;
      case 'ArrowDown':
        gameController.slideTargetRobot(Direction.South);
        break;
      case 'ArrowLeft':
        gameController.slideTargetRobot(Direction.West);
        break;
      case 'ArrowRight':
        gameController.slideTargetRobot(Direction.East);
        break;
    }
  }
  handleMouseMove(event: MouseEvent, gameController: GameController, sceneController: SceneController) {
    let x = (event.clientX / sceneController.sizes.width) * 2 - 1;
    let y = -(event.clientY / sceneController.sizes.height) * 2 + 1;
    sceneController.updateMousePosition(x, y);
    if (this.selectedPiece) {
      sceneController.moveRobot(this.selectedPiece)
    }
    const rayCaster = sceneController.rayCaster
    const mouse = sceneController.mouse
    const camera = sceneController.camera

    rayCaster.setFromCamera(mouse, camera);

    const robotIntersects = rayCaster.intersectObjects(gameController.sceneController.robotPieces.slice(1));

    if (robotIntersects.length > 0) {
      document.body.style.cursor = "pointer";
    }
    else {
      document.body.style.cursor = "default";
    }
  }

  handleMouseDown(gameController: GameController) {
    const rayCaster = gameController.sceneController.rayCaster
    const mouse = gameController.sceneController.mouse
    const camera = gameController.sceneController.camera

    rayCaster.setFromCamera(mouse, camera);

    const robotIntersects = rayCaster.intersectObjects(gameController.sceneController.robotPieces.slice(1));

    if (robotIntersects.length > 0) {
      
      // Select the robot
      if (!this.selectedPiece) {
        const intersectedObject = robotIntersects[0]!.object
        if (intersectedObject instanceof THREE.Mesh) {
          
          this.selectedPiece = intersectedObject
        }
      }
      // Place the robot
      else if (this.selectedPiece) {
        document.body.style.cursor = "default";
        rayCaster.setFromCamera(mouse, camera);
        // Ensures robot will be moved to position on plane
        const gridIntersects = rayCaster.intersectObject(gameController.sceneController.gridPlane!);
        if (gridIntersects.length > 0) {

          const intersectPoint = gridIntersects[0]!.point;
          const placedCol = Math.round(intersectPoint.x + 7.5)
          const placedRow = Math.round(intersectPoint.z + 7.5)
          const newPosition = {row: placedRow, column: placedCol}
        
        // find robot by position 
          let robotIndex: number | null = null
          for (let i = 0; i < gameController.sceneController.robotPieces.length; i++) {
          
            if (this.selectedPiece === gameController.sceneController.robotPieces[i]) {
              robotIndex = i
          }
          }
          
        gameController.handleNonTargetRobotMove(newPosition, robotIndex)
      }    
          this.selectedPiece = undefined;
      }
  } 
  }
  
  // moveRobot(gameController: GameController, selectedPiece: THREE.Mesh) {
  //   const rayCaster = gameController.sceneController.rayCaster
  //   const mouse = gameController.sceneController.mouse
  //   const camera = gameController.sceneController.camera
  //   if (selectedPiece) {
      
  //     rayCaster.setFromCamera(mouse, camera);
  //     // Ensures robot will be moved to position on plane
  //       const gridIntersects = rayCaster.intersectObject(gameController.sceneController.gridPlane!);
  //     if (gridIntersects.length > 0) {
          
  //       const intersectPoint = gridIntersects[0]!.point;
  //       selectedPiece.position.copy(intersectPoint);
  //       selectedPiece.position.y = .5
        
  //       }
  //   }
  // }
}