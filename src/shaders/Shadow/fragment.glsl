#define PI 3.14159265

uniform sampler2D tDiffuse;
uniform float uStrength;
uniform float uOpacity;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float samples = 20.;
  float bokeh = .001;

  vec4 sum = vec4(0.0);
  vec4 msum = vec4(0.0);

  float delta = 1.0 / samples;
  float di = 1.0 / (samples - 1.0);

  for (float i =- 0.5; i < .901; i += di) {
    vec4 color1 = texture2D(tDiffuse, vUv + vec2(uStrength, uStrength * .5) * i) * .5;
    vec4 color2 = texture2D(tDiffuse, vUv + vec2(uStrength * .5, uStrength) * i) * .5;

    vec4 color3 = texture2D(tDiffuse, vUv + vec2(uStrength, -uStrength * .5) * i) * .5;
    vec4 color4 = texture2D(tDiffuse, vUv + vec2(uStrength * .5, -uStrength) * i) * .5;

    vec4 color = mix(color1, color2, .5);
    color = mix(color, color3, .5);
    color = mix(color, color4, .5);

    sum += color * delta;
    msum = max(color, msum);
  }

  gl_FragColor = vec4(uColor, (mix(sum, msum, bokeh).w * 2.) * uOpacity);
}