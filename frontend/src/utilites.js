import * as THREE from 'three'

function placeWalls(scene, positions) {
    const wallPieceGeom = new THREE.BoxGeometry(1, 0.5, 0.1);
    const wallPieceMat = new THREE.MeshStandardMaterial({ color: 'white'});

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            const wallDirections = positions[i][j];
            
            if (wallDirections !== null) {
                const wallGroup = new THREE.Group();

                wallDirections.forEach(direction => {
                    const wallPieceMesh = new THREE.Mesh(wallPieceGeom, wallPieceMat);

                    if (direction === "N") {
                        wallPieceMesh.position.set(j - 7.5, 0.25, i - 8);
                        wallPieceMesh.rotation.x = Math.PI ;
                    }
                    if (direction === "S") {
                        wallPieceMesh.position.set(j - 7.5, 0.25, i - 7);
                        wallPieceMesh.rotation.x = Math.PI ;
                    }
                    if (direction === "W") {
                        wallPieceMesh.position.set(j - 8, 0.25, i - 7.5);
                        wallPieceMesh.rotation.y = Math.PI * 0.5;
                    }
                    if (direction === "E") {
                        wallPieceMesh.position.set(j - 7, 0.25, i - 7.5);
                        wallPieceMesh.rotation.y = Math.PI * 0.5;
                    }

                    wallGroup.add(wallPieceMesh);
                });

                scene.add(wallGroup);
            }
        }
    }
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

export { placeWalls, onMouseDown, onMouseMove, snapToGrid };
