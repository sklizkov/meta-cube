import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Cube/vertex.glsl'
import fragmentShader from 'Shaders/Cube/fragment.glsl'


export default class Cube extends PlaygroundObject {

  constructor(...args) {
    super(...args)

    this.state = {
      matcap: 'black',
    }
  }

  initialize() {
    // Geometry
    const topPlane = new THREE.PlaneGeometry(1, 1)
    topPlane.rotateX(-Math.PI / 2)
    topPlane.translate(0, 0.5, 0)

    const bottomPlane = new THREE.PlaneGeometry(1, 1)
    bottomPlane.rotateX(Math.PI / 2)
    bottomPlane.translate(0, -0.5, 0)

    const leftPlane = new THREE.PlaneGeometry(1, 1)
    leftPlane.rotateZ(Math.PI / 2)
    leftPlane.translate(0, 0, 0.5)

    const rightPlane = new THREE.PlaneGeometry(1, 1)
    rightPlane.rotateY(Math.PI / 2)
    rightPlane.translate(0.5, 0, 0)
    
    this.geometry = BufferGeometryUtils.mergeBufferGeometries([ topPlane, bottomPlane, leftPlane, rightPlane ])

    // Material
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 20 },
        uSpeed: { value: new THREE.Vector3(-.2, 0, 0) },
        uSmooth: { value: true },
        matcap : { value: null },
      },
      vertexShader,
      fragmentShader,
    })
    this._setMatcap()

    // Mesh
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.pow(this.props.amount, 3))
    this.mesh.scale.set(1 / this.props.amount, 1 / this.props.amount, 1 / this.props.amount)

    this.add(this.mesh)

    // ...
    const transform = new THREE.Object3D()

    const aPosition = new Float32Array(Math.pow(this.props.amount * 3, 3))

    let i = 0, j = 0

    for (let x = 0; x < this.props.amount; x++) {
      for (let y = 0; y < this.props.amount; y++) {
        for (let z = 0; z < this.props.amount; z++) {
          const offset = (this.props.amount - 1) / 2
          transform.position.set((offset - x) * 1.1, (offset - y) * 1.1, (offset - z) * 1.1)
          transform.updateMatrix()

          aPosition[j] = x
          j++
          aPosition[j] = y
          j++
          aPosition[j] = z
          j++

          this.mesh.setMatrixAt(i, transform.matrix)
          i++
        }
      }
    }

    this.geometry.setAttribute('aPosition', new THREE.InstancedBufferAttribute(aPosition, 3))

    // Debug
    if (this.gui) {
      const folder = this.gui.addFolder('Cube')

      folder.add(this.state, 'matcap', [ 'black', 'red', 'green', 'blue', 'yellow' ])
        .name('⏺ Matcap').onChange(() => this._setMatcap())

      // folder.close()
    }

    if (this.gui) {
      const folder = this.gui.addFolder('Noise')

      folder.add(this.material.uniforms.uSmooth, 'value').name('📶 Smooth')
      folder.add(this.material.uniforms.uScale, 'value', 0, 100, 1).name('📶 Scale')
      folder.add(this.material.uniforms.uSpeed.value, 'x', -1, 1, .01).name('↘️ Speed X')
      folder.add(this.material.uniforms.uSpeed.value, 'y', -1, 1, .01).name('⬆️ Speed Y')
      folder.add(this.material.uniforms.uSpeed.value, 'z', -1, 1, .01).name('↗️ Speed Z')

      // folder.close()
    }
  }

  tick({ elapsedTime }) {
    this.material.uniforms.uTime.value = elapsedTime * .001
  }

  _setMatcap() {
    const matcap = this.loader.getItem(this.state.matcap)
    matcap.encoding = THREE.sRGBEncoding

    this.material.uniforms.matcap.value = matcap
  }

}