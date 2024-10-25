import * as THREE from 'three'

import { Color } from './board/color.ts'
import { Direction } from './board/direction';

function generateGridPlane() {
    const gridSize = 16
const cellSize = 1

const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize); 

const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: .10
});

const gridPlane = new THREE.Mesh(planeGeometry, planeMaterial);
gridPlane.rotation.x = -Math.PI / 2;
    gridPlane.position.y = 0;
return gridPlane
}

function generateCenterBlock(scene) {

    const centerSquareGeom = new THREE.BoxGeometry(2, 1, 2) 
    const centerSquareMat = new THREE.MeshStandardMaterial({
      color: 'grey',
      metalness: .1,
      roughness: .5
    })
    
    const centerSquareMesh = new THREE.Mesh(centerSquareGeom, centerSquareMat)
    scene.add(centerSquareMesh)
}

function generateTargetChip(scene,position, symbol1) {
    console.log(position)
    if (position) {
        const gridChipsGeom = new THREE.BufferGeometry()
      
  
        const positions = new Float32Array(3)
        const x = (position.row) - 8.5
        const y = .2
        const z = (position.column) - 8.5
        positions[0] = x
        positions[1] = y
        positions[2] = z
        gridChipsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 
  // particlesGeometry.setAttribute('color', new THREE.BufferAttribute(gridChipsColors,3)) 
        const gridChipsMat = new THREE.PointsMaterial({
            size: 1,
            sizeAttenuation: true 
  })
  gridChipsMat.color = new THREE.Color('red')
  // particlesMaterial.vertexColors = true
  gridChipsMat.transparent = true
  gridChipsMat.alphaMap = symbol1
  gridChipsMat.depthWrite = false
  const gridChips = new THREE.Points(gridChipsGeom, gridChipsMat)
  scene.add(gridChips)
  }
}
function generateCenterChip(scene, symbol1) {
    const centerSymbolGeom = new THREE.BoxGeometry(1, 1, 1)
    const centerSymbolMat = new THREE.MeshStandardMaterial({
      color: 'red',
      alphaMap: symbol1,
      alphaTest: .001,
      transparent: true,
      // side: THREE.DoubleSide
    })
    const centerSymbolMesh = new THREE.Mesh(centerSymbolGeom, centerSymbolMat)
    scene.add(centerSymbolMesh)
    centerSymbolMesh.position.set(0,1,0)
}
    

function placeRobots(scene, board, robotPieces) {
    const robotGeom = new THREE.CylinderGeometry(.01, .3, 1) 
    for (let i = 0; i < board.robots.length; i++) {
  
      let robotColor = null
     
  
      switch (board.robots[i].color) {
        case Color.Red:
          robotColor = 'red'
          break;
        case Color.Blue:
          robotColor = 'blue'
          break;
        case Color.Green:
          robotColor = 'green'
          break;
        case Color.Yellow:
          robotColor = 'yellow'
          break;
        }
  
      const robotMesh = new THREE.Mesh(robotGeom, new THREE.MeshBasicMaterial({ 
        color: robotColor
      }))
      
      robotMesh.position.set(board.robotPositions[i].column-7.5, .5 , board.robotPositions[i].row-7.5)
      // const x = (Math.floor(Math.random()*16) - 8) +.5
      // const y = .5
      // const z = (Math.floor(Math.random() * 16) - 8) + .5
      console.log(robotMesh)
     
      
      scene.add(robotMesh)
      robotPieces.push(robotMesh)
    }
  }

