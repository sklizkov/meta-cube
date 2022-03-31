import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Cube/vertex.glsl'
import fragmentShader from 'Shaders/Cube/fragment.glsl'


export default class Cube extends PlaygroundObject {

  initialize() {
    // Geometry
    const topPlane = new THREE.PlaneGeometry(1, 1)
    topPlane.rotateX(-Math.PI / 2)
    topPlane.translate(0, 0.5, 0)

    const bottomPlane = new THREE.PlaneGeometry(1.1, 1.1)
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
    const matcaps = {
      'black': this.loader.getItem('black'),
      'white': this.loader.getItem('white'),
      'red': this.loader.getItem('red'),
      'orange': this.loader.getItem('orange'),
      'yellow': this.loader.getItem('yellow'),
      'green': this.loader.getItem('green'),
      'blue': this.loader.getItem('blue'),
    }

    for (let matcap in matcaps) matcaps[matcap].encoding = THREE.sRGBEncoding

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 22 },
        uSpeed: { value: new THREE.Vector3(-.12, 0, 0) },
        uSmooth: { value: true },
        uSize: { value: this.props.amount },
        matcap : { value: Object.values(matcaps)[0] },
      },
      vertexShader,
      fragmentShader,
    })

    // Mesh
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.pow(this.props.amount, 3))
    this.mesh.scale.set(1 / this.props.amount, 1 / this.props.amount, 1 / this.props.amount)

    this.add(this.mesh)

    // Position
    const aPosition = new Float32Array(Math.pow(this.props.amount, 3) * 3)

    for (let i = 0, l = Math.pow(this.props.amount, 3); i < l; i++) {
      const x = i % this.props.amount
      const y = Math.floor(i / Math.pow(this.props.amount, 2))
      const z = Math.floor(i / this.props.amount) - Math.floor(i / Math.pow(this.props.amount, 2)) * this.props.amount

      const gap = 1.1
      const offset = -this.props.amount / 2

      aPosition[i * 3 + 0] = x * gap + offset
      aPosition[i * 3 + 1] = y * gap + offset
      aPosition[i * 3 + 2] = z * gap + offset
    }

    this.geometry.setAttribute('aPosition', new THREE.InstancedBufferAttribute(aPosition, 3))

    // Debug
    if (this.gui) {
      const folder = this.gui.addFolder('Material')

      folder.add(this.material.uniforms.matcap, 'value', Object.keys(matcaps)).name('⏺ MatCap').onChange(next => {
        this.material.uniforms.matcap.value = matcaps[next]
      })
    }
    
    if (this.gui) {
      const folder = this.gui.addFolder('Noise')

      folder.add(this.material.uniforms.uSmooth, 'value').name('📶 Smooth')
      folder.add(this.material.uniforms.uScale, 'value', 0, 100, 1).name('↔️ Scale')
      folder.add(this.material.uniforms.uSpeed.value, 'x', -1, 1, .01).name('↘️ Speed X')
      folder.add(this.material.uniforms.uSpeed.value, 'y', -1, 1, .01).name('⬆️ Speed Y')
      folder.add(this.material.uniforms.uSpeed.value, 'z', -1, 1, .01).name('↗️ Speed Z')
    }
  }

  tick({ deltaTime }) {
    this.material.uniforms.uTime.value += deltaTime * .001
  }

}