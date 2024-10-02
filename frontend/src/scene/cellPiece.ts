import * as THREE from 'three'
import { Position } from '../board/position';
import { Cell } from '../board/cell';


export default class CellPiece {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;
    cell: Cell
    
    constructor(cell: Cell, pos: Position) {
        this.cell = cell
        this.setGeometry()
        this.setMaterial()
        this.setMesh(pos)
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(.7, .3, .7);
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            // "rgb(30, 100, 70)")
            // color: new THREE.Color("rgb(30, 100, 130)"),
            color: new THREE.Color("rgb(30, 0, 10)"),
            roughness: .3,
            metalness: 1
        });
    }
    
    setMesh(pos: Position) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(pos.row + -7.5, -.1, pos.column + -7.5)
        this.mesh.receiveShadow = true
    }
    }