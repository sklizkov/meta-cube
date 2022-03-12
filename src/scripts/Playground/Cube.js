import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import SimplexNoise from 'simplex-noise'

import { PlaygroundObject } from 'Scripts/Core'


export default class Cube extends PlaygroundObject {

  constructor(...args) {
    super(...args)

    this.geometry = null
    this.material = null
    this.mesh = null

    this.simplex = new SimplexNoise(Math.random())
    this.dummy = new THREE.Object3D()

    this.shape = {
      shape: 'cube',
      matcap: 'black',
      transition: true,
    }

    this.noise = {
      scale: .4,
      speedX: -.2,
      speedY: 0,
      speedZ: 0,
    }
  }

  initialize() {
    // Geometry
    // this.geometry = new THREE.BoxGeometry(1, 1, 1)
    
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
    this.material = new THREE.MeshMatcapMaterial()
    this._setMatcap()

    // Mesh
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.pow(this.props.amount, 3))
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.scale.set(1 / this.props.amount, 1 / this.props.amount, 1 / this.props.amount)
    // this.mesh = new THREE.Mesh(this.geometry, this.material)


    // Add
    this.add(this.mesh)

    // Debug
    if (this.gui) {
      const shapeFolder = this.gui.addFolder('Shape')

      shapeFolder.add(this.shape, 'shape', [ 'cube', 'sphere' ]).name('⏹ Shape')
      shapeFolder.add(this.shape, 'matcap', [ 'black', 'white', 'red', 'orange', 'yellow', 'green', 'blue' ]).name('⏺ Matcap').onChange(() => this._setMatcap())
      shapeFolder.add(this.shape, 'transition').name('📶 Transition')

      // shapeFolder.close()

      const noiseFolder = this.gui.addFolder('Noise')

      noiseFolder.add(this.noise, 'scale', 0, 1, .02).name('🔼 Scale')
      noiseFolder.add(this.noise, 'speedX', -1, 1, .05).name('↘️ X')
      noiseFolder.add(this.noise, 'speedY', -1, 1, .05).name('⬆️ Y')
      noiseFolder.add(this.noise, 'speedZ', -1, 1, .05).name('↗️ Z')

      // noiseFolder.close()
    }
  }

  tick({ elapsedTime }) {
    const offset = (this.props.amount - 1) / 2

    let i = 0
    for (let x = 0; x < this.props.amount; x++) {
      for (let y = 0; y < this.props.amount; y++) {
        for (let z = 0; z < this.props.amount; z++) {
          const radius = this.props.amount / 2
          const distance = Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2) + Math.pow(z - radius, 2))

          if (this.shape.shape === 'cube' || distance < radius) {
            const
              noiseX = x / (this.noise.scale * 50) + elapsedTime * this.noise.speedX * .002,
              noiseY = y / (this.noise.scale * 50) + elapsedTime * this.noise.speedY * .002,
              noiseZ = z / (this.noise.scale * 50) + elapsedTime * -this.noise.speedZ * .002

            const
              posX = (offset - x) * 1.1,
              posY = (offset - y) * 1.1,
              posZ = (offset - z) * 1.1

            let scale = 0

            if (this.shape.transition) {
              scale = this.noise.scale === 0 ? 1 : Math.min(Math.max(0, this.simplex.noise3D(noiseX, noiseY, noiseZ) * 5), 1)
            } else {
              if (this.noise.scale === 0) {
                scale = 1
              } else {
                const n = this.simplex.noise3D(noiseX, noiseY, noiseZ)

                scale = n > 0 ? 1 : 0
              }
            }

            this.dummy.position.set(posX, posY, posZ)
            this.dummy.scale.set(scale, scale, scale)

            this.dummy.updateMatrix()

            this.mesh.setMatrixAt(i, this.dummy.matrix)
          } else {
            const
              posX = (offset - x) * 1.1,
              posY = (offset - y) * 1.1,
              posZ = (offset - z) * 1.1

            const
              scale = 0

            this.dummy.position.set(posX, posY, posZ)
            this.dummy.scale.set(scale, scale, scale)

            this.dummy.updateMatrix()

            this.mesh.setMatrixAt(i, this.dummy.matrix)
          }

          i++
        }
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true
  }

  _setMatcap() {
    const matcap = this.loader.getItem(this.shape.matcap)
    matcap.encoding = THREE.sRGBEncoding

    this.material.matcap = matcap
  }

}