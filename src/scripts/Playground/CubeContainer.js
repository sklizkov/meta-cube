import * as THREE from 'three'

import { PlaygroundObject } from 'Scripts/Core'

// Objects
import Shadow from './Shadow'
import Cube from './Cube'


export default class CubeContainer extends PlaygroundObject {

  initialize() {
    this.add(Cube, { amount: 20 })
    this.add(Shadow, this.props)
  }

}