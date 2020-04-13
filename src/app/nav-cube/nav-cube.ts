import { isArray } from 'util';
import { Vector3, Camera, Color } from 'three';
import * as THREE from 'three';

class NavCubeParams {
  camera: THREE.Camera;
  div: HTMLDivElement;
  homePosition: Vector3 = new Vector3(-1, -1, 1);
  // tween: boolean = false; TODO
  // showHome: boolean = false; TODO
  // highLight: boolean = false; TODO
  champer: number = 0.1; // precentage
}

enum Sides {
  Front = 1 << 1,
  Back = 1 << 2,
  Left = 1 << 3,
  Right = 1 << 4,
  Top = 1 << 5,
  Bottom = 1 << 6,
}

class NavCube {
  params: NavCubeParams;
  renderer: THREE.WebGLRenderer;
  localCamera: THREE.PerspectiveCamera;
  cubeMesh: THREE.Mesh;
  scene: THREE.Scene;
  ambientLight: THREE.AmbientLight;
  directionLight: THREE.DirectionalLight;

  constructor(params: NavCubeParams) {
    this.params = params;
    this.fillParams();
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.render();
  }

  fillParams() {
    if (!this.params) this.params = new NavCubeParams();

    if (!this.params.div) throw new Error('No div passed by user');
    if (this.params.div.clientWidth == 0 || this.params.div.clientHeight == 0)
      throw new Error('div client width/height == 0');
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    let canvasWidth = this.params.div.clientWidth;
    let canvasHeight = this.params.div.clientHeight;
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.params.div.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x123456, 0.12);
  }

  createScene() {
    this.cubeMesh = new THREE.Mesh();
    this.createMainFacets();
    this.createEdgeFacets();
    this.createCornerFacets();

    this.scene = new THREE.Scene();
    this.scene.add(this.cubeMesh);

    this.ambientLight = new THREE.AmbientLight(0x333333);
    this.directionLight = new THREE.DirectionalLight(0xffffff, 1.0);

    this.scene.add(this.ambientLight);
    this.scene.add(this.directionLight);
  }

  createMainFacets() {
    // it's math: the projection of the champer on the plane is champer / sqrt(2)
    // (Pythagoras), reduce from both side and you get:
    let width = 1.0 - Math.sqrt(2) * this.params.champer;
    let plane = new THREE.PlaneGeometry(width, width);
    let mat = new THREE.MeshBasicMaterial({});
    let halfPi = Math.PI / 2;
    let geometries = [];

    geometries[Sides.Front] = plane
      .clone()
      .rotateX(halfPi)
      .translate(0, 0.5, 0);
    geometries[Sides.Back] = plane
      .clone()
      .rotateX(-halfPi)
      .translate(0, -0.5, 0);
    geometries[Sides.Left] = plane
      .clone()
      .rotateY(halfPi)
      .translate(-0.5, 0, 0);
    geometries[Sides.Right] = plane
      .clone()
      .rotateY(-halfPi)
      .translate(0.5, 0, 0);
    geometries[Sides.Top] = plane.clone().translate(0, 0, 0.5);
    geometries[Sides.Bottom] = plane
      .clone()
      .rotateX(-Math.PI)
      .translate(0, 0, -0.5);

    let colors: THREE.Color[] = [];
    colors[Sides.Right] = new THREE.Color('red');
    colors[Sides.Left] = new THREE.Color('blue');
    colors[Sides.Top] = new THREE.Color('green');

    geometries.forEach((g, i) => {
      let sideMat = mat.clone();
      sideMat.color.setRGB(0, 0, 0);
      if (colors[i]) sideMat.color.copy(colors[i]);
      this.cubeMesh.add(new THREE.Mesh(g, sideMat));
    });
  }

  createCornerFacets() {}
  createEdgeFacets() {}

  render() {
    // change this to event driven
    this.renderer.render(this.scene, this.localCamera);

    setTimeout(() => {
      requestAnimationFrame(() => this.render());
    }, 1000 / 60);
  }
  createCamera() {
    let ratio = this.params.div.clientWidth / this.params.div.clientHeight;
    this.localCamera = new THREE.PerspectiveCamera(45, ratio, 0.01, 5);
    this.localCamera.position.copy(
      this.params.homePosition.clone().multiplyScalar(-Math.sqrt(2))
    );
    this.localCamera.lookAt(new Vector3(0, 0, 0));

    // let rotationMat = new THREE.Matrix4();
    // this.params.camera.modelViewMatrix.extractRotation(rotationMat);
    // let quaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMat);
    // let position = new THREE.Vector3(2, 0, 0);
    // let scale = new THREE.Vector3(1, 1, 1);
    // this.localCamera.modelViewMatrix.compose(position, quaternion, scale);
  }
}

export { NavCube, NavCubeParams };
