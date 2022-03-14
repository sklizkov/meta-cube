import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// Core
import { PlaygroundWorld } from 'Scripts/Core'

// Extensions
import Mouse from './Extensions/Mouse'

// Objects
import Background from './Background'
import Cube from './Cube'
import Shadow from './Shadow'

// Shaders
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

import vertexShader from 'Shaders/Blur/vertex.glsl'
import fragmentShader from 'Shaders/Blur/fragment.glsl'


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
    this.scene.add(this.target)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })

    this.renderer.sortObjects = false
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.renderer.setClearColor(0x000000, 1)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)

    this.$container.appendChild(this.renderer.domElement)

    // Post Processing
    this.effectComposer = new EffectComposer(this.renderer)

    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(renderPass)

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
    this.effectComposer.addPass(gammaCorrectionPass)

    const blurPass = new ShaderPass({
      uniforms: {
        tDiffuse    : { type: 't',  value: null },
        uResolution : { type: 'v2', value: null },
        uStrength   : { type: 'v2', value: null },
      },
      fragmentShader,
      vertexShader,
    })
    blurPass.material.uniforms.uResolution.value = new THREE.Vector2(width, height)
    blurPass.material.uniforms.uStrength.value = new THREE.Vector2(1, 1)
    this.effectComposer.addPass(blurPass)

    this.rgbShiftPass = new ShaderPass(RGBShiftShader)
    this.rgbShiftPass.material.uniforms.amount.value = 0.0
    this.rgbShiftPass.material.uniforms.angle.value = Math.PI / 180 * 45
    this.effectComposer.addPass(this.rgbShiftPass)

    // Debug
    if (this.gui) {
      // this.gui.close()
    }
  }

  assetsStart() {
    // Objects
    this.add(Background)
  }

  assetsReady() {
    // Objects
    this.add(Shadow, { camera: this.camera, scene: this.scene, renderer: this.renderer })
    this.add(Cube, { amount: 24 })

    // Mouse
    this.ext(Mouse, { camera: this.camera, renderer: this.renderer, effect: this.rgbShiftPass })
  }

  resize({ width, height, pixelRatio }) {
    // Camera
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    // Renderer
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)

    // Post Processing
    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)
  }

  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {
    this.effectComposer.render()
    // this.renderer.render(this.scene, this.camera)
  }

}