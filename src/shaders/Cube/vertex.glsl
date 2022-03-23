attribute vec3 aPosition;

uniform float uTime;
uniform float uScale;
uniform vec3 uSpeed;
uniform bool uSmooth;

varying vec2 vNormal;


#pragma glslify: snoise = require('../assets/simplex3.glsl')


void main() {
  // Matcap
  vec3 r = reflect(normalize(vec3(modelViewMatrix * vec4(position, 1.))), normalize(normalMatrix * normal));
  float m = 2. * sqrt(pow(r.x, 2.) + pow(r.y, 2.) + pow(r.z + 1., 2.));
  vNormal = r.xy / m + .5;

  // Noise
  float noise = snoise(aPosition / uScale + uSpeed * 2.5 * uTime) * 10.;
  noise = uSmooth ? min(max(0., noise), 1.) : 1. - step(noise, .2);

  // New Position
  vec3 newPosition = position * (uScale == 0.0 ? 1. : noise);

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(newPosition, 1.0);
}