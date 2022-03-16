uniform sampler2D tDiffuse;
uniform float uOffset;
uniform float uMultiplier;

varying vec2 vUv;


float random2d(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float distanceToCenter = length(vUv - 0.5);

  vec2 uv = vUv;
  float noiseDistance = max(0.0, distanceToCenter + uOffset);
  uv.x += (random2d(vUv) - 0.5) * noiseDistance * uMultiplier;
  uv.y += (random2d(vUv + 0.5) - 0.5) * noiseDistance * uMultiplier;

  gl_FragColor = texture2D(tDiffuse, uv);
}