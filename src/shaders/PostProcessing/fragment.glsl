uniform sampler2D tDiffuse;
uniform float uOffset;
uniform float uMultiplier;
uniform float uAngle;

varying vec2 vUv;


float random2d(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 color = vec4(0.);

  // Noise
  float distanceToCenter = length(vUv - 0.5);
  vec2 uv = vUv;
  float noiseDistance = max(0.0, distanceToCenter + uOffset);
  uv.x += (random2d(vUv) - 0.5) * noiseDistance * (uMultiplier * 5.);
  uv.y += (random2d(vUv + 0.5) - 0.5) * noiseDistance * (uMultiplier * 5.);

  // gl_FragColor = texture2D(tDiffuse, uv);

  // RGB shift
  vec2 offset = uMultiplier * vec2( cos(uAngle), sin(uAngle));
  vec4 cr = texture2D(tDiffuse, uv + offset);
  vec4 cga = texture2D(tDiffuse, uv);
  vec4 cb = texture2D(tDiffuse, uv - offset);

  color = vec4(cr.r, cga.g, cb.b, cga.a);

  // Gamma Correction
  color = LinearTosRGB(color);

  gl_FragColor =  color;
}