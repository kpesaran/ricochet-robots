import * as THREE from 'three' 
import { Position } from '../../board/position';
import { Robot } from '../../board/robot';
import { Color } from '../../board/color';

export default class RobotPiece {
    material: THREE.Material | undefined;
    geometry: THREE.CylinderGeometry | undefined;
    mesh: THREE.Mesh | undefined;
    robot: Robot
    
    constructor(robot: Robot, pos: Position) {
        this.robot = robot
        this.setGeometry()
        this.setMaterial()
        this.setMesh(pos) 
    } 

    private setGeometry() {
        this.geometry = new THREE.CylinderGeometry(.01, .3, 1)
    }

    private setMaterial() {
        let robotColor: string | undefined

        if (this.robot.color === Color.Blue) {
            robotColor = 'blue';
        }
        else if (this.robot.color === Color.Green) {
            robotColor = 'green';
        }
        else if (this.robot.color === Color.Yellow) {
            robotColor = 'yellow';
        }
        else if (this.robot.color === Color.Red) {
            robotColor = 'red';
        }

        this.material = new THREE.MeshStandardMaterial({
            color: robotColor,
        })
    }
          
    private setMesh(pos: Position) {
        this.mesh = new THREE.Mesh
            (this.geometry, this.material)
        this.mesh.position.set(pos.column - 7.5, .5, pos.row - 7.5)
        this.mesh.castShadow = true;
    }

}

    
