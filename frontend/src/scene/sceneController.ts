import * as THREE from 'three';
import Debug from './debug';
import gsap from 'gsap';
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
import { predefinedColors } from './predefinedColors';
import { GameController } from '../game/gameController';


// import { cameraGoesUpDown } from '../util/animate';
import { Direction } from '../board/direction';


export class SceneController {
    scene: THREE.Scene;
    board: Board
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer ;
    sizes: WindowSize;
    canvas: HTMLCanvasElement | null;
    controls: OrbitControls;
    textureLoader: THREE.TextureLoader;
    // need to change
    symbol1: THREE.Texture;
    robotPieces: THREE.Mesh[];
    selectedPiece: THREE.Mesh | undefined;
    wallPieces: WallPiece[][][] | undefined
    cellArea: number
    gridSize: number
    cells: THREE.Mesh[]
    rayCaster: THREE.Raycaster
    mouse: THREE.Vector2
    gridPlane: THREE.Object3D | undefined
    wallTextures: Textures | undefined
    debug: Debug
    accumulatedAngle: number
    isSpinning: boolean;
    centerChip: CenterChip | undefined
    targetChip: targetChipPiece | undefined 
    pointLight: THREE.PointLight | undefined
    
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
        this.controls.enabled = false
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
        this.accumulatedAngle = 0
        this.isSpinning = false
        
    }
    
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    updateBoardPositions(board: Board) {
        this.board = board;
        const tl = gsap.timeline({repeat:0})
        
        const newTargetColorStr = board.getTargetColor()
        const newTargetColorRGB = predefinedColors[newTargetColorStr]
        this.centerChip?.updateColor(newTargetColorRGB)


        if (this.targetChip) {
            this.targetChip?.updateTargetChip(board.findTargetCell()!, newTargetColorRGB)
        }
        else {
            const targetCell = this.board.findTargetCell()
            if (targetCell) {
                this.placeTargetChip(targetCell)
            }
        }
        
        tl.call(() => {
            this.placeRobots(board);
            this.updateWallPositions(board)
            this.pointLight!.color.set(newTargetColorRGB)
            
        })
        this.cells.forEach((cell) => {

                    
            gsap.to((cell.material as THREE.MeshBasicMaterial) .color, {
                r: 1,
                g: 1,
                b: 1,
            });
        })
        
        tl.to(this.camera.position, {
            x: 0,
            y: 50,
            z: 0,
            duration: 1,
            ease: 'circle'
        })
        tl.to(this.camera.position, {
            x: 0,
            y: 15,
            z: 0,
            duration: 2,
        
            ease: 'bounce'
        })
        
        
        this.cells.forEach((cell, index) => {
            const randomInt1 = Math.random()/4
            const randomInt2 = Math.random()/4
            const randomInt3 = Math.random()/4 
            
            gsap.to((cell.material as THREE.MeshBasicMaterial) .color, {
                r: newTargetColorRGB.r+randomInt1,
                g: newTargetColorRGB.g+randomInt2,
                b: newTargetColorRGB.b+randomInt3,
                duration: 1.5,
                repeat: 1,
                yoyo: true,
                ease: 'circle',
                delay: ((index * 0.005)+.2),
                onComplete: () => {
                    this.lightUpPaths(0)
                }
            });
        })
        
    }

    private updateWallPositions(board: Board) {
        if (this.wallPieces) {
            this.wallPieces.forEach(row => {
                row?.forEach(cell => {
                    cell?.forEach(wallPiece => {
                        if (wallPiece?.mesh) {
                            this.scene.remove(wallPiece.mesh);
                            wallPiece.mesh.geometry.dispose();
                            if (wallPiece.mesh.material instanceof THREE.Material) {
                                wallPiece.mesh.material.dispose();
                            }
                        }
                    });
                });
            });
        }
        this.wallPieces = [];


        board.cells.forEach((row, rowIdx) => {
            this.wallPieces![rowIdx] = [];
            row.forEach((cell, colIdx) => {
                this.wallPieces![rowIdx]![colIdx] = [];
                cell.walls.forEach((direction: Direction, wallIdx: number) => {
                    if (direction === Direction.North || Direction.East) {
                        const wallPiece = new WallPiece(direction,
                            { row: rowIdx, column: colIdx },
                            this.wallTextures,
                            wallIdx
                        );
                        this.wallPieces![rowIdx]![colIdx]!.push(wallPiece);
                        this.scene.add(wallPiece.mesh!);
                    }
                    
                });
            });
        });
}

    setUpBoard() {
        this.scene.traverse((child) =>
            {
                if (child instanceof THREE.Mesh)
                {
                    child.geometry.dispose()
                    for(const key in child.material)
                    {
                        const value = child.material[key]
                        if(value && typeof value.dispose === 'function')
                        {
                            value.dispose()
                        }
                    }
                }
        })
        const targetCell = this.board.findTargetCell()

        const wallPieces = this.placeWalls(this.board)
        this.placeRobots(this.board)
        if (targetCell) {
            this.placeTargetChip(targetCell)
        }
        
        this.placeCellMeshes()
        this.setUpGridPlane();
        const centerCube = new CenterCube(this.wallTextures)
        this.scene.add(centerCube.mesh!)
        this.debug.setupWallStyleControls(centerCube, wallPieces.flat(2))
        const centerChip = new CenterChip(this.symbol1, predefinedColors[this.board.getTargetRobotColor()]!)
        this.centerChip = centerChip
        this.scene.add(centerChip.mesh!)
        
      
        this.lightUpPaths(0)
    }
    setSelectedPiece(newSelection: THREE.Mesh) {
        this.selectedPiece = newSelection
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
        const gridChip = new targetChipPiece(position!, this.symbol1, predefinedColors[this.board.getTargetRobotColor()]!)
        this.targetChip = gridChip
        this.scene.add(gridChip.point!);

    }
    
    private setUpLights() {
        const ambientLight = new THREE.AmbientLight('#ffffff', 1);
        this.scene.add(ambientLight);
       
        const directionalLight = new THREE.DirectionalLight('#ffffff', 3.8)
        directionalLight.position.x = -10
        directionalLight.position.z = -10
        directionalLight.position.y = 7
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = .1;
        directionalLight.shadow.camera.far = 45;
        directionalLight.lookAt(0, 0, 0)
        this.scene.add(directionalLight)

        const pointLight = new THREE.PointLight(this.board.robots[0].color, 8);

        // target light
        pointLight.position.set(0, 3, 0); 
        pointLight.castShadow = true
        this.pointLight = pointLight
        this.scene.add(pointLight)
        this.debug.setUpLightStyleControls(ambientLight, directionalLight)
    }

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

    lightUpPaths(robotIndex: number) {
 
        const canMoveTo = this.board.findMoves(robotIndex)
        const currPosition = this.board.robotPositions[robotIndex]
        
        const cellsToLight: Position[]  = []


        if (canMoveTo['east']) {
            let columnToAdd = canMoveTo['east'].column
            while (currPosition!.column < columnToAdd) {
                cellsToLight.push({ row: currPosition!.row, column: columnToAdd })
                columnToAdd--
            }
        }
        
        if (canMoveTo['west']) {
            let columnToAdd = canMoveTo['west'].column;
            while (currPosition!.column > columnToAdd) { 
                cellsToLight.push({ row: currPosition!.row, column: columnToAdd });
                columnToAdd++;
            }
        }
 
        if (canMoveTo['south']) {
            let rowToAdd = canMoveTo['south'].row;
            while (currPosition!.row < rowToAdd) { 
                cellsToLight.push({ row: rowToAdd, column: currPosition!.column });
                rowToAdd--;
            }
        }

        if (canMoveTo['north']) {
            let rowToAdd = canMoveTo['north'].row;
            while (currPosition!.row > rowToAdd) {
                cellsToLight.push({ row: rowToAdd, column: currPosition!.column });
                rowToAdd++;
            }
        }
        this.lightUpCells(cellsToLight)   
    }

    private lightUpCells(cellsToLight: { row: number; column: number }[]) {
        
        this.cells.forEach((cell) => {
           
            const cellRow = Math.round(cell.position.z + 7.5); 
            const cellColumn = Math.round(cell.position.x + 7.5); 

            const isCellToLight = cellsToLight.some(
                toLight => toLight.row === cellRow && toLight.column === cellColumn
            );
    
            if (isCellToLight) {
                gsap.to((cell.material as THREE.MeshBasicMaterial).color, {
                    r: 1,
                    g: 1,
                    b: 1,
                    duration: .7,
                    ease: 'ease',
                    onComplete: () => {
                        
                        const pathColor = new THREE.Color(1, 1, 1); 
                        (cell.material as THREE.MeshBasicMaterial).color.set(pathColor);
                    },
                });
                gsap.to(cell.scale, { // Correct property for scaling
                    x: 1.4,
                    y: 0.1,
                    z: 1.4,
                    duration: .7,
              
                })
              
            } else {
    
                gsap.to((cell.material as THREE.MeshBasicMaterial).color, {
                    r: 0,
                    g: 0,
                    b: 0,
                    duration: .7,
                    ease: 'ease'
              
                });
                  gsap.to(cell.scale, {
                    x: 1.0,
                    y: 1.0,
                    z: 1.0,
                      duration: .5,
                      ease: 'expo.inOut'
                });;
    
            }
        });
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

    destroyRobotMeshes() {
        this.robotPieces.forEach(robotMesh => {
            robotMesh.geometry.dispose()
            if (Array.isArray(robotMesh.material)) {
                robotMesh.material.forEach(mat => {
                    if (mat && typeof mat.dispose === 'function') {
                        mat.dispose()
                    }
                })
            }
            else {
                if (robotMesh.material && typeof robotMesh.material.dispose === 'function') {
                    robotMesh.material.dispose()
                }
            }
            this.scene.remove(robotMesh)
        })
    }

    destroy() {
        // Add this method to properly clean up when the scene is no longer needed
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        this.controls.dispose();
        this.renderer.dispose();
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
        
        this.setSelectedPiece(this.robotPieces[0]!)
        
    }

    updateRobot(robotIndex: number, gameController: GameController) {
        const robotPosition = this.board.robotPositions[robotIndex]
        const robotMesh = this.robotPieces[robotIndex]

        gsap.to(robotMesh!.position, {
            x: robotPosition!.column - 7.5,
            z: robotPosition!.row - 7.5,
            duration: .8,
            onComplete: () => {
                this.lightUpPaths(robotIndex)
                gameController.unlockControls()
            }
        })
        
  
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
        const wallPieces: WallPiece[][][] = []
        this.wallPieces = []
        for (let row = 0; row < board.cells.length; row++) {
            this.wallPieces[row] = []
            for (let col = 0; col < board.cells[row]!.length; col++) {
                this.wallPieces[row]![col] = []
                if (board.cells[row]![col]!.walls.length > 0) {
                
                    for (let idx = 0; idx < board.cells[row]![col]!.walls.length; idx++) {
                        const direction = board.cells![row]![col]?.walls[idx]
                            const wallPiece = new WallPiece(direction!, {row: row, column: col}, this.wallTextures , idx)
                            this.wallPieces[row]![col]!.push(wallPiece)
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
            const newPosition = { row: placedRow, column: placedCol }
            const robotIndex = this.findRobotPosition(selectedPiece)
        

        return { newPosition, robotIndex };
        } 
        return null
    }

   


    findRobotPosition(selectedPiece: THREE.Mesh) {
        let robotIndex: number | null = null
              for (let i = 0; i < this.robotPieces.length; i++) {
              
                if (selectedPiece === this.robotPieces[i]) {
                  robotIndex = i
                }
        } 
        return robotIndex
      }

    checkRobotIntersections() {
       
        this.rayCaster.setFromCamera(this.mouse, this.camera);
    
        return this.rayCaster.intersectObjects(this.robotPieces);
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
            
            const robotIntersects = this.rayCaster.intersectObjects(this.robotPieces)  
                
            if (robotIntersects.length > 0) {
                this.robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
                const selectedPiece = robotIntersects[0]!.object
                selectedPiece.scale.set(1.5, 2, 1.5)
            }
            else {
                this.robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
            }
        } 
     
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.tick)
    }
}