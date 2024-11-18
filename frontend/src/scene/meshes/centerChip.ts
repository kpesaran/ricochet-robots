import * as THREE from 'three'
import { Color } from '../../board/color';

export default class CenterChip {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;

    
    constructor(symbol: THREE.Texture, color: Color) {
        this.setGeometry()
        this.setMaterial(symbol, color)
        this.setMesh()
    }

    private setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
    }

    private setMaterial(symbol: THREE.Texture, color: Color) {
        
        this.material = new THREE.MeshStandardMaterial({
            color: color,
            alphaMap: symbol,
            alphaTest: .001,
            transparent: true,
        })
    }   
    
    private setMesh() {
        this.mesh =  new THREE.Mesh(this.geometry, this.material) 
        this.mesh.position.set(0,1,0)
    }
    public updateColor(color: Color) {
        if (this.material instanceof THREE.MeshStandardMaterial) {
            this.material.color = new THREE.Color(color);
        }
    }

}

