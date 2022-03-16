import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

import { PlaygroundExtension } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Noise/vertex.glsl'
import fragmentShader from 'Shaders/Noise/fragment.glsl'


export default class PostProcessing extends PlaygroundExtension {

  initialize() {
    // Viewport
    const { width, height, pixelRatio } = this.viewport

    // Effect Composer
    this.effectComposer = new EffectComposer(this.props.renderer)

    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)

    // Render Pass
    this.renderPass = new RenderPass(this.props.scene, this.props.camera)
    this.effectComposer.addPass(this.renderPass)

    // Gamma Correction
    this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
    this.effectComposer.addPass(this.gammaCorrectionPass)

    // RGB Shift
    this.rgbShiftPass = new ShaderPass(RGBShiftShader)
    this.rgbShiftPass.material.uniforms.amount.value = 0.0
    this.rgbShiftPass.material.uniforms.angle.value = Math.PI / 180 * 45
    this.effectComposer.addPass(this.rgbShiftPass)

    // Noise
    this.noisePass = new ShaderPass({
      uniforms: { 
        tDiffuse: { value: null },
        uOffset: { value: -.1 },
        uMultiplier: { value: .0 },
      },
      fragmentShader,
      vertexShader,
    })
    this.effectComposer.addPass(this.noisePass)
  }

  resize({ width, height, pixelRatio }) {
    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)
  }

  tick() {
    this.effectComposer.render()
  }

}