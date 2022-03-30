uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;

void main() {
  vec3 color = uColor1;
  color = mix(color, uColor2, vUv.x);
  color = mix(uColor3, color, vUv.y);

  vec3 tmpColor = color;
  color = mix(uColor4, color, vUv.x);
  color = mix(color, tmpColor, vUv.y);

  color = pow(color, vec3(2.));

  gl_FragColor = vec4(color, 1.0);
}