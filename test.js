import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create Scene
const scene = new THREE.Scene();

// Create Camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .5, 30);
scene.add(camera);
camera.position.set(0, 0, 20); // Move camera back so we can see objects


// Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Smooth movement

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// GLTF Loader
const loader = new GLTFLoader();

const loadMultipleObjects = () => {
    const gridSize = 3; // 3x3 Grid
    const spacing = 10; // Space between models

    loader.load('./assets/shiba/scene.gltf', function (gltf) {
        const model = gltf.scene;
        model.scale.set(3, 3, 3); // Scale up if too small

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const clone = model.clone();

                // Position objects in a grid (centered at 0,0,0)
                const x = (col - 1) * spacing; // Left to Right
                const y = (row - 1) * 7; // Front to Back

                clone.position.set(x, y, 0);
                scene.add(clone);
            }
        }
    }, undefined, function (error) {
        console.error("Error loading model:", error);
    });
};

// Call the function to load objects
loadMultipleObjects();

// Animation Loop (Fixes missing rendering)
function animate() {
    requestAnimationFrame(animate);
    //controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Window Resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
