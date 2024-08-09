
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
  color: 'grey'
})

const centerSquareMesh = new THREE.Mesh(centerSquareGeom, centerSquareMat)
scene.add(centerSquareMesh)

// Mock Pieces 


const pieceGeom = new THREE.CylinderGeometry(.01, .3, 1) 
const pieceMat = new THREE.MeshBasicMaterial({
  color: 'red' 
})
const pieceMesh = new THREE.Mesh(pieceGeom, pieceMat)
scene.add(pieceMesh)

pieceMesh.position.set(4.5,.5,.5)

// Lights 
const ambientLight = new THREE.AmbientLight('#ffffff', .7)
scene.add(ambientLight)
// Render
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene,camera)

const clock = new THREE.Clock
// window resize 
window.addEventListener('resize', () => {

  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// render next frame
const tick = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
  // For orbit controls damping
  controls.update()
}
tick()

