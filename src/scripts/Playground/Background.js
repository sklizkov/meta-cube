import * as THREE from 'three'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Background/vertex.glsl'
import fragmentShader from 'Shaders/Background/fragment.glsl'


export default class Background extends PlaygroundObject {

  initialize() {
    // Geometry
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)

    // Material
    this.material = new THREE.ShaderMaterial({
      vertexColors: true,
      depthWrite: false,
      uniforms: {
        uColor1: { value: new THREE.Color('#EEEEEE') },
        uColor2: { value: new THREE.Color('#CBCBCB') },
        uColor3: { value: new THREE.Color('#FFFFFF') },
        uColor4: { value: new THREE.Color('#DDDDDD') },
      },
      vertexShader,
      fragmentShader,
    })

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.frustumCulled = false

    this.add(this.mesh)

    // Debug
    if (this.gui) {
      const folder = this.gui.addFolder('Background')

      folder.addColor(this.material.uniforms.uColor1, 'value').name('↖️ Top Left')
      folder.addColor(this.material.uniforms.uColor2, 'value').name('↗️ Top Right')
      folder.addColor(this.material.uniforms.uColor3, 'value').name('↘️ Bottom Right')
      folder.addColor(this.material.uniforms.uColor4, 'value').name('↙️ Bottom Left')

      folder.close()
    }
  }

}