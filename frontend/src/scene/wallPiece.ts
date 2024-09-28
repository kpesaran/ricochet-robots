import * as THREE from 'three'
import { Position } from '../board/position';
import { Direction } from '../board/direction';


export default class WallPiece {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;
    
    constructor(direction: Direction, pos: Position) {
        this.setGeometry()
        this.setMaterial()
        this.setMesh(direction, pos)
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 0.4, 0.1);
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({ color: 'white' });
        }

    setMesh(direction: Direction, pos: Position) {
        this.mesh = new THREE.Mesh
            (this.geometry, this.material)
        // Rotation based on direction 
       
        if (direction === Direction.North) {
            this.mesh.position.set(pos.column - 7.5, 0.1, pos.row - 8);
            this.mesh.rotation.x = Math.PI ;
        }
        if (direction === Direction.South) {
            this.mesh.position.set(pos.column - 7.5, 0.1, pos.row - 7);
            this.mesh.rotation.x = Math.PI ;
        }
        if (direction === Direction.West) {
            this.mesh.position.set(pos.column - 8, 0.1, pos.row - 7.5);
            this.mesh.rotation.y = Math.PI * 0.5;
        }
        if (direction === Direction.East) {
            this.mesh.position.set(pos.column - 7, 0.1, pos.row - 7.5);
            this.mesh.rotation.y = Math.PI * 0.5;
        }
}
    }

    




// function placeWalls(scene, board) {
//     const wallPieceGeom = new THREE.BoxGeometry(1, 0.5, 0.1);
//     const wallPieceMat = new THREE.MeshStandardMaterial({ color: 'white' });
//     console.log(board)
    
//     for (let row = 0; row < board.cells.length; row++) {
        
//         for (let col = 0; col < board.cells[row].length; col++) {
            
//             if (board.cells[row][col].walls.length > 0) {
//                 console.log('hey')
//                 for (const direction of board.cells[row][col].walls) {
                    
//                     const wallPieceMesh = new THREE.Mesh(wallPieceGeom, wallPieceMat);
//                     if (direction) {
//                         if (direction === Direction.North) {
//                             wallPieceMesh.position.set(col - 7.5, 0.25, row - 8);
//                             wallPieceMesh.rotation.x = Math.PI ;
//                         }
//                         if (direction === Direction.South) {
//                             wallPieceMesh.position.set(col - 7.5, 0.25, row - 7);
//                             wallPieceMesh.rotation.x = Math.PI ;
//                         }
//                         if (direction === Direction.West) {
//                             wallPieceMesh.position.set(col - 8, 0.25, row - 7.5);
//                             wallPieceMesh.rotation.y = Math.PI * 0.5;
//                         }
//                         if (direction === Direction.East) {
//                             wallPieceMesh.position.set(col - 7, 0.25, row - 7.5);
//                             wallPieceMesh.rotation.y = Math.PI * 0.5;
//                         }
//                         scene.add(wallPieceMesh)
//                     }
//                 }
//             }
//         }
//     }