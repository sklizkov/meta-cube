import * as THREE from 'three'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Background/vertex.glsl'
import fragmentShader from 'Shaders/Background/fragment.glsl'


export default class Background extends PlaygroundObject {

  constructor(...args) {
    super(...args)

    this.state = { 
      topLeft: '#EEEEEE', 
      topRight: '#AAAAAA', 
      bottomRight: '#FFFFFF', 
      bottomLeft: '#DDDDDD', 
    }
  }

  initialize() {
    // Geometry
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    this._setColors()

    // Material
    this.material = new THREE.ShaderMaterial({
      vertexColors: true,
      depthWrite: false,
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

      folder.addColor(this.state, 'topLeft').name('↖️ Top Left').onChange(() => this._setColors())
      folder.addColor(this.state, 'topRight').name('↗️ Top Right').onChange(() => this._setColors())
      folder.addColor(this.state, 'bottomRight').name('↘️ Bottom Right').onChange(() => this._setColors())
      folder.addColor(this.state, 'bottomLeft').name('↙️ Bottom Left').onChange(() => this._setColors())
    }
  }

  _setColors() {
    const topLeftColor = new THREE.Color(this.state.topLeft)
    const topRightColor = new THREE.Color(this.state.topRight)
    const bottomRightColor = new THREE.Color(this.state.bottomRight)
    const bottomLeftColor = new THREE.Color(this.state.bottomLeft)

    const colors = new Float32Array(4 * 3)
    
    colors[0] = topLeftColor.r
    colors[1] = topLeftColor.g
    colors[2] = topLeftColor.b
    
    colors[3] = topRightColor.r
    colors[4] = topRightColor.g
    colors[5] = topRightColor.b
    
    colors[9] = bottomRightColor.r
    colors[10] = bottomRightColor.g
    colors[11] = bottomRightColor.b

    colors[6] = bottomLeftColor.r
    colors[7] = bottomLeftColor.g
    colors[8] = bottomLeftColor.b

    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

}