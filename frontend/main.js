
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
// camera.position.y = Math.PI * .5

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Grid Helper 
const gridhelper = new THREE.GridHelper(16,16)
scene.add(gridhelper)
// Renderer 
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
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
}
tick()

