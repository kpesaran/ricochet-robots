
import javascriptLogo from '/assets/javascript.svg'
import viteLogo from '/assets/vite.svg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Positions from './positions.js'
import { placeWalls, onMouseDown, onMouseMove } from './utilites.js'
import { BoardBuilder } from './util/boardBuilder.ts'
import { Color } from './board/color.ts'

import * as THREE from 'three'



const boardPositions = new Positions()
console.log(boardPositions)
const canvas = document.querySelector('canvas.webgl')

// symbol texture loader 
const textureLoader = new THREE.TextureLoader()
const symbol1 = textureLoader.load('/textures/symbols/2.png');


const symbol2 = textureLoader.load('/textures/symbols/3.png')
const symbol3 = textureLoader.load('/textures/symbols/9.png')
const symbol4 = textureLoader.load('/textures/symbols/13.png')

console.log(symbol1)
// Scene 
const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
camera.position.y = 20


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Axes Helper 
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Define Grid
const gridSize = 16
const cellSize = 1

const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize); 

// Create a material for the plane. We'll make it invisible but still interactable
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: .4
});


const gridPlane = new THREE.Mesh(planeGeometry, planeMaterial);
gridPlane.rotation.x = -Math.PI / 2;
gridPlane.position.y = 0;
scene.add(gridPlane);

// Grid Helper 
const gridhelper = new THREE.GridHelper(16,16)
scene.add(gridhelper)
// Renderer 
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})

// Center 

const centerSquareGeom = new THREE.BoxGeometry(2, 1, 2) 
const centerSquareMat = new THREE.MeshStandardMaterial({
  color: 'grey',
  metalness: .1,
  roughness: .5
})

const centerSquareMesh = new THREE.Mesh(centerSquareGeom, centerSquareMat)
scene.add(centerSquareMesh)

// Add board class
const boardBuilder = new BoardBuilder()
const board = boardBuilder.build()



//Robot Piece

function placeRobots(board) {
  const robotGeom = new THREE.CylinderGeometry(.01, .3, 1) 
  for (let i = 0; i < board.robots.length; i++) {

    let robotColor = null
   

    switch (board.robots[i].color) {
      case Color.Red:
        robotColor = 'red'
        break;
      case Color.Blue:
        robotColor = 'blue'
        break;
      case Color.Green:
        robotColor = 'green'
        break;
      case Color.Yellow:
        robotColor = 'yellow'
        break;
      }

    const robotMesh = new THREE.Mesh(robotGeom, new THREE.MeshBasicMaterial({ 
      color: robotColor
    }))
    
    robotMesh.position.set(board.robotPositions[i].column-7.5, .5 , board.robotPositions[i].row-7.5)
    // const x = (Math.floor(Math.random()*16) - 8) +.5
    // const y = .5
    // const z = (Math.floor(Math.random() * 16) - 8) + .5
    console.log(robotMesh)
   
    
    scene.add(robotMesh)
    robotPieces.push(robotMesh)
  }
}
placeRobots()


placeWalls(scene, board)




// Wall 

// const wallPieceGeom = new THREE.BoxGeometry(1, .5, .1) 
// const wallPieceMat = new THREE.MeshStandardMaterial()

// const wallPieceMesh1 = new THREE.Mesh(wallPieceGeom, wallPieceMat)
// const wallPieceMesh2 = new THREE.Mesh(wallPieceGeom, wallPieceMat)

// wallPieceMesh1.position.z = -.5
// wallPieceMesh1.position.x = -.5

// wallPieceMesh2.rotation.y = Math.PI * .5


// const wallGroup = new THREE.Group()

// wallGroup.position.set(-5, .25, .5)


// wallGroup.add(wallPieceMesh1)
// wallGroup.add(wallPieceMesh2)
// scene.add(wallGroup)


// Chips

// Center Symbol Chip 
const symbolTextures = [symbol1, symbol2, symbol3, symbol4]



const centerSymbolGeom = new THREE.BoxGeometry(1, 1, 1)
const centerSymbolMat = new THREE.MeshStandardMaterial({
 
  color: boardPositions.target.color,
  alphaMap: symbolTextures[0],
  alphaTest: .001,
  transparent: true,
  // side: THREE.DoubleSide
})


const centerSymbolMesh = new THREE.Mesh(centerSymbolGeom, centerSymbolMat)
scene.add(centerSymbolMesh)
centerSymbolMesh.position.set(0,1,0)


// grid chips 





function generateTargetChip(position) {
  console.log(position)
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
gridChipsMat.color = new THREE.Color(boardPositions.target.color)
// particlesMaterial.vertexColors = true
gridChipsMat.transparent = true
gridChipsMat.alphaMap = symbol1


gridChipsMat.depthWrite = false
 

const gridChips = new THREE.Points(gridChipsGeom, gridChipsMat)

scene.add(gridChips)

}

}
  

board.cells[15][15].isTarget = true 
generateTargetChip(board.findTargetCell())

// Center Chip





// Lights 
const ambientLight = new THREE.AmbientLight('#ffffff', 2)
scene.add(ambientLight)
// Render
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

// Mouse 

const mouse = {}
window.addEventListener('mousemove', (event) => {
  mouse.x =  (event.clientX / sizes.width)*2 - 1
  mouse.y = -(event.clientY / sizes.height)*2 + 1
})

window.addEventListener('mousedown', (event) => {
  console.log(event)
  console.log(raycaster)
})


// Mouse Interactions
const grid = [gridPlane]

window.addEventListener('click', (event) => onMouseDown(event, robotPieces, gridPlane, raycaster, camera));
window.addEventListener('mousemove', (event) => onMouseMove(event, gridPlane, raycaster, camera));
// window.addEventListener('dblclick', (event) => onMouseUp(event)); 

const raycaster = new THREE.Raycaster()
console.log(raycaster)

const clock = new THREE.Clock
// window resize 
window.addEventListener('resize', () => {

  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Cast ray from mouse 
  

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
console.log(robotPieces)
// render next frame
const tick = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)

  // raycaster
  raycaster.setFromCamera(mouse, camera)
 
  if (robotPieces.length > 0) {
    const robotIntersects = 
      raycaster.intersectObjects(robotPieces)
    
      
    if (robotIntersects.length > 0) {
      robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
      const selectedPiece = robotIntersects[0].object
      selectedPiece.scale.set(1.5, 2, 1.5)
      console.log(robotIntersects)
    }

    else {
      robotPieces.forEach(piece => piece.scale.set(1, 1, 1));
    }
  }

  // For orbit controls damping
  controls.update()
}
tick()


