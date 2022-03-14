#define PI 3.14159265

uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uStrength;

varying vec2 vUv;


vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;

  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;

  return color;
}

void main() {
  vec4 diffuseColor = texture2D(tDiffuse, vUv);
  vec4 blurColor = blur(tDiffuse, vUv, uResolution, uStrength);
  float blurStrength = 1.0 - sin(vUv.y * PI);

  gl_FragColor = mix(diffuseColor, blurColor, blurStrength);
}