uniform sampler2D uTexture;
uniform float uStrength;

varying vec2 vUv;


void main() {
  vec3 color = vec3(0.);
  float alpha = 1.;

  // Blur
  float samples = 10.;
  float bokeh = .001;
  vec4 sum = vec4(0.0);
  vec4 msum = vec4(0.0);
  float delta = 1.0 / samples;
  float di = 1.0 / (samples - 1.0);

  for (float i =- 0.5; i < .901; i += di) {
    vec4 color1 = texture2D(uTexture, vUv + vec2(uStrength, uStrength * 2.) * i);
    vec4 color2 = texture2D(uTexture, vUv + vec2(uStrength * 2., uStrength) * i);

    vec4 color3 = texture2D(uTexture, vUv + vec2(uStrength, -uStrength * 2.) * i);
    vec4 color4 = texture2D(uTexture, vUv + vec2(uStrength * 2., -uStrength) * i);

    vec4 color = mix(color1, color2, .5);
    color = mix(color, color3, .5);
    color = mix(color, color4, .5);

    sum += color * delta;
    msum = max(color, msum);
  }

  color = mix(sum, msum, bokeh).rgb;

  // Opacity
  vec3 tmp_color = vec3(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
  alpha = smoothstep(0.1, 0.9, tmp_color.x);

  float pct = distance(vUv, vec2(0.5));

  gl_FragColor = vec4(color, (.9 - alpha) * (.5 - mix(0., 1., pct)));
}
