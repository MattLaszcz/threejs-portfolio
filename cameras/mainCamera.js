import * as THREE from 'three';

export class CustomCamera {
    constructor(fov = 10, aspect = 1, near = .1, far = 1000, x = 0, y = 10, z = 80) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
        // this.camera.lookAt(0, 0, 0);
        this.camera.position.set(x, y, z);
    }

    getCamera() {
        return this.camera;
    }
}

export class IsometricCamera {
    constructor(fov = 10, aspect = 1, near = .1, far = 1000, x = 0, y = 0, z = 350) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    getCamera() {
        return this.camera;
    }
}