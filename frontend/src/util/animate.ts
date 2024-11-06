import * as THREE from 'three'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export function cameraGoesUpDown(camera: THREE.PerspectiveCamera, controls: OrbitControls) {
    gsap.to(camera.position, {
        y: camera.position.y - 12.5,
        duration: 1.0,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
        repeatDelay: 0.01, 
        onComplete: () => {
            controls.enabled = true;
        },
        onUpdate: () => {
            camera.updateProjectionMatrix(); 
        }
    });
}

