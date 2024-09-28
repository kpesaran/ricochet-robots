import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Position } from '../board/position';
import { Board } from '../board/board';
// import { Board } from '../board/board';
import { Color }  from '../board/color'
import WallPiece from './wallPiece';

interface Size {
    width: number;
    height: number;
  }

export class SceneController {
    scene: THREE.Scene;
    board: Board
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer ;
    sizes: Size;
    canvas: HTMLCanvasElement | null;
    controls: OrbitControls;
    textureLoader: THREE.TextureLoader
    // need to change
    symbol1: THREE.Texture
    robotPieces: THREE.Mesh[]
    cellArea: number
    gridSize: number
    cells: THREE.Mesh[]

   

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
        // Renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas!, alpha: true });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        // Cells 
        this.cells = []
        // Set Up The Scene
        this.setUpBoard()
        this.setUpLights()
        // this.lightPaths()
        this.setUpAxesHelpers()
        
        this.setUpEventListeners()
        
        this.tick = this.tick.bind(this);
        this.tick()
    }

    setUpBoard() {
        // placeWalls()
        // placeBoard()
        this.placeWalls(this.board)
        this.placeRobots(this.board)
        this.generateTargetChip({ row: 12, column: 14 })
        this.placeCellMeshes()

        // Grid Plane
        const planeGeometry = new THREE.PlaneGeometry(this.gridSize, this.gridSize); 

        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: .10
        });

        const gridPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        gridPlane.rotation.x = -Math.PI / 2;
        gridPlane.position.y = 0;
        this.scene.add(gridPlane);

        // Center - Squre 
        const centerSquareGeom = new THREE.BoxGeometry(2, 1, 2) 
        const centerSquareMat = new THREE.MeshStandardMaterial({
            color: 'grey',
            metalness: .1,
            roughness: .5
        })

        const centerSquareMesh = new THREE.Mesh(centerSquareGeom, centerSquareMat)
        this.scene.add(centerSquareMesh)

        // Center - Chip
        const centerSymbolGeom = new THREE.BoxGeometry(1, 1, 1)
        const centerSymbolMat = new THREE.MeshStandardMaterial({
            color: 'red',
            alphaMap: this.symbol1,
            alphaTest: .001,
            transparent: true,
        })
        const centerSymbolMesh = new THREE.Mesh (centerSymbolGeom, centerSymbolMat)
        this.scene.add(centerSymbolMesh)
        centerSymbolMesh.position.set(0,1,0)
    }

    setUpAxesHelpers() {
        // AxesHelper 
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
        // GridHelper
        const gridHelper = new THREE.GridHelper(16, 16,'white','white');
        this.scene.add(gridHelper);
    }

    generateTargetChip(position: Position) {
        if (position) {
          const gridChipsGeom = new THREE.BufferGeometry()
          const positions = new Float32Array(3)
          const x = (position.row) - 8.5
          const y = .2
          const z = (position.column) - 8.5
          positions[0] = x
          positions[1] = y
          positions[2] = z
        gridChipsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 
      // particlesGeometry.setAttribute('color', new THREE.BufferAttribute(gridChipsColors,3)) 
        const gridChipsMat = new THREE.PointsMaterial({
        size: 1,
          sizeAttenuation: true 
      })
        gridChipsMat.color = new THREE.Color('red')
      // particlesMaterial.vertexColors = true
        gridChipsMat.transparent = true
        gridChipsMat.alphaMap = this.symbol1
        gridChipsMat.depthWrite = false
        const gridChips = new THREE.Points(gridChipsGeom, gridChipsMat)
        this.scene.add(gridChips)
        }
      }
    setUpLights() {
        const ambientLight = new THREE.AmbientLight('#ffffff', 2);
        const directionalLight = new THREE.DirectionalLight('#ffffff',1 )
        this.scene.add(ambientLight);
        directionalLight.position.y = 5
        this.scene.add(directionalLight)
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
    placeCellMeshes() {
        const cellGeometry = new THREE.BoxGeometry(.7, .3,.7); 
        for (let i = 0; i < this.gridSize; i++){
            for (let j = 0; j < this.gridSize; j++) {
                const cellMaterial = new THREE.MeshStandardMaterial({
                    // "rgb(30, 100, 70)")
                    color: new THREE.Color("rgb(0, 100, 70)"),
                    roughness: .3,
                    metalness: 1
                });
                const cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
                // if (i === 15 && j == 0) {
                //     cellMaterial.color = new THREE.Color('white')
                // }
                cellMesh.position.x = i + -7.5 
                cellMesh.position.z = j + -7.5   
                cellMesh.position.y = -.1
                this.cells.push(cellMesh)
                this.scene.add(cellMesh)    
            }
        }
    }
    placeRobots(board: Board) {
        const robotGeom = new THREE.CylinderGeometry(.01, .3, 1)
        for (let i = 0; i < board.robots.length; i++) {
            let robotColor: string | undefined
            const robot = board.robots[i]
            if (robot && robot.color) {
                switch (robot.color) {
                    case Color.Blue:
                        robotColor = 'blue'
                        break;
                    case Color.Green:
                        robotColor = 'green'
                        break;
                    case Color.Yellow:
                        robotColor = 'yellow'
                        break;
                    // !!!
                    // case Color.Red:
                    //     robotColor = 'red'
                    //     break;
                }
            }
          const robotMesh = new THREE.Mesh(robotGeom, new THREE.MeshBasicMaterial({
            color: robotColor
          }))
          const robotPosition = this.board.robotPositions[i];
            if (robotPosition) {
                robotMesh.position.set(robotPosition.column-7.5, .5 , robotPosition.row-7.5)
          }
          this.scene.add(robotMesh)
          this.robotPieces.push(robotMesh)
        }
    }
    
    placeWalls(board: Board) {
        
        for (let row = 0; row < board.cells.length; row++) {
        
            for (let col = 0; col < board.cells[row]!.length; col++) {
                
                if (board.cells[row]![col]!.walls.length > 0) {
        
                    for (const direction of board.cells[row]![col]!.walls) {
                            const wallPiece = new WallPiece(direction, {row: row, column: col})
                        
                            this.scene.add(wallPiece.mesh!)
                        }
                    }
                }
            }
        }

    setUpEventListeners() {
        window.addEventListener('resize', () => this.onResize());
    }
    
    onResize() {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    
    tick = () => {
        this.renderer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.tick)
        // this.controls.update()
        // raycaster
        // raycaster.setFromCamera(mouse, camera)
        // if (robotPieces.length > 0) {
        //   const robotIntersects = 
        //     raycaster.intersectObjects(robotPieces)  
        //   if (robotIntersects.length > 0) {
        //     robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
        //     const selectedPiece = robotIntersects[0].object
        //     selectedPiece.scale.set(1.5, 2, 1.5)
        //     console.log(robotIntersects)
        //   }
        //   else {
        //     robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
        //   }
        // } 
        // For orbit controls damping 
      }
}