function placeWalls(scene, board) {
    const wallPieceGeom = new THREE.BoxGeometry(1, 0.5, 0.1);
    const wallPieceMat = new THREE.MeshStandardMaterial({ color: 'white' });
    console.log(board)
    
    for (let row = 0; row < board.cells.length; row++) {
        
        for (let col = 0; col < board.cells[row].length; col++) {
            
            if (board.cells[row][col].walls.length > 0) {
            
                for (const direction of board.cells[row][col].walls) {
                    
                    const wallPieceMesh = new THREE.Mesh(wallPieceGeom, wallPieceMat);
                    if (direction) {
                        if (direction === Direction.North) {
                            wallPieceMesh.position.set(col - 7.5, 0.25, row - 8);
                            wallPieceMesh.rotation.x = Math.PI ;
                        }
                        if (direction === Direction.South) {
                            wallPieceMesh.position.set(col - 7.5, 0.25, row - 7);
                            wallPieceMesh.rotation.x = Math.PI ;
                        }
                        if (direction === Direction.West) {
                            wallPieceMesh.position.set(col - 8, 0.25, row - 7.5);
                            wallPieceMesh.rotation.y = Math.PI * 0.5;
                        }
                        if (direction === Direction.East) {
                            wallPieceMesh.position.set(col - 7, 0.25, row - 7.5);
                            wallPieceMesh.rotation.y = Math.PI * 0.5;
                        }
                        scene.add(wallPieceMesh)
                    }
                }
            }
        }
    }

    // for (let i = 0; i < 16; i++) {
    //     for (let j = 0; j < 16; j++) {
    //         const wallDirections = positions[i][j];
            
    //         if (wallDirections !== null) {
    //             const wallGroup = new THREE.Group();

    //             wallDirections.forEach(direction => {
    //                 const wallPieceMesh = new THREE.Mesh(wallPieceGeom, wallPieceMat);

    //                 if (direction === "N") {
    //                     wallPieceMesh.position.set(j - 7.5, 0.25, i - 8);
    //                     wallPieceMesh.rotation.x = Math.PI ;
    //                 }
    //                 if (direction === "S") {
    //                     wallPieceMesh.position.set(j - 7.5, 0.25, i - 7);
    //                     wallPieceMesh.rotation.x = Math.PI ;
    //                 }
    //                 if (direction === "W") {
    //                     wallPieceMesh.position.set(j - 8, 0.25, i - 7.5);
    //                     wallPieceMesh.rotation.y = Math.PI * 0.5;
    //                 }
    //                 if (direction === "E") {
    //                     wallPieceMesh.position.set(j - 7, 0.25, i - 7.5);
    //                     wallPieceMesh.rotation.y = Math.PI * 0.5;
    //                 }

    //                 wallGroup.add(wallPieceMesh);
    //             });

    //             scene.add(wallGroup);
    //         }
    //     }
    // }
}

// Selecting & Moving Robots
let selectedPiece = null;
let isDragging = false;
let cellSize = 1


function onMouseDown(event, robotPieces, gridPlane, raycaster, camera) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  
    raycaster.setFromCamera(mouse, camera);
  
    const robotIntersects = raycaster.intersectObjects(robotPieces);
  
    if (robotIntersects.length > 0) {
        // Select the robot
        if (!selectedPiece) {
            selectedPiece = robotIntersects[0].object;
            isDragging = true;
        } 
        // Place the robot
        else if (selectedPiece === robotIntersects[0].object) {
            isDragging = false;
            selectedPiece = null;
        }
    } 
    // If clicked on grid and a piece is selected
    else if (isDragging && selectedPiece) {
        const gridIntersects = raycaster.intersectObject(gridPlane);
        if (gridIntersects.length > 0) {
            const intersectPoint = gridIntersects[0].point;
            selectedPiece.position.copy(snapToGrid(intersectPoint));
            isDragging = false;
            selectedPiece = null;
        }
    }
}

function onMouseMove(event, gridPlane, raycaster, camera) {
    if (isDragging && selectedPiece) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        
        raycaster.setFromCamera(mouse, camera);
        
        const gridIntersects = raycaster.intersectObject(gridPlane);
        
        if (gridIntersects.length > 0) {
            const intersectPoint = gridIntersects[0].point;
            selectedPiece.position.copy(intersectPoint);
        }
    }
}

// function onMouseUp(event) {
//     raycaster.setFromCamera(mouse, camera);
        
//     const gridIntersects = raycaster.intersectObject(gridPlane);
    
//     if (gridIntersects.length > 0) {
//         const intersectPoint = gridIntersects[0].point;
//         selectedPiece.position.copy(snapToGrid(intersectPoint));
//     }
//     if (selectedPiece) {
//         isDragging = false;
//         selectedPiece = null;
//     }
// }

function snapToGrid(position) {
    const snappedX = Math.round(position.x / cellSize) * cellSize ;
    
    const snappedZ = Math.round(position.z / cellSize) * cellSize;
    
    return new THREE.Vector3(snappedX, .5, snappedZ);
}

export {
    generateGridPlane,generateCenterChip, generateCenterBlock, placeRobots, placeWalls, onMouseDown, onMouseMove, snapToGrid, generateTargetChip
};
