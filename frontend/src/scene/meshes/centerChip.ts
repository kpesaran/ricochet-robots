import * as THREE from 'three'


export default class CenterChip {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;

    
    constructor(symbol: THREE.Texture) {
        this.setGeometry()
        this.setMaterial(symbol)
        this.setMesh()
    }

    private setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
    }

    private setMaterial(symbol: THREE.Texture) {
        this.material = new THREE.MeshStandardMaterial({
            color: 'red',
            alphaMap: symbol,
            alphaTest: .001,
            transparent: true,
        })
    }   
    
    private setMesh() {
        this.mesh =  new THREE.Mesh(this.geometry, this.material) 
        this.mesh.position.set(0,1,0)
    }

}

