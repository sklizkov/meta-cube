uniform sampler2D uTexture;
uniform float uStrength;
uniform float uOpacity;

varying vec2 vUv;


void main() {
  vec4 color = vec4(0.);

  // Blur
  float samples = 32.;
  float bokeh = .001;
  vec4 sum = vec4(0.0);
  vec4 msum = vec4(0.0);
  float delta = 1.0 / samples;
  float di = 1.0 / (samples - 1.0);
  float strength = uStrength * .1;

  for (float i =- 0.5; i < .901; i += di) {
    vec4 color1 = texture2D(uTexture, vUv + vec2(strength, strength * 2.) * i);
    vec4 color2 = texture2D(uTexture, vUv + vec2(strength * 2., strength) * i);

    vec4 color3 = texture2D(uTexture, vUv + vec2(strength, -strength * 2.) * i);
    vec4 color4 = texture2D(uTexture, vUv + vec2(strength * 2., -strength) * i);

    vec4 c = mix(color1, color2, .5);
    c = mix(c, color3, .5);
    c = mix(c, color4, .5);

    sum += c * delta;
    msum = max(c, msum);
  }

  color.rgb =  mix(sum, msum, bokeh).rgb;

  // Alpha
  float grayscale = color.r * (1. / 3.) + color.g * (1. / 3.) + color.b * (1. / 3.);
  float alpha = (1. - grayscale) * uOpacity - .1;

  gl_FragColor =  vec4(color.rgb, alpha);
}
