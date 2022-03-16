import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

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

    // Effect Composer
    this.effectComposer = new EffectComposer(this.renderer)

    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)

    // Render Pass
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(this.renderPass)

    // Post Processing
    this.postProcessing = this.ext(PostProcessing, { 
      effectComposer: this.effectComposer, 
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
      finalPass: this.postProcessing.finalPass,
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

    // Effect Composer
    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)
  }

  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {
    // this.renderer.render(this.scene, this.camera)
    this.effectComposer.render()
  }

}