uniform sampler2D matcap;

varying vec3 vNormal;
varying vec2 vMatcapNormal;
varying vec3 vPosition;


void main() {
  // Matcap
  vec4 color = texture2D(matcap, vMatcapNormal.xy);

  // Depth
  if (normalize(vNormal.x) + normalize(vNormal.y) + normalize(vNormal.z) == 0.) {
    color.rgb *= .25;
    color.a = 1. - vPosition.y;
  }

  gl_FragColor = color;
}