import * as THREE from 'three'
import { Position } from '../../board/position';

export default class targetChipPiece {
    material: THREE.Material | undefined;
    bufferGeometry: THREE.BufferGeometry | undefined;
    point: THREE.Points | undefined;
    position: Position

    
    constructor(position: Position, symbol1: THREE.Texture, color: THREE.Color) {
        this.position = position
        
        this.setBufferGeometry()
        this.setMaterial(symbol1, color)
        this.setPoint()

    }

    private setBufferGeometry() {
        
        this.bufferGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(15)
        const x = (this.position.column) - 7.5
        const y = .2
        const z = (this.position.row) - 7.5
        positions[0] = x
        positions[1] = y
        positions[2] = z
        this.bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    }

    updatePosition(position: Position) {
        const positions = new Float32Array(15)
        const x = (position.column) - 7.5
        const y = .2
        const z = (position.row) - 7.5
        positions[0] = x
        positions[1] = y
        positions[2] = z
        this.bufferGeometry?.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        // gsap.to(this.point!.position, {
        //     x: x,
        //     y: y,
        //     z: z,
        //     duration: .1
        // })
        // this.point!.position.set(x,y,z)
        this.position = position
    }

    private setMaterial(texture: THREE.Texture, color: THREE.Color) {
        const gridChipsMat = new THREE.PointsMaterial({
            size: 1,
            sizeAttenuation: true
        })
        gridChipsMat.color.set(color)
        // particlesMaterial.vertexColors = true
        gridChipsMat.transparent = true
        gridChipsMat.alphaMap = texture
        
        gridChipsMat.depthWrite = false
        this.material = gridChipsMat
    }
    
    private setPoint() {
        this.point = new THREE.Points(this.bufferGeometry, this.material)
    }
    private updateColor(color: THREE.Color) {
        if (this.material instanceof THREE.PointsMaterial) {
            this.material.color = new THREE.Color(color)
        }
    }

    public updateTargetChip(position: Position, color: THREE.Color) {
        this.updateColor(color)
        this.updatePosition(position)
    }
}


