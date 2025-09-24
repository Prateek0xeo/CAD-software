"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

export class Scene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private controls: TrackballControls;
  private frustumSize: number;

  // View positions
  private topViewPosition: THREE.Vector3;
  private topViewTarget: THREE.Vector3;
  private threeDViewPosition: THREE.Vector3;
  private threeDViewTarget: THREE.Vector3;

  // Drawing state
  private isDrawingMode: boolean;
  private points: THREE.Vector3[];
  private lines: THREE.Line[];
  private previewLine: THREE.Line | null;
  private jointPoints: THREE.Vector3[];

  // Materials
  private lineMaterial: THREE.LineBasicMaterial;
  private previewMaterial: THREE.LineBasicMaterial;
  private pointGeometry: THREE.CircleGeometry;
  private pointMaterial: THREE.MeshBasicMaterial;
  private snapDistance: number;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      console.error("❌ Canvas is undefined!");
      return;
    }

    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setClearColor(0x222222);

    this.scene = new THREE.Scene();

    // Camera setup (Orthographic)
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.frustumSize = 1000;
    this.camera = new THREE.OrthographicCamera(
      (-this.frustumSize * aspect) / 2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      -this.frustumSize / 2,
      1,
      3000
    );
    this.camera.position.set(0, 1500, 1500);
    this.camera.lookAt(0, 0, 0);

    // Save camera presets
    this.topViewPosition = new THREE.Vector3(0, 2000, 0);
    this.topViewTarget = new THREE.Vector3(0, 0, 0);
    this.threeDViewPosition = new THREE.Vector3(0, 1500, 1500);
    this.threeDViewTarget = new THREE.Vector3(0, 0, 0);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(200);
    this.scene.add(axesHelper);

    // Grid Helper
    const size = 1000;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x404040, 0x404040);
    this.scene.add(gridHelper);

    // Controls
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);

    // Drawing state
    this.isDrawingMode = false;
    this.points = [];
    this.lines = [];
    this.previewLine = null;
    this.jointPoints = [];

    // Materials
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
    this.previewMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1, opacity: 0.5, transparent: true });
    this.pointGeometry = new THREE.CircleGeometry(2, 16);
    this.pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.snapDistance = 10;

    // Events
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));

    this.animate();
  }

  private onWindowResize() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const camera = this.camera;
    camera.left = (-this.frustumSize * aspect) / 2;
    camera.right = (this.frustumSize * aspect) / 2;
    camera.top = this.frustumSize / 2;
    camera.bottom = -this.frustumSize / 2;
    camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseDown(event: MouseEvent) {
    if (!this.isDrawingMode) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0);

    // Project mouse position to 3D space
    vec.unproject(this.camera);
    const dir = vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.y / dir.y;
    const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    // Check for snapping
    let snapPoint = null;
    for (const point of this.jointPoints) {
      if (point.distanceTo(pos) < this.snapDistance) {
        snapPoint = point;
        break;
      }
    }

    const finalPos = snapPoint || pos;
    this.points.push(finalPos.clone());

    if (this.points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        this.points[this.points.length - 2],
        finalPos,
      ]);
      const line = new THREE.Line(geometry, this.lineMaterial);
      this.scene.add(line);
      this.lines.push(line);
    }

    // Add joint point
    this.jointPoints.push(finalPos.clone());
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDrawingMode || this.points.length === 0) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0);

    vec.unproject(this.camera);
    const dir = vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.y / dir.y;
    const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    if (this.previewLine) {
      this.scene.remove(this.previewLine);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints([
      this.points[this.points.length - 1],
      pos,
    ]);
    this.previewLine = new THREE.Line(geometry, this.previewMaterial);
    this.scene.add(this.previewLine);
  }

  private onMouseUp() {
    // Placeholder for mouse up events
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.isDrawingMode = false;
      if (this.previewLine) {
        this.scene.remove(this.previewLine);
        this.previewLine = null;
      }
    }
  }

  // Public methods
  public toggleDrawingMode() {
    this.isDrawingMode = !this.isDrawingMode;
    if (!this.isDrawingMode && this.previewLine) {
      this.scene.remove(this.previewLine);
      this.previewLine = null;
    }
  }

  public setTopView() {
    this.camera.position.copy(this.topViewPosition);
    this.camera.lookAt(this.topViewTarget);
    this.controls.target.copy(this.topViewTarget);
  }

  public setThreeDView() {
    this.camera.position.copy(this.threeDViewPosition);
    this.camera.lookAt(this.threeDViewTarget);
    this.controls.target.copy(this.threeDViewTarget);
  }
}

export default Scene;