import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
})
export class ViewerComponent implements AfterViewInit {
  @ViewChild('viewerWrapper', { static: false })
  viewerWrapperRef: ElementRef;
  private get canvas(): HTMLDivElement {
    return this.viewerWrapperRef.nativeElement as HTMLDivElement;
  }

  renderer: THREE.WebGLRenderer;

  fps: number = 60;
  camera: THREE.PerspectiveCamera;
  cameraControls: any;
  scene: THREE.Scene;
  ambientLight: THREE.AmbientLight;
  light: THREE.DirectionalLight;

  constructor() {}

  ngAfterViewInit(): void {
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createStubCube();

    this.render();
  }

  createStubCube() {
    var geometry = new THREE.BoxBufferGeometry(1, 1, 2);
    var material = new THREE.MeshStandardMaterial({ color: 0x123456 });

    let mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
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

    this.cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);
    this.ambientLight = new THREE.AmbientLight(0x333333); // 0.2

    this.light = new THREE.DirectionalLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);
    this.scene.add(this.light);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    setTimeout(() => {
      requestAnimationFrame(() => this.render());
    }, 1000 / this.fps);
  }
}
