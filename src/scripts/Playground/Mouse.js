import * as THREE from 'three'
import normalizeWheel from 'normalize-wheel'

import { PlaygroundExtension } from 'Scripts/Core'


export default class Mouse extends PlaygroundExtension {

  initialize() {
    // Viewport
    const { width, height } = this.viewport

    // Spherical
    const sphericalOptions = { 
      radius: Math.max(1, height / width) * 3,
      phi: Math.PI * 0.4, 
      theta: Math.PI * 0.20, 
    }

    this.spherical = new THREE.Spherical(sphericalOptions.radius * 1.5, sphericalOptions.phi, sphericalOptions.theta)

    // Camera
    const cameraPosition = new THREE.Vector3()
    cameraPosition.setFromSpherical(this.spherical)

    this.props.camera.position.copy(cameraPosition)
    this.props.camera.position.add(new THREE.Vector3(0, 0, 0))
    this.props.camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Wheel
    this.wheel = { delta: sphericalOptions.radius, shift: 0 }

    document.addEventListener('mousewheel', e => {
      const normalized = normalizeWheel(e)

      this.wheel.delta += normalized.pixelY * .01
      this.wheel.delta = Math.max(2, Math.min(5, this.wheel.delta))
    })

    // Cursor
    this.cursor = { x: sphericalOptions.theta, y: sphericalOptions.phi, shiftX: 0, shiftY: 0 }

    document.addEventListener('mousemove', ({ clientX , clientY }) => {
      this.cursor.x = sphericalOptions.theta + (1 - clientX / window.innerWidth - .5) / 2
      this.cursor.y = sphericalOptions.phi + (1 - clientY / window.innerHeight - .5) / 4
    })

    // Double Click
    this.props.renderer.domElement.addEventListener('dblclick', () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

      if (!fullscreenElement) {
        const $canvas = this.props.renderer.domElement

        if ($canvas.requestFullscreen) {
          $canvas.requestFullscreen()
        } else if ($canvas.webkitRequestFullscreen) {
          $canvas.webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    })

    // Context Menu
    window.addEventListener('contextmenu', e => e.preventDefault())
  }

  /**
   * Loop
   */
  tick() {
    // Spherical
    this.wheel.shift = (this.wheel.delta - this.spherical.radius) * .1
    this.spherical.radius += this.wheel.shift

    this.cursor.shiftY =(this.cursor.y - this.spherical.phi) * .1
    this.spherical.phi += this.cursor.shiftY

    this.cursor.shiftX =(this.cursor.x - this.spherical.theta) * .1
    this.spherical.theta += this.cursor.shiftX

    // Camera
    const cameraPosition = new THREE.Vector3()
    cameraPosition.setFromSpherical(this.spherical)

    this.props.camera.position.copy(cameraPosition)
    this.props.camera.position.add(new THREE.Vector3(0, 0, 0))
    this.props.camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Post Processing
    const shift = Math.min(Math.abs(this.wheel.shift * .1), 0.003) + Math.min(Math.abs(this.cursor.shiftX * .15), 0.003) + Math.min(Math.abs(this.cursor.shiftY * .15), 0.003)

    this.props.finalPass.uniforms.uMultiplier.value = shift
  }

}