import * as THREE from 'three';
import { scene, camera, renderer } from './threeSetup.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// GLTF Loader
const loader = new GLTFLoader();

// Raycaster for Hover Detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let shibaModels = []; // Store all loaded models

// Mouse Move Event Listener
// window.addEventListener('mouseover', (event) => {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     console.log(mouse.x, mouse.y);
// });

function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    console.log("Pointer Move", event, mouse.x, mouse.y);

}

//Orbit Controlls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Function to Load the Shiba Model
export const shiba3D = (position) => {
    return new Promise((resolve, reject) => {
        loader.load('./assets/shiba/scene.gltf',
            function (gltf) {
                let shibaModel = gltf.scene;
                shibaModel.scale.set(3, 3, 3);
                shibaModel.position.set(position.x, position.y, position.z);
                shibaModel.castShadow = true;
                scene.add(shibaModel);
                resolve(shibaModel); // ✅ return the model when loaded
            },
            undefined,
            function (error) {
                console.error("Error loading model:", error);
                reject(error);
            }
        );
    });
};


// Animation Loop for Hover Rotation
function animate() {
    const shibaSpacing = 20;
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects();

    for (let i = 0; i < intersects.length; i++) {

        intersects[i].object.rotation.z += 0.03;

    }

    renderer.render(scene, camera);

    orbitControls.update();

    renderer.render(scene, camera);
}

window.addEventListener('mousemove', onPointerMove);

window.requestAnimationFrame(animate);
animate();


