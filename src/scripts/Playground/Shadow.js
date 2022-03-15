import * as THREE from 'three'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Shadow/vertex.glsl'
import fragmentShader from 'Shaders/Shadow/fragment.glsl'


export default class Shadow extends PlaygroundObject {

  initialize() {
    // Render target
    this.renderTarget = new THREE.WebGLRenderTarget(512, 512)
    this.renderTarget.texture.generateMipmaps = false

    // Geometry
    this.geometry = new THREE.PlaneGeometry(2, 2)
    this.geometry.rotateX(-Math.PI / 2)

    // Material
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { 
        uTexture: { value: this.renderTarget.texture },
        uStrength: { value: .05 },
      },
      vertexShader,
      fragmentShader,
    })

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(1, 1, -1)
    this.mesh.position.y = -0.8

    this.add(this.mesh)

    // Camera
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 0.4)
    this.camera.rotation.x = Math.PI / 2
    this.camera.position.y = -0.8

    this.add(this.camera)

    // Debug
    if (this.gui) {
      const folder = this.gui.addFolder('Shadow')

      folder.add(this.material.uniforms.uStrength, 'value', 0.00, 0.10, .01).name('#️⃣ Blur')
    }
  }

  tick() {
    this.props.renderer.setRenderTarget(this.renderTarget)
    this.props.renderer.render(this.props.scene, this.camera)
    this.props.renderer.setRenderTarget(null)
  }

}