import GUI from 'lil-gui'
import { SceneController } from './sceneController';
import CenterCube from './meshes/centerCube';
import * as THREE from 'three';
import CellPiece from './meshes/cellPiece';
import WallPiece from './meshes/wallPiece';

export default class Debug {
    ui: GUI
    sceneController: SceneController
    background: HTMLHtmlElement | null;
    backgroundColor: string
    constructor(sceneController: SceneController) {
        this.ui = new GUI()
        this.sceneController = sceneController
        this.background = document.querySelector('html')
        this.backgroundColor = '#000000';
        // Add a color controller to the GUI
        this.ui.addColor(this, 'backgroundColor').onChange((value: string) => {
            
            if (this.background) {
                this.background.style.backgroundColor = value;
            }
        });
    }
    public setupWallStyleControls(centerCube: CenterCube, wallPieces: WallPiece[]) {
       
        const material = centerCube.material as THREE.MeshStandardMaterial;

        this.ui.addColor(material, 'color').onChange((value: string) => {
            material.color.set(value);
            wallPieces.forEach(wallPiece => {
                const material = wallPiece.material as THREE.MeshStandardMaterial;
                material.color.set(value);
            });
        });

        this.ui.add(material, 'roughness', 0, 1).onChange((value: number) => {
            material.roughness = value;
            wallPieces.forEach(wallPiece => {
                const material = wallPiece.material as THREE.MeshStandardMaterial;
                material.roughness = value
            });
        });

        this.ui.add(material, 'metalness', 0, 1).onChange((value: number) => {
            material.metalness = value;
            wallPieces.forEach(wallPiece => {
                const material = wallPiece.material as THREE.MeshStandardMaterial;
                material.metalness= value
            });
        });
    }


    public setupBoardStyleControl(cellPieces: CellPiece[]) {
    
        const cellColor = { color: "rgb(30, 0, 10)" }; // Default color

        this.ui.addColor(cellColor, 'color').onChange((value: string) => {
        
            cellPieces.forEach(cellPiece => {
                const material = cellPiece.material as THREE.MeshStandardMaterial;
                material.color.set(value);
            });
        });
    }

    
}