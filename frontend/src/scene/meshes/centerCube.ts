import * as THREE from 'three'
import { Textures } from '../textures';


export default class CenterCube {
    material: THREE.Material | undefined;
    geometry: THREE.BoxGeometry | undefined;
    mesh: THREE.Mesh | undefined;

    
    constructor(wallTextures: Textures | undefined) {
        this.setGeometry()
        this.setMaterial(wallTextures!)
        this.setMesh()
    }

    private setGeometry() {
        this.geometry = new THREE.BoxGeometry(2, 1, 2) 
    }

    private setMaterial(wallTextures: Textures) {
        this.material = new THREE.MeshStandardMaterial({
            map: wallTextures.wallColorTexture,
            aoMap: wallTextures.wallARMTexture,
            roughnessMap: wallTextures.wallColorTexture,
            roughness: .734,
            metalness: .525,
            metalnessMap: wallTextures.wallColorTexture,
            normalMap: wallTextures.wallNormalTexture,
            color: new THREE.Color("#303030")
        });
        
    }
    
    private setMesh() {
        this.mesh =  new THREE.Mesh(this.geometry, this.material) 
        
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true 
    }

}
