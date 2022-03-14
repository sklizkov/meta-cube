uniform sampler2D matcap;

varying vec2 vUv;
varying vec2 viewNormal;


void main() {
  gl_FragColor = texture2D(matcap, viewNormal.xy);
}