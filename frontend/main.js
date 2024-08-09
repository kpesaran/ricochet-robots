
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')

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

// Mock Pieces 


const robotGeom = new THREE.CylinderGeometry(.01, .3, 1) 
const robotMat = new THREE.MeshBasicMaterial({
  color: 'red' 
})
const robotMesh = new THREE.Mesh(robotGeom, robotMat)
scene.add(robotMesh)

robotMesh.position.set(4.5, .5, .5)



// Lights 
const ambientLight = new THREE.AmbientLight('#ffffff', .7)
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
 
  if (robotMesh) {
    const robotIntersects = 
      raycaster.intersectObject(robotMesh)
      
    if (robotIntersects.length > 0) {
      robotMesh.scale.set(1.5, 2, 1.5)
      console.log(robotIntersects)
    }

    else {
      robotMesh.scale.set(1,1,1)
    }
  }

  // For orbit controls damping
  controls.update()
}
tick()

