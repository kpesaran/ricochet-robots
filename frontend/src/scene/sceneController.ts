import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Position } from '../board/position';
import { Board } from '../board/board';
import WallPiece from './meshes/wallPiece';
import RobotPiece from './meshes/robotPiece'
import CellPiece from './meshes/cellPiece';
import targetChipPiece from './points/targetChip';
import CenterCube from './meshes/centerCube';
import CenterChip from './meshes/centerChip';
import { Textures } from './textures';
import Debug from './debug';

export class SceneController {
    scene: THREE.Scene;
    board: Board
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer ;
    sizes: WindowSize;
    canvas: HTMLCanvasElement | null;
    controls: OrbitControls;
    textureLoader: THREE.TextureLoader
    // need to change
    symbol1: THREE.Texture
    robotPieces: THREE.Mesh[]
    cellArea: number
    gridSize: number
    cells: THREE.Mesh[]
    rayCaster: THREE.Raycaster
    mouse: THREE.Vector2
    gridPlane: THREE.Object3D | undefined
    wallTextures: Textures | undefined
    debug: Debug
    
    constructor(canvas: string, board: Board) {
        this.board = board
        this.canvas = document.querySelector(canvas)
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.scene = new THREE.Scene()
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, .1, 100)
        this.camera.position.y = 15
        this.scene.add(this.camera);
        this.rayCaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2(0,0)
        // Renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas!, alpha: true });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true; 
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Orbital Controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        // Texture Loader 
        this.textureLoader = new THREE.TextureLoader()
        // Target Chip Symbol
        this.symbol1 = this.textureLoader.load('/textures/symbols/2.png')
        this.robotPieces = []
        this.gridSize = 16
        this.cellArea = 1
        this.debug = new Debug(this)
        // Cells 
        this.cells = []
        // Load Textures
        this.loadTextures()
        // Set Up The Scene
        this.setUpBoard()
        this.setUpLights()
        // this.lightPaths()
        this.setUpAxesHelpers()
        // this.tick = this.tick.bind(this);
        this.tick()
        
    }

    setUpBoard() {
        const wallPieces = this.placeWalls(this.board)
        this.placeRobots(this.board)
        this.placeTargetChip({ row: 0, column: 7 })
        this.placeCellMeshes()
        this.setUpGridPlane();
        const centerCube = new CenterCube(this.wallTextures)
        this.scene.add(centerCube.mesh!)
        this.debug.setupWallStyleControls(centerCube, wallPieces  )
        const centerChip = new CenterChip(this.symbol1)
        this.scene.add(centerChip.mesh!)
    }

    private setUpAxesHelpers() {
        // AxesHelper 
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
        // GridHelper
        const gridHelper = new THREE.GridHelper(16, 16,'white','white');
        this.scene.add(gridHelper);
    }

    private placeTargetChip(position: Position) {
        if (position) {
            const gridChip = new targetChipPiece(position, this.symbol1)
         
            if (gridChip.point) {
                    this.scene.add(gridChip.point);
            }
            else {
                console.error("gridChip.point is undefined.");
            }
        }
    }
    
    private setUpLights() {
        const ambientLight = new THREE.AmbientLight('#ffffff', .3);
        this.scene.add(ambientLight);
       
        const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
        directionalLight.castShadow = true;
        directionalLight.position.y = 1
        this.scene.add(directionalLight)
        const pointLight = new THREE.PointLight('cyan', 13);
        // target light
        pointLight.position.set(4, 3, 6.6); 
        pointLight.castShadow = true
        this.scene.add(pointLight)
        this.debug.setUpLightStyleControls(ambientLight, directionalLight)
    }
    // findPathPositions(startingPos: Position, endingPositions: Position[]): Position[]  {
    //     const cellsToLight: Position[] = []
        
    //     endingPositions.forEach(endingPos => {
            
            
    //         let currRow = startingPos.row
    //         let currCol = startingPos.column
           
            //Light East
            // if (endingPos.column < startingPos.column) {
               
            //     while (currCol >= endingPos.column) {
            //         currCol -= 1
            //         if (currCol >= 0) {
                      
            //             cellsToLight.push({ row: currRow, column: currCol })
            //         }
            //         if (currCol > 100) {
            //             break
            //         }
            //     }
                
            // }
            //Light West
            // else if (endingPos.column > startingPos.column) {
               
            //     while (currCol <= endingPos.column) {
            //         currCol += 1
                 
            //         if (currCol < this.gridSize) {

            //             cellsToLight.push({ row: currRow, column: currCol })
            //         }
                   
                   
            //         if (currCol > 100) {
            //             break
            //         }
            //     }
                
            // }
            // Light South
    //         if (endingPos.row > startingPos.row) {
    //             console.log(endingPos,currRow)
    //             while (currRow <= endingPos.row) {
    //                 currRow += 1
    //                 if (currRow <= this.gridSize) {

    //                     cellsToLight.push({ row: currRow, column: currCol })
    //                 }
                   
    //                 if (currRow > 100 || currRow < -100 ||currCol > 100 || currCol < -100 ) {
    //                     break
    //                 }
    //             }
               
    //         }
    //         if (endingPos.row < startingPos.row) {
    //             console.log(currRow)
    //             while (currRow > endingPos.row) {
    //                 currRow -= 1
    //                 if (currRow >= 0) {
    //                     console.log(currRow, currCol, 'you')
    //                     cellsToLight.push({ row: currRow, column: currCol })
    //                 }
    //                 if (currRow > 100 || currRow < -100 ||currCol > 100 || currCol < -100 ) {
    //                     break
    //                 }
    //             }
    //     }
    //     //     // Light North
            
    //     })
    //     console.log('path positios:' ,cellsToLight)
    //     return cellsToLight
    // }
    // lightPaths() {
    //     //
    //     const cellsToLight: Position[] = this.findPathPositions({ row: 4, column: 4 }, [
    //         // { row: 4, column: 2 },
    //         { row: 15, column: 4 },
    //         { row: 0, column: 4 },
    //         // { row: 4, column: 15 }
    //         ],)
    //     for (let i = 0; i < cellsToLight.length; i++) {
    //         // switched
    //         let position_col = cellsToLight[i]!.row
    //         let position_row = cellsToLight[i]!.column
    //         let index = (position_row * 16) + (position_col)
    //         if (this.cells[index]) {
    //             const mesh = this.cells[index]
    //             const material = mesh.material as THREE.MeshStandardMaterial;
    //             material.color = new THREE.Color("rgb(30, 100, 70)")
    //         }
    //         console.log(this.cells)
    //     }
    //     // remove target lit
    // }
    setUpGridPlane() {
        const gridSize = this.gridSize
        
        const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize); 

        const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: .10
        });
    
        const gridPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        gridPlane.rotation.x = -Math.PI / 2;
        gridPlane.position.y = 0;
        this.scene.add(gridPlane)
        this.gridPlane = gridPlane
    }

    private placeCellMeshes() {
        const cellPieces : CellPiece[] = []
        this.board.cells.forEach((row,row_idx) => {
            row.forEach((cell,col_idx) => {
                const cellPiece = new CellPiece(cell, { row: row_idx, column: col_idx })
                cellPieces.push(cellPiece)
                this.cells.push(cellPiece.mesh!)
                this.scene.add(cellPiece.mesh!)
            })
        })
        this.debug.setupBoardStyleControl(cellPieces)
    }

    private destroyRobotMeshes() {
        this.robotPieces.forEach(robotMesh => {
            robotMesh.geometry.dispose()
            // If robotMesh.material is an array of materials
            if (Array.isArray(robotMesh.material)) {
                robotMesh.material.forEach(mat => {
                    if (mat && typeof mat.dispose === 'function') {
                        mat.dispose()
                    }
                })
            }
            //  or robotMesh.material is a single material
            else {
                if (robotMesh.material && typeof robotMesh.material.dispose === 'function') {
                    robotMesh.material.dispose()
                }
            }
            this.scene.remove(robotMesh)
        })
    }

    placeRobots(board: Board) {
        if (this.robotPieces.length > 0) {
            this.destroyRobotMeshes()
            this.robotPieces = []
        }
        for (let i = 0; i < board.robots.length; i++) {
            const robotPiece = new RobotPiece(this.board.robots[i]!, this.board.robotPositions[i]!);
            this.scene.add(robotPiece.mesh!)
            this.robotPieces.push(robotPiece.mesh!)
        }
    }
    updateTargetRobot() {
        const robotPosition = this.board.robotPositions[0]
        const robotMesh = this.robotPieces[0]
        robotMesh?.position.set(robotPosition.column-7.5, .5 , robotPosition.row-7.5)
    } 

    private loadTextures() {
        const textures: Textures = {
            wallARMTexture: this.textureLoader.load(
                '/textures/wall/cracked_concrete_wall_arm_1k.jpg'
            ),
            wallColorTexture: this.textureLoader.load('/textures/wall/cracked_concrete_wall_diff_1k.jpg'),
            wallTextureDisp: this.textureLoader.load('/textures/wall/cracked_concrete_wall_disp_1k.jpg'),
            wallNormalTexture: this.textureLoader.load('/textures/wall/cracked_concrete_wall_nor_gl_1k.jpg')
        };
        textures.wallColorTexture.colorSpace = THREE.SRGBColorSpace;
        this.wallTextures = textures
    }
    
    private placeWalls(board: Board) {
        const wallPieces: WallPiece[] = []
        for (let row = 0; row < board.cells.length; row++) {
        
            for (let col = 0; col < board.cells[row]!.length; col++) {
                
                if (board.cells[row]![col]!.walls.length > 0) {
        
                    for (const direction of board.cells[row]![col]!.walls) {
                            const wallPiece = new WallPiece(direction, {row: row, column: col}, this.wallTextures )
                            wallPieces.push(wallPiece)
                            this.scene.add(wallPiece.mesh!)
                        }
                    }
                }
        }
        return wallPieces
    }
    // For non target robot movement
    placeSelectedRobot(selectedPiece: THREE.Mesh) {
        this.rayCaster.setFromCamera(this.mouse, this.camera);
        // Ensures robot will be moved to position on plane
        const gridIntersects = this.rayCaster.intersectObject(this.gridPlane!);
        if (gridIntersects.length > 0) {

          const intersectPoint = gridIntersects[0]!.point;
          const placedCol = Math.round(intersectPoint.x + 7.5)
          const placedRow = Math.round(intersectPoint.z + 7.5)
          const newPosition = {row: placedRow, column: placedCol}
        
          let robotIndex: number | null = null
          for (let i = 0; i < this.robotPieces.length; i++) {
          
            if (selectedPiece === this.robotPieces[i]) {
              robotIndex = i
            }
        } 
        return { newPosition, robotIndex };
        } 
        return null
    }
    
    moveRobot(selectedPiece: THREE.Mesh) {
        const rayCaster = this.rayCaster
        if (selectedPiece) {
      
        rayCaster.setFromCamera(this.mouse, this.camera);
      // Ensures robot will be moved to position on plane
        const gridIntersects = rayCaster.intersectObject(this.gridPlane!);
        if (gridIntersects.length > 0) {
            const intersectPoint = gridIntersects[0]!.point;
            selectedPiece.position.copy(intersectPoint);
            selectedPiece.position.y = .5 
        }
    }
  }
    
    updateMousePosition(x: number, y: number) {
        this.mouse.x = x;
        this.mouse.y = y;
    }
    
    onResize() {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    
    private tick = () => { 
        this.rayCaster.setFromCamera(this.mouse, this.camera)
        
        if (this.robotPieces.length > 0) {
            
            const robotIntersects = this.rayCaster.intersectObjects(this.robotPieces.slice(1))  
                
            if (robotIntersects.length > 0) {
                this.robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
                const selectedPiece = robotIntersects[0]!.object
                selectedPiece.scale.set(1.5, 2, 1.5)
            }
            else {
                this.robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
            }
        } 
        // For orbit controls damping 
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.tick)
    }
}