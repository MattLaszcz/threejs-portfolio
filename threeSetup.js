import * as THREE from 'three';
import { CustomCamera, IsometricCamera } from './cameras/mainCamera.js';

// Create Scene
const scene = new THREE.Scene();

const shibaScene = new THREE.Scene();


// Create Camera
const createCamera = new CustomCamera(10, 1);
const createIsometricCamera = new IsometricCamera(10, 1, .1, 1000, 250, 250, 400);
const camera = createCamera.getCamera();
const isometricamera = createIsometricCamera.getCamera();
scene.add(camera);
shibaScene.add(camera);


// Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

//Render Settings
renderer.shadowMap.enabled = true; // Enable Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft Shadows
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById("container3D").appendChild(renderer.domElement);

// ✅ Animation Loop (Ensures continuous rendering)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    renderer.render(shibaScene, camera);
}
animate();

export { scene, camera, renderer, shibaScene }