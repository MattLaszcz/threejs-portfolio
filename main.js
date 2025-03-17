import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(8, 0.2, 1);
const material = new THREE.MeshBasicMaterial({ color: "white" });
const cube = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);

cube.position.set(0, 1.5, 0);  // Top
cube1.position.set(0, 0, 0);    // Middle
cube2.position.set(0, -1.5, 0); // Bottom

scene.add(cube);
scene.add(cube1);
scene.add(cube2);

camera.position.z = 5;
camera.position.y = 1;



renderer.render(scene, camera);

