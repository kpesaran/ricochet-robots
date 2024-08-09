
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import * as THREE from 'three'

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

//Robot Piece

const colors = ['red', 'yellow', 'green', 'blue']
const robotGeom = new THREE.CylinderGeometry(.01, .3, 1) 

const robotPieces = []
function placeRobots() {
  for (const robotColor of colors) {
    const robotMesh = new THREE.Mesh(robotGeom, new THREE.MeshBasicMaterial({ 
      color: robotColor
    }))
    const x = (Math.floor(Math.random()*16) - 8) +.5
    const y = .5
    const z = (Math.floor(Math.random() * 16) - 8) + .5
    console.log(robotMesh)
   
    robotMesh.position.set(x, y, z)
    scene.add(robotMesh)
    robotPieces.push(robotMesh)
  }
}
placeRobots()







// Wall 

const wallPieceGeom = new THREE.BoxGeometry(1, .5, .1) 
const wallPieceMat = new THREE.MeshStandardMaterial()

const wallPieceMesh1 = new THREE.Mesh(wallPieceGeom, wallPieceMat)
const wallPieceMesh2 = new THREE.Mesh(wallPieceGeom, wallPieceMat)

wallPieceMesh1.position.z = -.5
wallPieceMesh1.position.x = -.5

wallPieceMesh2.rotation.y = Math.PI * .5


const wallGroup = new THREE.Group()

wallGroup.position.set(-5, .25, .5)


wallGroup.add(wallPieceMesh1)
wallGroup.add(wallPieceMesh2)
scene.add(wallGroup)


// Chips

// Center Symbol Chip 
const symbolTextures = [symbol1, symbol2, symbol3, symbol4]



const centerSymbolGeom = new THREE.BoxGeometry(1, 1, 1)
const centerSymbolMat = new THREE.MeshStandardMaterial({
 
  color: colors[Math.floor(Math.random()*4)],
  alphaMap: symbolTextures[Math.floor(Math.random()*4)],
  alphaTest: .05,
  transparent: true,
  // side: THREE.DoubleSide
})


const centerSymbolMesh = new THREE.Mesh(centerSymbolGeom, centerSymbolMat)
scene.add(centerSymbolMesh)
centerSymbolMesh.position.set(0,1,0)

// const placeSymbols = () => {

// }


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
// render next frame
const tick = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)

  // raycaster
  raycaster.setFromCamera(mouse, camera)
 
  // if (robotMesh) {
  //   const robotIntersects = 
  //     raycaster.intersectObject(robotMesh)
      
  //   if (robotIntersects.length > 0) {
  //     robotMesh.scale.set(1.5, 2, 1.5)
  //     console.log(robotIntersects)
  //   }

  //   else {
  //     robotMesh.scale.set(1,1,1)
  //   }
  // }

  // For orbit controls damping
  controls.update()
}
tick()

