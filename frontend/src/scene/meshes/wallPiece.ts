import * as THREE from 'three'
import { Position } from '../../board/position';
import { Direction } from '../../board/direction';
import { Textures } from '../textures';



export default class WallPiece {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;
    texture: Textures | undefined
    
    constructor(direction: Direction, pos: Position, texture: Textures | undefined) {
        this.texture = texture
        this.setGeometry()
        this.setMaterial()
        this.setMesh(direction, pos)
    }

    private setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 0.4, 0.2);
    }

    private setMaterial() {
        if (this.texture) {
            this.material = new THREE.MeshStandardMaterial({
                map: this.texture.wallColorTexture,
                aoMap: this.texture.wallARMTexture,
                roughnessMap: this.texture.wallColorTexture,
                metalnessMap: this.texture.wallColorTexture,
                normalMap: this.texture.wallNormalTexture
            });
        }
        else {
            console.error('Issue with wall texture loading')
        }
    }

    private setMesh(direction: Direction, pos: Position) {
        this.mesh = new THREE.Mesh
            (this.geometry, this.material)
        // Rotation based on direction 
       
        if (direction === Direction.North) {
            this.mesh.position.set(pos.column - 7.5, 0.1, pos.row - 8);
            this.mesh.rotation.x = Math.PI;
        }
        if (direction === Direction.South) {
            this.mesh.position.set(pos.column - 7.5, 0.1, pos.row - 7);
            this.mesh.rotation.x = Math.PI;
        }
        if (direction === Direction.West) {
            this.mesh.position.set(pos.column - 8, 0.1, pos.row - 7.5);
            this.mesh.rotation.y = Math.PI * 0.5;
        }
        if (direction === Direction.East) {
            this.mesh.position.set(pos.column - 7, 0.1, pos.row - 7.5);
            this.mesh.rotation.y = Math.PI * 0.5;
        }
        this.mesh.castShadow = true;
    }
}   

    
