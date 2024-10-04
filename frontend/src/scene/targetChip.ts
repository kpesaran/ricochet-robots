import * as THREE from 'three'
import { Position } from '../board/position';


export default class targetChipPiece {
    material: THREE.Material | undefined;
    bufferGeometry: THREE.BufferGeometry | undefined;
    point: THREE.Points | undefined;
    position: Position

    
    constructor(position: Position, symbol1: THREE.Texture) {
        this.position = position
        this.setBufferGeometry()
        this.setMaterial(symbol1)
        this.setPoint()
    }

    setBufferGeometry() {
        this.bufferGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(15)
        const x = (this.position.row) - 7.5
        const y = .2
        const z = (this.position.column) - 7.5
        positions[0] = x
        positions[1] = y
        positions[2] = z
        this.bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 
    }

    setMaterial(texture: THREE.Texture) {
        const gridChipsMat = new THREE.PointsMaterial({
            size: 1,
            sizeAttenuation: true 
        })
        gridChipsMat.color = new THREE.Color('red')
        // particlesMaterial.vertexColors = true
        gridChipsMat.transparent = true
        gridChipsMat.alphaMap = texture
        
        gridChipsMat.depthWrite = false
        this.material = gridChipsMat
    }
    
    setPoint() {
        this.point = new THREE.Points(this.bufferGeometry, this.material)
    }
    }




