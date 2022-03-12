import * as THREE from 'three'

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Shadow/vertex.glsl'
import fragmentShader from 'Shaders/Shadow/fragment.glsl'


export default class Shadow extends PlaygroundObject {

  constructor(...args) {
    super(...args)

    this.renderTarget = null
    this.geometry = null
    this.dummyMaterial = null
    this.depthMaterial = null
    this.blurMaterial = null
    this.dummyMesh = null
    this.blurMesh = null
    this.shadowCamera = null

    this.shadowOptions = {
      offset: 0.8,
      blurColor: '#111',
    }
  }

  initialize() {
    // Render target
    this.renderTarget = new THREE.WebGLRenderTarget(512, 512)
    this.renderTarget.texture.generateMipmaps = false

    // Geometry
    this.geometry = new THREE.PlaneGeometry(2, 2)
    this.geometry.rotateX(-Math.PI / 2)

    // Materials
    this.dummyMaterial = new THREE.MeshBasicMaterial({ 
      map: this.renderTarget.texture, 
      opacity: 1, 
      transparent: true, 
      depthWrite: false, 
    })

    this.depthMaterial = new THREE.MeshDepthMaterial()
    this.depthMaterial.depthTest = false
    this.depthMaterial.depthWrite = false
    this.depthMaterial.userData.darkness = { value: 1 }

    this.depthMaterial.onBeforeCompile = shader => {
      shader.uniforms.darkness = this.depthMaterial.userData.darkness
      shader.fragmentShader = `
        uniform float darkness;

        ${ shader.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
        ) }
      `
    }

    this.blurMaterial = new THREE.ShaderMaterial({ 
      opacity: 1, 
      transparent: true, 
      uniforms: { 
        'tDiffuse': { value: null }, 
        'uStrength': { value: 0.08 }, 
        'uOpacity': { value: 0.5 }, 
        'uColor': { value: new THREE.Color(this.shadowOptions.blurColor) }, 
      }, 
      vertexShader, 
      fragmentShader, 
    })

    // Meshes
    this.dummyMesh = new THREE.Mesh(this.geometry, this.dummyMaterial)
    this.dummyMesh.scale.set(1, 1, -1)
    this.dummyMesh.position.y = -this.shadowOptions.offset
    this.dummyMesh.visible = false

    this.add(this.dummyMesh)

    this.blurMesh = new THREE.Mesh(this.geometry, this.blurMaterial)
    this.blurMesh.scale.set(1, 1, -1)
    this.blurMesh.position.y = -this.shadowOptions.offset
    this.blurMesh.visible = true

    this.add(this.blurMesh)

    // Camera
    this.shadowCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, this.shadowOptions.offset)
    this.shadowCamera.rotation.x = Math.PI / 2
    this.shadowCamera.position.y = -this.shadowOptions.offset

    this.add(this.shadowCamera)

    // Debug
    if (this.gui) {
      // Helpers
      // const shadowCameraHelper = new THREE.CameraHelper(this.shadowCamera)
      // this.add(shadowCameraHelper)

      // GUI
      const folder = this.gui.addFolder('Shadow')

      folder.add(this.shadowOptions, 'offset', 0, 2, .1).name('⏏️ Offset').onChange(() => {
        // Meshes
        this.dummyMesh.position.y = -this.shadowOptions.offset
        this.blurMesh.position.y = -this.shadowOptions.offset

        // Camera
        this.shadowCamera.far = this.shadowOptions.offset
        this.shadowCamera.updateProjectionMatrix()
        // shadowCameraHelper.update()
        this.shadowCamera.position.y = -this.shadowOptions.offset
      })

      folder.add(this.blurMaterial.uniforms.uStrength, 'value', 0, 0.2, .01).name('#️⃣ Blur Strength')
      folder.add(this.blurMaterial.uniforms.uOpacity, 'value', 0, 1.0, .05).name('#️⃣ Blur Opacity')

      folder.addColor(this.shadowOptions, 'blurColor').name('#️⃣ Blur Color').onChange(() => {
        this.blurMaterial.uniforms.uColor.value = new THREE.Color(this.shadowOptions.blurColor)
      })

      // folder.close()
    }
  }

  tick() {
    const initialBackground = this.props.scene.background
    this.props.scene.background = null

    this.props.scene.overrideMaterial = this.depthMaterial

    const initialClearAlpha = this.props.renderer.getClearAlpha()
    this.props.renderer.setClearAlpha(0)

    this.props.renderer.setRenderTarget(this.renderTarget)
    this.props.renderer.render(this.props.scene, this.shadowCamera)

    this.props.scene.overrideMaterial = null

    this.props.renderer.setRenderTarget(null)
    this.props.renderer.setClearAlpha(initialClearAlpha)
    this.props.scene.background = initialBackground

    this.blurMesh.material.uniforms.tDiffuse.value = this.renderTarget.texture
  }

}