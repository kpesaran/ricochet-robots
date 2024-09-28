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
