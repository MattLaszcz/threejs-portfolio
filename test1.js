import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { shiba3D } from './shiba';

// Create Scene
const scene = new THREE.Scene();

//Variables 
const width = window.innerWidth;
const height = window.innerHeight;
const lightPosition = { x: 0, y: 30, z: 20 };

// Create Camera
export const camera = new THREE.PerspectiveCamera(10, 1);
scene.add(camera);
camera.position.set(0, 0, 300);

//Create Shelves Geometry
// const geometry = new THREE.BoxGeometry(25, 2, 10);
const geometry = new RoundedBoxGeometry(25, 2, 10, 10, 0.3); // (Width, Height, Depth, Segments, Radius)
const material = new THREE.MeshStandardMaterial({ color: 0xB0BAAD });
const cube = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);

const createSphere = () => {
    let x = 2;
    let y = 10;
    let z = 5;

    const geometry = new THREE.SphereGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material); scene.add(sphere);
    sphere.position.set(lightPosition.x, lightPosition.y, lightPosition.z);

    scene.add(sphere);
}

createSphere();

//Middle Shelf
shiba3D(scene, { x: -10, y: 4, z: 0 });
shiba3D(scene, { x: 0, y: 4, z: 0 });
shiba3D(scene, { x: 10, y: 4, z: 0 });

//Top Shelf
shiba3D(scene, { x: -10, y: 19, z: 0 });
shiba3D(scene, { x: 0, y: 19, z: 0 });
shiba3D(scene, { x: 10, y: 19, z: 0 });

//Bottom Shelf
shiba3D(scene, { x: -10, y: -11, z: 0 });
shiba3D(scene, { x: 0, y: -11, z: 0 });
shiba3D(scene, { x: 10, y: -11, z: 0 });

//Shelf Geometry Settings
cube.position.set(0, 0, 0);
cube1.position.set(0, 15, 0);
cube2.position.set(0, -15, 0);

// Enable shadow casting
cube.castShadow = true;
cube1.castShadow = true;
cube2.castShadow = true;

//Initialize Cubes
scene.add(cube, cube1, cube2);

// Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0);
// ambientLight.position.set(0, 0, 10);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xF1E0C5, 1);

directionalLight.castShadow = true;
directionalLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
directionalLight.shadow.mapSize.width = 2048; // Default is 512
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.camera.near = 11;
directionalLight.shadow.camera.far = 55;

scene.add(directionalLight);

// Create Shader Material with Gradient
const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color1: { value: new THREE.Color(0xE5D0BF) }, // Beige
        color2: { value: new THREE.Color(0xffdfc5) }  // White
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
    `
});

// Create Ground to Receive Shadows
const groundGeometry = new THREE.PlaneGeometry(50, 1000);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5, color: 0xB0BAAD, side: THREE.DoubleSide }); // Transparent shadow effect
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / -2; // Make it horizontal
ground.position.y = -20;
//ground.position.set(0, 0, 0);
//ground.receiveShadow = true;
scene.add(ground);



// Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Animation Loop (Fixes missing rendering)
function animate() {
    requestAnimationFrame(animate);
    //controls.update();
    renderer.render(scene, camera);
}
animate();

//Render Settings
renderer.shadowMap.enabled = true; // Enable Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft Shadows
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);



//Initialize Renderer
renderer.render(scene, camera);
document.getElementById("container3D").appendChild(renderer.domElement);