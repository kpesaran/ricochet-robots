
import javascriptLogo from '/assets/javascript.svg'
import viteLogo from '/assets/vite.svg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


import Positions from './positions.js'
import {
  generateGridPlane,
  generateCenterChip, generateTargetChip, generateCenterBlock, placeRobots, placeWalls, onMouseDown, onMouseMove
} from './utilites.js'
import { BoardBuilder } from './util/boardBuilder.ts'
import { Color } from './board/color.ts'
import { SceneController } from './scene/sceneController.ts'
import * as THREE from 'three'
import { Board } from './board/board.ts'
import { GameController } from './game/gameController.ts'
import { Direction } from './board/direction.ts'

const canvas = document.querySelector('canvas.webgl')

const gameController = new GameController()

// gameController.board.cells[2]?.[1]?.addWall(Direction.North)
console.log(gameController.board)

const sceneController = new SceneController('canvas.webgl', gameController.board)









// // symbol texture loader 
// const textureLoader = new THREE.TextureLoader()
// const symbol1 = textureLoader.load('/textures/symbols/2.png');







// // Scene 
// const scene = new THREE.Scene()

// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight
// }

// // Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
// camera.position.y = 20
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


// // Define Grid
// const gridPlane = generateGridPlane()
// scene.add(gridPlane);

// // Grid Helper 
// const gridhelper = new THREE.GridHelper(16,16)
// scene.add(gridhelper)

// // Axes Helper 
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
// // Renderer 
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   alpha: true
// })

// // Add Board Instance
// const boardBuilder = new BoardBuilder()
// const board = boardBuilder.build()

// //Place Robots & Walls 
// const robotPieces = []
// placeRobots(scene, board, robotPieces)
// placeWalls(scene, board)

// // Center Objects
// generateCenterBlock(scene)
// generateCenterChip(scene, symbol1)

// // Target Grid Chip
// board.cells[15][15].isTarget = true 
// generateTargetChip(scene, board.findTargetCell(),symbol1)


// // Lights 
// const ambientLight = new THREE.AmbientLight('#ffffff', 2)
// scene.add(ambientLight)


// // Render
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.render(scene, camera)

// // Mouse 

// const mouse = {}
// window.addEventListener('mousemove', (event) => {
//   mouse.x =  (event.clientX / sizes.width)*2 - 1
//   mouse.y = -(event.clientY / sizes.height)*2 + 1
// })
// window.addEventListener('mousedown', (event) => {
//   console.log(event)
//   console.log(raycaster)
// })
// // Mouse Interactions
// const grid = [gridPlane]

// window.addEventListener('click', (event) => onMouseDown(event, robotPieces, gridPlane, raycaster, camera));
// window.addEventListener('mousemove', (event) => onMouseMove(event, gridPlane, raycaster, camera));
// // window.addEventListener('dblclick', (event) => onMouseUp(event)); 

// const raycaster = new THREE.Raycaster()
// console.log(raycaster)

// // window resize 
// window.addEventListener('resize', () => {
//   sizes.width = window.innerWidth
//   sizes.height = window.innerHeight
//   camera.aspect = sizes.width / sizes.height
//   camera.updateProjectionMatrix()
//   // Cast ray from mouse 
//   // Update renderer
//   renderer.setSize(sizes.width, sizes.height)
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })
// // render next frame
// const tick = () => {
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
//     // raycaster
//     raycaster.setFromCamera(mouse, camera)
//     if (robotPieces.length > 0) {
//       const robotIntersects = 
//         raycaster.intersectObjects(robotPieces)  
//       if (robotIntersects.length > 0) {
//         robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
//         const selectedPiece = robotIntersects[0].object
//         selectedPiece.scale.set(1.5, 2, 1.5)
//         console.log(robotIntersects)
//       }
//       else {
//         robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
//       }
//     }
//     // For orbit controls damping
//     controls.update()
//   }
// tick()


