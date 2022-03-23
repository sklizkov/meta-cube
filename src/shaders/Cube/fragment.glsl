uniform sampler2D matcap;

varying vec2 vNormal;


void main() {
  gl_FragColor = texture2D(matcap, vNormal.xy);
}