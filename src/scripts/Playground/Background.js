import * as THREE from 'three'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Background/vertex.glsl'
import fragmentShader from 'Shaders/Background/fragment.glsl'


export default class Background extends PlaygroundObject {

  constructor(...args) {
    super(...args)

    this.geometry = null
    this.material = null
    this.mesh = null

    this.colorSet = { 
      topLeft: '#FFFFFF', 
      topRight: '#B0B5C0', 
      bottomRight: '#FFFFFF', 
      bottomLeft: '#CCCCCC', 
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

    // Add
    this.add(this.mesh)

    // Debug
    if (this.gui) {
      const folder = this.gui.addFolder('Background')

      folder.addColor(this.colorSet, 'topLeft').name('↖️ Top Left').onChange(() => this._setColors())
      folder.addColor(this.colorSet, 'topRight').name('↗️ Top Right').onChange(() => this._setColors())
      folder.addColor(this.colorSet, 'bottomRight').name('↘️ Bottom Right').onChange(() => this._setColors())
      folder.addColor(this.colorSet, 'bottomLeft').name('↙️ Bottom Left').onChange(() => this._setColors())

      // folder.close()
    }
  }

  _setColors() {
    const topLeftColor = new THREE.Color(this.colorSet.topLeft)
    const topRightColor = new THREE.Color(this.colorSet.topRight)
    const bottomRightColor = new THREE.Color(this.colorSet.bottomRight)
    const bottomLeftColor = new THREE.Color(this.colorSet.bottomLeft)

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