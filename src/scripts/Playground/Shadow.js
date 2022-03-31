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

    // Camera
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, .8)
    this.camera.rotation.x = Math.PI / 2
    this.camera.position.y = -0.8

    this.add(this.camera)

    // Geometry
    this.geometry = new THREE.PlaneGeometry(2, 2)
    this.geometry.rotateX(-Math.PI / 2)

    // Material
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { 
        uTexture: { value: this.renderTarget.texture },
        uOpacity: { value: .4 },
        uStrength: { value: .6 },
      },
      vertexShader,
      fragmentShader,
    })

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(1, 1, -1)
    this.mesh.position.y = -0.8

    this.add(this.mesh)

    // Debug
    if (this.gui) {
      const helper = new THREE.CameraHelper(this.camera)
      helper.visible = false
      this.add(helper)

      const folder = this.gui.addFolder('Shadow')

      folder.add(helper, 'visible').name('🎦 Helper')
      folder.add(this.material.uniforms.uOpacity, 'value', 0, 1, .01).name('*️⃣ Opacity')
      folder.add(this.material.uniforms.uStrength, 'value', 0, 1, .01).name('#️⃣ Blur')
      folder.add(this.mesh.position, 'y', -5, 0, .01).name('↕️ Offset').onChange(next => {
        this.camera.far = Math.abs(next)
        this.camera.position.y = next
        this.camera.updateProjectionMatrix()

        helper.update()
      })
    }
  }

  tick() {
    this.props.background.visible = false

    this.props.renderer.setRenderTarget(this.renderTarget)
    this.props.renderer.render(this.props.scene, this.camera)
    this.props.renderer.setRenderTarget(null)

    this.props.background.visible = true
  }

}