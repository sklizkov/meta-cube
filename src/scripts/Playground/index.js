import * as THREE from 'three'

// Core
import { PlaygroundWorld } from 'Scripts/Core'

// Extensions
import PostProcessing from './PostProcessing'
import Mouse from './Mouse'

// Objects
import Background from './Background'
import Cube from './Cube'
import Shadow from './Shadow'


export default class Playground extends PlaygroundWorld {

  initialize() {
    // Viewport
    const { width, height, pixelRatio } = this.viewport

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, .1, 20)

    this.camera.rotation.reorder('YXZ')

    // Scene
    this.scene = new THREE.Scene()

    this.scene.add(this.camera)
    this.scene.add(this.target) // !!!

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })

    this.renderer.sortObjects = false
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.renderer.setClearColor(0xD7D7D7, 1)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)

    this.$container.appendChild(this.renderer.domElement)

    // Post Processing
    this.postProcessing = this.ext(PostProcessing, { 
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
    })

    // Debug
    if (this.gui) {
      this.gui.close()
    }
  }

  assetsStart() {
    // Objects
    this.add(Background)
    this.add(Shadow, { 
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
    })
  }

  assetsReady() {
    // Mouse
    this.ext(Mouse, { 
      camera: this.camera,
      renderer: this.renderer,
      rgbShift: this.postProcessing.rgbShiftPass,
      noise: this.postProcessing.noisePass,
    })

    // Objects
    this.add(Cube, { amount: 20 })
  }

  resize({ width, height, pixelRatio }) {
    // Camera
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    // Renderer
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)
  }

  // tick({ timestamp, deltaTime, elapsedTime, frameCount }) {
  //   this.renderer.render(this.scene, this.camera)
  // }

}