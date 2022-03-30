attribute vec3 aPosition;

uniform float uTime;
uniform float uScale;
uniform vec3 uSpeed;
uniform bool uSmooth;
uniform float uSize;

varying vec3 vNormal;
varying vec2 vMatcapNormal;
varying vec3 vPosition;


#pragma glslify: snoise = require('../assets/simplex3.glsl')


void main() {
  // Position
  float noise = snoise(aPosition / uScale - uSpeed * 2.5 * uTime) * 10.;
  noise = uSmooth ? min(max(0., noise), 1.) : 1. - step(noise, .2);

  vec3 newPosition = position * (uScale == 0.0 ? 1. : noise) + aPosition;

  // Matcap
  vec3 r = reflect(normalize(vec3(modelViewMatrix * vec4(newPosition, 1.))), normalize(normalMatrix * normal));
  float m = 2. * sqrt(pow(r.x, 2.) + pow(r.y, 2.) + pow(r.z + 1., 2.));
  vec2 norm = r.xy / m + .5;

  // Varyings
  vNormal = normal;
  vMatcapNormal = norm;
  vPosition = newPosition / uSize + .5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}