import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



const loader = new GLTFLoader();

// camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 70, 100000);
camera.position.set(-2.58, 287.4, 962.6);
camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));



// scene
const scene = new THREE.Scene();

// const ambientLight = new THREE.AmbientLight(0xffffff, 2);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);


// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// scene settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

scene.background = new THREE.Color('#ffffff');
renderer.setClearAlpha(1);

// scene.background = new THREE.Color('red');
// renderer.setClearAlpha(1);

const example = loader.load('./assets/shiba/scene.gltf', function (gltf) {

    scene.add(gltf.scene);
    console.log("LOADED SHIBA SUCCESSFULLY");

}, undefined, function (error) {

    console.error(error);

});

renderer.render(scene, camera);

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}