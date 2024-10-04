import * as THREE from 'three'


export default class CenterCube {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;

    
    constructor() {
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    private setGeometry() {
        this.geometry = new THREE.BoxGeometry(2, 1, 2) 
    }

    private setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 'grey',
            metalness: .1,
            roughness: .1
        })
    }
    
    private setMesh() {
        this.mesh =  new THREE.Mesh(this.geometry, this.material) 
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true 
    }

}
