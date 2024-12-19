// Responsible for handling event listeners for user inputs  

import { Direction } from "../board/direction";
import { GameController } from "../game/gameController";
import * as THREE from 'three'
import { SceneController } from "../scene/sceneController";
import UIController from "./uiController";



export default class InputController {
  selectedPiece: THREE.Mesh | undefined
  constructor(gameController: GameController, sceneController: SceneController, UIController: UIController) {
  
    document.addEventListener('keydown', (event) => this.handleKeydown(event, gameController));
    
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, sceneController));
    
    document.addEventListener('mousedown', () => this.handleMouseDown(gameController, sceneController));
    
    document.getElementById('reverse-move-btn')!.addEventListener('click', () => gameController.reverseLastMove());

    document.getElementById('reset-btn')!.addEventListener('click', () => gameController.resetGame());
    
    document.getElementById('new-game-btn')?.addEventListener('click', () => gameController.newGame());

    window.addEventListener('resize', () => gameController.sceneController.onResize());

    document.getElementById('instructions-btn')!.addEventListener('click', () => gameController.UIController.toggleInstructions());

    document.getElementById('close-instructions-btn')!.addEventListener('click', () => gameController.UIController.toggleInstructions());

    document.getElementById('show-shortest-path-btn')!.addEventListener('click', () => this.showShortestPath());

    document.getElementById('show-min-moves-btn')!.addEventListener('click', () => this.getMinMoveCount());

    // Menu Screen Buttons 

    document.getElementById("reset-game-menu-screen-btn")!.addEventListener('click', () => {
      gameController.resetGame()
      UIController.toggleMainMenu()
    })

    document.getElementById("back-to-board-game-menu-screen-btn")?.addEventListener('click', () => {
      UIController.toggleMainMenu()
    })

    document.getElementById("new-game-menu-screen-btn")?.addEventListener('click', () => {
      gameController.newGame()
      UIController.toggleMainMenu()
    })
      
    document.getElementById("instructions-menu-screen-btn")?.addEventListener('click', () => {
      UIController.toggleInstructions()
    })
  }

  getMinMoveCount() {
    // Send a request to webAssembly to get the  minimum move count (or use length of path of cells)

    return
  }

  showShortestPath() { 

    // Send a request to webAssembly to get list of non target robot moves and target-moves. 
    // sceneController.showShortestPath()
    return
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


  handleMouseMove = (event: MouseEvent, sceneController: SceneController) => {
    let x = (event.clientX / sceneController.sizes.width) * 2 - 1;
    let y = -(event.clientY / sceneController.sizes.height) * 2 + 1;
    sceneController.updateMousePosition(x, y);
    if (this.selectedPiece) {
      sceneController.moveRobot(this.selectedPiece)
    }
    const robotIntersects = sceneController.checkNonTargetRobotIntersections()
    if (robotIntersects.length > 0) {
      document.body.style.cursor = "pointer";
    }
    else {
      document.body.style.cursor = "default";
    }
  }

  handleMouseDown(gameController: GameController, sceneController: SceneController) {

    const robotIntersects = sceneController.checkNonTargetRobotIntersections()
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
        const placementResult = sceneController.placeSelectedRobot(this.selectedPiece)

        if (placementResult) {
          // Update gamestate 
          gameController.handleNonTargetRobotMove(placementResult.newPosition, placementResult.robotIndex)
        }
        this.selectedPiece = undefined;
        }    
      } 
  }
}