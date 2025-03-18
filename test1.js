import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Create Scene
const scene = new THREE.Scene();

//Variables 
const width = window.innerWidth;
const height = window.innerHeight;

// Create Camera
const camera = new THREE.PerspectiveCamera(10, 1);
scene.add(camera);
camera.position.set(0, 0, 300);

//Create Shelves Geometry
// const geometry = new THREE.BoxGeometry(25, 2, 10);
const geometry = new RoundedBoxGeometry(25, 2, 10, 10, 0.3); // (Width, Height, Depth, Segments, Radius)
const material = new THREE.MeshBasicMaterial({ color: 0xC9B79C });
const cube = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);

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
// const ambientLight = new THREE.AmbientLight(0xffffff, 20);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
directionalLight.castShadow = true;
directionalLight.position.set(0, 88, 35);
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
const groundMaterial = new THREE.MeshStandardMaterial({ opacity: 0, color: 0xffff00, side: THREE.DoubleSide }); // Transparent shadow effect
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.rotation.x = -Math.PI / -2; // Make it horizontal
ground.position.set(0, 0, 0);
ground.receiveShadow = true;
scene.add(ground);



// Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

//Render Settings
renderer.shadowMap.enabled = true; // Enable Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft Shadows
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

//Initialize Renderer
renderer.render(scene, camera);
document.getElementById("container3D").appendChild(renderer.domElement);