import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { NavCubeParams, NavCube } from '../nav-cube/nav-cube';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
})
export class ViewerComponent implements AfterViewInit {
  @ViewChild('viewerWrapper', { static: false })
  viewerWrapperRef: ElementRef;

  @ViewChild('navCube', { static: false })
  navCubeDivRef: ElementRef;

  private get canvas(): HTMLDivElement {
    return this.viewerWrapperRef.nativeElement as HTMLDivElement;
  }

  renderer: THREE.WebGLRenderer;

  fps: number = 60;
  camera: THREE.PerspectiveCamera;
  cameraControls: any;
  scene: THREE.Scene;
  ambientLight: THREE.AmbientLight;
  directionLight1: THREE.DirectionalLight;
  directionLight2: THREE.DirectionalLight;

  constructor() {}

  ngAfterViewInit(): void {
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createStubObjects();
    this.initNavCube();

    this.render();
  }

  initNavCube() {
    let navCubeParams: NavCubeParams = {
      camera: this.camera,
      div: this.navCubeDivRef.nativeElement,
      champer: 0.15,
      homePosition: new THREE.Vector3(-1, -1, 1),
    };
    new NavCube(navCubeParams);
  }

  createStubObjects() {
    var geometry = new THREE.BoxBufferGeometry(1, 2, 3);
    var material = new THREE.MeshStandardMaterial({ color: 0x123456 });

    let mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

    let dir = new THREE.Vector3(1, 0, 0);
    let origin = new THREE.Vector3(0, 0, 0);
    let length: number = 4;
    let arroColor = 0x132435;
    var arrowHelper = new THREE.ArrowHelper(dir, origin, length, arroColor);
    this.scene.add(arrowHelper);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    let canvasWidth = this.canvas.clientWidth;
    let canvasHeight = this.canvas.clientHeight;
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.viewerWrapperRef.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x543210);
  }

  createCamera() {
    let ratio = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, ratio, 1, 800);
    this.camera.position.set(-5, 5, 5);
    this.camera.up.copy(new THREE.Vector3(0, 0, 1));
    this.cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);
    this.ambientLight = new THREE.AmbientLight(0x333333); // 0.2
    this.directionLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionLight1.position.set(10, 10, 20);
    this.directionLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    this.directionLight2.position.set(-10, 10, 10);

    this.scene.add(this.ambientLight);
    this.scene.add(this.directionLight1);
    this.scene.add(this.directionLight2);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    setTimeout(() => {
      requestAnimationFrame(() => this.render());
    }, 1000 / this.fps);
  }
}
