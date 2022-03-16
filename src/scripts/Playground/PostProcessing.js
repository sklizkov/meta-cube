import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { PlaygroundExtension } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/PostProcessing/vertex.glsl'
import fragmentShader from 'Shaders/PostProcessing/fragment.glsl'


export default class PostProcessing extends PlaygroundExtension {

  initialize() {
    this.finalPass = new ShaderPass({
      uniforms: { 
        tDiffuse: { value: null },
        uOffset: { value: -.1 },
        uMultiplier: { value: .0 },
        uAngle: { value: Math.PI / 180 * 45 },
      },
      fragmentShader,
      vertexShader,
    })

    this.props.effectComposer.addPass(this.finalPass)
  }

}