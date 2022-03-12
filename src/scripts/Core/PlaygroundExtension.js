import * as THREE from 'three'


export default class PlaygroundExtension {

  constructor({ viewport, loop, loader, gui }, props) {
    this.gui = gui
    this.viewport = viewport
    this.loop = loop
    this.loader = loader

    this.props = props
  }

  /**
   * Render
   */
  render() {
    this.initialize()

    this.viewport.on('resize', next => this.resize(next))
    this.loop.on('tick', next => this.tick(next))

    // this.loader.on('start', next => this.assetsStart(next))
    // this.loader.on('progress', next => this.assetsLoading(next))
    // this.loader.on('load', () => this.assetsReady())

    return this
  }

  /**
   * Resize
   */
  resize({ width, height, pixelRatio }) {}

  /**
   * Loop
   */
  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {}

  // /**
  //  * Loader
  //  */
  // assetsStart({ loaded, total }) {}

  // assetsLoading({ loaded, total }) {}

  // assetsReady() {}

  /**
   * Initialize
   */
  initialize() {}

}